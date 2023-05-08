import { Request, Response, NextFunction, RequestHandler } from 'express';

function removeUndefinedValues(raw: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(raw).filter(([key, value]) => value !== undefined)
  );
}

export function createRemoveUndefinedValuesMiddleware(): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    req.query = removeUndefinedValues(req.query);

    next();
  };
}
