import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ZodError) {
    response.status(400).json({ message: 'Dados inválidos.', issues: error.flatten() });
    return;
  }

  if (error instanceof Error && error.name === 'CastError') {
    response.status(400).json({ message: 'Identificador inválido.' });
    return;
  }

  if (typeof error === 'object' && error && 'code' in error && error.code === 11000) {
    response.status(409).json({ message: 'Já existe um registro com os dados informados.' });
    return;
  }

  console.error(error);
  response.status(500).json({ message: 'Erro interno do servidor.' });
};
