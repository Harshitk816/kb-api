import { Request, Response, NextFunction } from 'express';
import logger from './logger';

export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode    = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);

        if (statusCode >= 500) {
            logger.error({ err: this }, message);
        }
    }
}

export const action = (req:any, res:any, next:any) => {
    const httpStack = {
        req,
        res,
        next,
        user: req.user || null
    };

    const requestJSON = {
        body:  req.body  || {},
        query: req.query || {},
        user:  req.user  || null,
        get params() { return req.params || {}; }
    };

    // Attach both to req so any handler can access them
    req.httpStack  = httpStack;
    req.requestJSON = requestJSON;

    next();
};
