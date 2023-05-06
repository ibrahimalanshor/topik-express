import express from 'express';

export interface RouterContext {
  req: express.Request;
  res: express.Response;
}

export function createResponse<T>(
  handler: (context: RouterContext) => T,
  status: number = 200
): express.RequestHandler {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<T | void> => {
    try {
      return await handler({ req, res });
    } catch (err) {
      next(err);
    }
  };
}

export function createJsonResponse<T>(
  handler: (context: RouterContext) => T,
  status: number = 200
): express.RequestHandler {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    try {
      const data = await handler({ req, res });

      return res.status(status).json({
        status,
        data,
      });
    } catch (err) {
      next(err);
    }
  };
}
