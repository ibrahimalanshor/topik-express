import { Request, Response, RequestHandler, NextFunction } from 'express';

function trimObjectValues(values: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      typeof value === 'string' ? value.trim() : value,
    ])
  );
}

export function createTrimBodyMiddleware(): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    req.body = trimObjectValues(req.body);

    return next();
  };
}
