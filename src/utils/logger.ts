import bunyan from 'bunyan';

const logger = bunyan.createLogger({
    name: 'kb-api',
    streams: [
        {
            // Human-readable output in development
            level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
            stream: process.stdout
        },
        {
            // Error logs always written to file
            level: 'error',
            path: 'logs/error.log'
        },
        {
            // All logs written to file in production
            level: 'info',
            path: 'logs/combined.log'
        }
    ],
    serializers: {
        // Built-in serializers for req/res/err objects
        req: bunyan.stdSerializers.req,
        res: bunyan.stdSerializers.res,
        err: bunyan.stdSerializers.err
    }
});

export default logger;
