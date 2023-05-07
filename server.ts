import 'reflect-metadata';
import { createApp } from './src/common/app/app';
import { appConfig } from './src/config/app.config';
import { serverConfig } from './src/config/server.config';
import { routes } from './src/routes';

export const server = createApp({
  routes,
  port: serverConfig.port,
  errorLog: appConfig.errorLog,
  log: appConfig.log,
});
