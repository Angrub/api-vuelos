import { body, param } from 'express-validator';

const registerValidator = [
    body('username').exists({checkFalsy: true}).isString(),
    body('email').normalizeEmail().isEmail(),
    body('password').isLength({min: 10})
];

const loginValidator = [
    body('email').normalizeEmail().isEmail(),
    body('password').isLength({min: 10})
];

const deleteValidator = param('id').exists({checkFalsy: true}).isString(); 

const updatePasswordValidator = [
    body('new_password').isLength({min: 10}),
    body('new_password_confirm').isLength({min: 10})
];

export { 
    registerValidator, 
    loginValidator,
    deleteValidator,
    updatePasswordValidator 
}