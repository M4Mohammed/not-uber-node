import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';
import AuthenticationException from '../exceptions/authentication.exception.js';
import SystemConflict from '../exceptions/system.conflict.error.js';
import NoSuchItemException from '../exceptions/no.such.item.exception.js';
import AuthorizationException from '../exceptions/authorization.exception.js';
import SystemException from '../exceptions/system.exception.js';
import IllegalStateException from '../exceptions/illegal.state.exception.js';
import { Prisma } from '@prisma/client';
import logger from '../utils/logger.js';

//TODO: change this 'any' to the correct type
const errorHandler: any = (error: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    logger.error(error.code);
  }
  logger.error(error.stack);
  if (error instanceof AuthenticationException || error instanceof JsonWebTokenError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: error.message });
  } else if (error instanceof AuthorizationException) {
    return res.status(StatusCodes.FORBIDDEN).json({ message: error.message });
  } else if (error instanceof NoSuchItemException) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
  } else if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'entity not found' });
  } else if (error instanceof IllegalStateException || error instanceof ZodError) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  } else if (error instanceof SystemConflict) {
    return res.status(StatusCodes.CONFLICT).json({ message: error.message });
  } else if (error instanceof SystemException) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  } else {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};

export default errorHandler;