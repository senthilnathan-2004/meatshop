import rateLimit from 'express-rate-limit';
      
export const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, 
      max:900000,
      message: 'Too many requests, please try again later.',
      standardHeaders: true, 
      legacyHeaders: false,
      });
