import * as dotenv from 'dotenv';
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { baseRouter } from './base.router';
import { AppError } from './utils/http';
import { db } from './utils/database';
import logger from './utils/logger';


dotenv.config();
const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    res.on('finish', () => {
        logger.info({
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            responseTime: `${Date.now() - start}ms`,
            ip: req.ip,
            userId: req.user?.userId || null    // from auth middleware
        }, 'Request completed');
    });

    next();
});


app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/v1', baseRouter);

app.use((req: Request, _res: Response, next: NextFunction) => {
    next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const statusCode = err.statusCode || 500;

    // Log with full context
    logger.error({
        err,
        method: req.method,
        url: req.originalUrl,
        userId: req.user?.userId || null
    }, err.message || 'Internal Server Error');

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
});

const PORT = process.env.PORT || 3000;

db.connect()
    .then((conn) => {
        conn.done();
        logger.info('Database connected');
        app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
    })
    .catch((err) => {
        logger.fatal({ err }, 'Database connection failed');
        process.exit(1);
    });


