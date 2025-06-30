
import { prisma } from '../utils/prisma.js';
import { formatNote, formatNotes } from '../utils/noteFormatter.js';
import { httpError } from '../utils/errorHandler.js';

// get all notes
export const getNotes = async (req, res, next) => {
  let notes;

  try {
    notes = await prisma.note.findMany();
  } catch (err) {
    return next(err); 
  }

  try {
    const formatted = formatNotes(notes);
    return res.status(200).json(formatted);
  } catch (err) {
    return next(httpError('Failed to format notes', 500, 'FORMAT_FAILED'));
  }
};

// create note
export const createNote = async (req, res, next) => {
  const { title, content, authorName = 'Unknown', isPublic = true } = req.body;

  try {
    const created = await prisma.note.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        authorName,
        isPublic,
      },
    });

    res.status(201).json(formatNote(created));
  } catch (err) {
    next(err); 
  }
};

// get note by id
export const getNoteById = async (req, res, next) => {
  try {
    const note = await prisma.note.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!note) {
      return next(httpError('Note not found', 404, 'NOT_FOUND'));
    }

    res.status(200).json(formatNote(note));
  } catch (err) {
    next(err);
  }
};

// update note by id
export const updateNote = async (req, res, next) => {
  const noteId = Number(req.params.id);
  const { title, content, authorName, isPublic } = req.body;

  const updateData = {};
  if (title !== undefined) updateData.title = title;
  if (content !== undefined) updateData.content = content;
  if (authorName !== undefined) updateData.authorName = authorName;
  if (isPublic !== undefined) updateData.isPublic = isPublic;

  try {

    const existing = await prisma.note.findUnique({ where: { id: noteId } });
    if (!existing) {
      return next(httpError('Note not found', 404, 'NOT_FOUND'));
    }

    const updated = await prisma.note.update({
      where: { id: noteId },
      data: updateData,
    });

    res.status(200).json(formatNote(updated));
  } catch (err) {
    next(err);
  }
};

// delete note by id
export const deleteNote = async (req, res, next) => {
  const noteId = Number(req.params.id);

  try {
    const existing = await prisma.note.findUnique({ where: { id: noteId } });
    if (!existing) {
      return next(httpError('Note not found', 404, 'NOT_FOUND'));
    }

    await prisma.note.delete({ where: { id: noteId } });
    res.status(204).send(); 
  } catch (err) {
    next(err);
  }
};
