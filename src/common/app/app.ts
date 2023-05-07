import http from 'http';
import express from 'express';
import { createErrorMiddleware } from './error';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

interface AppConfig {
  plugins: express.RequestHandler[];
  routes: express.Router[];
  errorLog: boolean;
  log: boolean;
  port: number;
}

class App {
  httpServer: http.Server;
  server: express.Application;
  config: AppConfig = {
    plugins: [],
    routes: [],
    errorLog: true,
    log: true,
    port: 4000,
  };

  constructor(server: express.Application, config?: Partial<AppConfig>) {
    this.server = server;
    this.httpServer = http.createServer(this.server);

    if (config) {
      this.config.plugins = config.plugins || [];
      this.config.routes = config.routes || [];
      this.config.errorLog = config.errorLog ?? true;
      this.config.log = config.log ?? true;
      this.config.port = config.port || 4000;
    }

    this.setPlugin();
    this.setRoutes();
    this.setErrorHandler();
  }

  private setPlugin() {
    this.config.plugins.forEach((plugin: express.RequestHandler) => {
      this.server.use(plugin);
    });
  }

  private setRoutes() {
    this.config.routes.forEach((route: express.Router) => {
      this.server.use(route);
    });
  }

  private setErrorHandler() {
    this.server.use(createErrorMiddleware({ log: this.config.errorLog }));
  }

  public listen(cb?: (port: number) => any) {
    const port = this.config.port;

    this.server.listen(port, () => {
      cb ? cb(port) : console.log(`server running at ${port}`);
    });
  }
}

export function createApp(config: Partial<AppConfig>): App {
  const server = express();

  server.use(express.urlencoded({ extended: true }));
  server.use(express.json());

  if (config.log) {
    server.use(morgan('tiny'));
  }

  server.use(helmet());
  server.use(cors());

  return new App(server, config);
}
