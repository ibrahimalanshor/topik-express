import 'reflect-metadata';
import { createApp } from './src/common/app/app';
import { serverConfig } from './src/config/server.config';
import { routes } from './src/routes';

export const server = createApp({
  routes,
  port: serverConfig.port,
});
