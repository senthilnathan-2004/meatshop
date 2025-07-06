import {body} from 'express-validator'
export const regValidate = [
    
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters')
        .escape(),

    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6, max: 10 }).withMessage('Password must be between 6 and 10 characters'),
];