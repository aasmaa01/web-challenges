import { prisma } from '../utils/prisma.js';
import { formatNote, formatNotes } from '../utils/noteFormatter.js';
import { httpError } from '../utils/errorHandler.js';

// Get all notes
export const getNotes = async (req, res, next) => {
  try {
    const notes = await prisma.note.findMany();
    const formattedNotes = formatNotes(notes);
    return res.status(200).json(formattedNotes);
  } catch (error) {
    next(httpError('Failed to fetch or format notes', 500));
  }
};

// Create a new note
export const createNote = async (req, res, next) => {
  const {
    title,
    content,
    authorName = 'Unknown',
    isPublic = true,
  } = req.body;

  try {
    const createdNote = await prisma.note.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        authorName,
        isPublic,
      },
    });

    res.status(201).json(formatNote(createdNote));
  } catch (error) {
    next(httpError('Note creation failed', 500));
  }
};

// Get note by ID
export const getNoteById = async (req, res, next) => {
  try {
    const note = await prisma.note.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });

    if (!note) {
      return next(httpError('Note not found', 404));
    }

    res.status(200).json(formatNote(note));
  } catch (error) {
    next(error);
  }
};

// Update note
export const updateNote = async (req, res, next) => {
  const noteId = Number(req.params.id);
  const { title, content, authorName, isPublic } = req.body;

  const updateData = {};
  if (title !== undefined) updateData.title = title.trim();
  if (content !== undefined) updateData.content = content.trim();
  if (authorName !== undefined) updateData.authorName = authorName;
  if (isPublic !== undefined) updateData.isPublic = isPublic;

  if (Object.keys(updateData).length === 0) {
    return next(httpError('No fields provided to update', 400));
  }

  try {
    const existingNote = await prisma.note.findUnique({
      where: { id: noteId },
    });

    if (!existingNote) {
      return next(httpError('Note not found', 404));
    }

    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: updateData,
    });

    res.status(200).json(formatNote(updatedNote));
  } catch (error) {
    next(error);
  }
};

// Delete a note
export const deleteNote = async (req, res, next) => {
  const noteId = Number(req.params.id);

  try {
    await prisma.note.delete({ where: { id: noteId } });
    return res.status(204).send(); 
  } catch (error) {
    next(error);
  }
};
