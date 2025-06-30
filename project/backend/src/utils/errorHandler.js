import { Prisma } from '@prisma/client';

export const errorHandler = (error, req, res, next) => {
  console.error('Error:', error);

  // Prisma-specific errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': // Unique constraint failed
        return res.status(409).json({
          message: 'Note already exists',
          code: error.code,
        });

      case 'P2025': // Record not found
        return res.status(404).json({
          message: 'Note not found',
          code: error.code,
        });
    }
  }

  // Custom status code thrown manually (e.g. with `throw { statusCode: 400, message: "Bad Request" }`)
  if (error.statusCode) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  // Fallback for any other unknown errors
  return res.status(500).json({
    success: false,
    message: error.message || 'Internal server error',
  });
};

export const httpError = (message, statusCode = 500) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};