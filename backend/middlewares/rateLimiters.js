import rateLimit from "express-rate-limit";

// Rate Limiting - Protect against abuse
export const checkoutLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 orders per 15 minutes per IP
    message: "Too many checkout attempts, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
});

export const trackingLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30, // 30 tracking requests per IP
    message: "Too many tracking requests, please try again later",
});

export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // 100 requests per 15 minutes
    standardHeaders: false,
    legacyHeaders: false,
});
