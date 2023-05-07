import express from 'express'

export interface Controller {
    getRouter: () => express.Router
}

export abstract class BaseController implements Controller {
    router: express.Router = express.Router()

    abstract getRouter(): express.Router
}