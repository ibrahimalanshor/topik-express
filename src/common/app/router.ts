import express from 'express';

type RequestHandler = express.RequestHandler | express.RequestHandler[];

class Router<T> {
  private router: express.Router = express.Router();
  private controller: T;

  constructor(controller: new () => T) {
    this.controller = new controller();
  }

  getRouter(): express.Router {
    return this.router;
  }

  get(path: string, handler: (controller: T) => RequestHandler): this {
    this.router.get(path, handler(this.controller));

    return this;
  }

  post(path: string, handler: (controller: T) => RequestHandler): this {
    this.router.post(path, handler(this.controller));

    return this;
  }

  patch(path: string, handler: (controller: T) => RequestHandler): this {
    this.router.patch(path, handler(this.controller));

    return this;
  }

  delete(path: string, handler: (controller: T) => RequestHandler): this {
    this.router.delete(path, handler(this.controller));

    return this;
  }
}

export function createRoute<T>(constructor: new () => T) {
  const router = new Router<T>(constructor);

  return router;
}
