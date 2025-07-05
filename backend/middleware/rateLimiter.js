import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: {
        message: 'Too many login attempts. Please try again in 10 minutes.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
