import http from 'http'
import express from 'express'
import { createErrorMiddleware } from './error'

interface AppConfig {
    plugins: express.RequestHandler[],
    routes: express.Router[],
    errorLog: boolean
}

class App {
    httpServer: http.Server
    server: express.Application
    config: AppConfig = {
        plugins: [],
        routes: [],
        errorLog: true
    }

    constructor(server: express.Application, config?: Partial<AppConfig>) {
        this.server = server
        this.httpServer = http.createServer(this.server)

        if (config) {
            this.config.plugins = config.plugins || []
            this.config.routes = config.routes || []
            this.config.errorLog = config.errorLog ?? true
        }
        
        this.setPlugin()
        this.setRoutes()
        this.setErrorHandler()
    }

    private setPlugin() {
        this.config.plugins.forEach((plugin: express.RequestHandler) => {
            this.server.use(plugin)
        })
    }

    private setRoutes() {
        this.config.routes.forEach((route: express.Router) => {
            this.server.use(route)
        })
    }

    private setErrorHandler() {
        this.server.use(createErrorMiddleware({ log: this.config.errorLog }))
    }
}

export function createApp(config: Partial<AppConfig>): App {
    const server = express()

    server.use(express.urlencoded({ extended: true }))
    server.use(express.json())

    return new App(server, config)
}