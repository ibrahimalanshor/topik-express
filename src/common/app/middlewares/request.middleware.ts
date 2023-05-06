import { ClassConstructor } from 'class-transformer';
import { RequestHandler, Request, Response, NextFunction } from 'express';
import { createObjectTransformerWithValidator } from '../../dto/transform-and-validate-object';
import { ValidationSchemaError } from '../../errors/validation-schema-error';
import { UnprocessableEntityError } from '../http-error/unprocessable-entity.error';

async function validateBody<T extends Record<string, any>>(
  classConstructor: ClassConstructor<T>,
  body: Record<string, any>
): Promise<T> {
  const validator = createObjectTransformerWithValidator<T>(classConstructor);

  const res = await validator(body);

  return res;
}

export function createBodyValidator<T extends Record<string, any>>(
  classConstructor: ClassConstructor<T>
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await validateBody(classConstructor, req.body);

      next();
    } catch (err) {
      if (err instanceof ValidationSchemaError) {
        next(new UnprocessableEntityError(err.errors));
      } else {
        next(err);
      }
    }
  };
}
