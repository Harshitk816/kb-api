import { Request, Response, NextFunction } from 'express';
import { jwtUtility, IJWTPayload } from '../utils/jwt';
import { AppError } from '../utils/http';
import { v4 as uuidv4 } from 'uuid';


export const authMiddleware = (req: any, _res: any, next: any): void => {
    try {
        const authHeader = req.headers.authorization;
    
        if (!authHeader?.startsWith('Bearer ')) {
            throw new AppError('No token provided', 401);
        }

         if (req.requestJSON) {
            req.requestJSON.user = req.user;
        }
        if (req.httpStack) {
            req.httpStack.user = req.user;
        }

        const token = authHeader.substring(7);
        req.user = jwtUtility.verifyAccessToken(token);
        next();
    } catch (err) {
        next(err);
    }
};
