import { Request, Response, NextFunction } from "express";

interface ErrorMiddlewareConfig {
    log: boolean
}

export class BaseError {
    constructor(public status: number = 500, public errors: any = {}, public message: string = '') {}
}

export function createErrorMiddleware(config?: ErrorMiddlewareConfig) {
    return (err: BaseError | Error, req: Request, res: Response, next: NextFunction): Response => {
        if (err instanceof BaseError) {
            return res.status(err.status).json({
                status: err.status,
                message: err.message,
                errors: err.errors
            })
        }

        if (config?.log) {
            console.log(err)
        }

        return res.status(500).json({
            status: 500,
            errors: err
        })
    }
}