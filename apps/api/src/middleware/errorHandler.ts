import { Prisma } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error:', err);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2021') {
      res.status(503).json({
        error:
          'Database is missing interview tables. From the repo root run: npm run db:push (syncs schema). If you use migrations only, run: npm run db:migrate',
        ...(process.env.NODE_ENV === 'development' && { code: err.code, meta: err.meta }),
      });
      return;
    }
  }

  if (err instanceof Error && err.name === 'ZodError') {
    res.status(400).json({
      error: 'Validation error',
      details: err.message,
    });
    return;
  }

  const message = err instanceof Error ? err.message : 'Internal server error';
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? message : undefined,
  });
}


