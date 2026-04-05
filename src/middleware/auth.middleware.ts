import { Request, Response, NextFunction } from 'express';
import { jwtUtility, IJWTPayload } from '../utils/jwt';
import { AppError } from '../utils/http';


export const authMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            throw new AppError('No token provided', 401);
        }

        const token = authHeader.substring(7);
        req.user = jwtUtility.verifyAccessToken(token);
        next();
    } catch (err) {
        next(err);
    }
};
