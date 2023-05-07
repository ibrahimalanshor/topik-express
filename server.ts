import { createApp } from "./src/common/app/app";
import { routes } from "./src/routes";

export const server = createApp({
    routes
})