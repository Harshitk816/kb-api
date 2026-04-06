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

        const token = authHeader.substring(7);  
        const decoded = jwtUtility.verifyAccessToken(token);
        req.user = decoded;

        if (req.requestJSON) {
            req.requestJSON.user = decoded;
        }
        if (req.httpStack) {
            req.httpStack.user = decoded;
        }
        
        next();
    } catch (err) {
        next(err);
    }
};
