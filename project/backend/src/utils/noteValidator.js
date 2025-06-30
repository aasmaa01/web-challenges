
import { prismaClient } from '../utils/prisma.js';
import { z } from 'zod';

export const noteModelValidation = z.object({
  title: z.string().min(1, 'Title must exist'),
  content: z.string().min(1, 'Content must exist'),
  authorName: z.string().optional(),
  isPublic: z.boolean().optional(),
});

// create note validation middleware
export const createNoteValidator = (req, res, next) => {

  try {
    req.body = noteModelValidation.parse(req.body); 
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Create Note Validation failed',
        errors: error.flatten().fieldErrors,
      });
    }
    next(error); 
  }
};

// update note middleware validator
export const updateNoteValidator = (req, res, next) => {

  const id = Number(req.params.id);
  if (Number.isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid note ID' });
  }

  try {
    req.body = noteModelValidation.partial().parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Update Note validation failed',
        errors: error.flatten().fieldErrors,
      });
    }
    next(error);
  }
};

// note id validation middleware
export const validateNoteId = (req, res, next) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid note ID' });
  }

  next(); 
};

