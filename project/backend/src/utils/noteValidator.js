import { z } from 'zod';

const MIN_TITLE_LENGTH = 3;
const MIN_CONTENT_LENGTH = 10;


export const noteCreationValidation = z.object({
  title: z
    .string()
    .min(MIN_TITLE_LENGTH, `Title must be at least ${MIN_TITLE_LENGTH} characters long`),
  content: z
    .string()
    .min(MIN_CONTENT_LENGTH, `Content must be at least ${MIN_CONTENT_LENGTH} characters long`),
  authorName: z.string().optional(),
  isPublic: z.boolean().optional(),
});

// Create note validation middleware
export const createNoteValidator = (req, res, next) => {
  try {
    req.body = noteCreationValidation.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Create Note validation failed',
        errors: error.flatten().fieldErrors,  
      });
    }
    next(error);
  }
};

// Update note validation middleware
export const updateNoteValidator = (req, res, next) => {

   if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({
      success: false,
      message: 'Update Note validation failed',
      errors: {
        general: ['Request body is missing or invalid'],
      },
    });
  }
  
  const noteUpdateValidation = noteCreationValidation
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field must be provided for update' }
  );

  try {
  req.body = noteUpdateValidation.parse(req.body);
  next();
  } catch (error) {
  if (error instanceof z.ZodError) {
  const isEmptyBodyError = error.errors.some(
        (e) => e.message === 'At least one field must be provided for update'
      );

      return res.status(400).json({
        success: false,
        message: 'Update Note validation failed',
        errors: isEmptyBodyError
          ? { general: ['At least one field must be provided for update'] }
          : error.flatten().fieldErrors,
      });
    }
    next(error); 
  }
};

// Note ID format middleware 
export const validateNoteId = (req, res, next) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid note ID',
      errors: { id: ['Note ID must be a positive integer'] }
    });
  }

  next();
};
