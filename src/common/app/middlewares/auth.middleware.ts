import { RequestHandler, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getString } from '../../resource/get-string';
import { authConfig } from '../../../config/auth.config';
import { UnauthorizedError } from '../http-error/unauthorized.error';

export function createAuthMiddleware(): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new Error(getString('authorization-token-required') as string);
      }

      await jwt.verify(token, authConfig.key);

      next();
    } catch (err) {
      next(new UnauthorizedError(err));
    }
  };
}
