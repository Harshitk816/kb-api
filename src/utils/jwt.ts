import jwt, { SignOptions } from 'jsonwebtoken';
import { AppError } from './http';

export interface IJWTPayload {
    userId: number;
    email: string;
    username: string;
}

class JWTUtility {
    private secret = process.env.JWT_SECRET || 'dev-secret-change-in-prod';
    private refreshSecret = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret';

    private expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'];
    private refreshExpiresIn = (process.env.JWT_REFRESH_EXPIRES_IN || '30d') as SignOptions['expiresIn'];

    generateAccessToken(payload: IJWTPayload): string {
        return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
    }

    generateRefreshToken(payload: IJWTPayload): string {
        return jwt.sign(payload, this.refreshSecret, { expiresIn: this.refreshExpiresIn });
    }

    verifyAccessToken(token: string): IJWTPayload {
        try {
            return jwt.verify(token, this.secret) as IJWTPayload;
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) throw new AppError('Token expired', 401);
            throw new AppError('Invalid token', 401);
        }
    }

    verifyRefreshToken(token: string): IJWTPayload {
        try {
            return jwt.verify(token, this.refreshSecret) as IJWTPayload;
        } catch {
            throw new AppError('Invalid refresh token', 401);
        }
    }
}

export const jwtUtility = new JWTUtility();
