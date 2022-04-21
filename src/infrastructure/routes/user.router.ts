import { Router, Request, Response, NextFunction } from "express";
import { UserService } from "../../services/user.service";
import { UserModel } from "../db/models/user.model";
import { AuthModule } from "../hash.module";
import { Authorization } from "../middlewares/jwt_auth";
import { deleteValidator, loginValidator, registerValidator, updatePasswordValidator } from "../middlewares/validations/user.validator";
import { validationResult } from 'express-validator';
import { HttpError } from "../httpError.module";

const router = Router();
const modelDB = new UserModel();
const auth = new AuthModule();
const service = new UserService(modelDB, auth);

router.post('/register', 
    registerValidator, 
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // data validation
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw HttpError.BadRequest(errors.array());
            }

            await service.create(req.body, 'customer');
            res.status(201).json({message: 'created'}); 
        } catch(error) {
            next(error);
        }
    });

router.post('/login', 
    loginValidator,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // data validation
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw HttpError.BadRequest(errors.array());
            }
            const token = await service.auth(req.body.email, req.body.password)
            res.json({token});
        } catch(error) {
            next(error);
        }
    });

router.post('/register/employee', 
    registerValidator,
    Authorization('admin'),
    async (req: Request, res: Response, next: NextFunction) => {
    try {
        // data validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw HttpError.BadRequest(errors.array());
        }
        await service.create(req.body, 'employee');
        res.status(201).json({message: 'created'}); 
    } catch(error) {
        next(error);
    }
});

router.get('/users', 
    Authorization('admin'),
    async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await service.all();
        res.json({users: users}); 
    } catch(error) {
        next(error);
    }
});

router.delete('/delete/admin/:id', 
    deleteValidator,
    Authorization('admin'),
    async (req: Request, res: Response, next: NextFunction) => {
    try {
        // data validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw HttpError.BadRequest(errors.array());
        }
        await service.delete(req.decode.sub, req.decode.scope, req.params.id);
        res.json({message: 'deleted'}); 
    } catch(error) {
        next(error);
    }
});

router.delete('/delete/:id', 
    deleteValidator,
    Authorization('customer'),
    async (req: Request, res: Response, next: NextFunction) => {
    try {
        // data validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw HttpError.BadRequest(errors.array());
        }
        await service.delete(req.decode.sub, req.decode.scope, req.params.id);
        res.json({message: 'deleted'}); 
    } catch(error) {
        next(error);
    }
});

router.patch('/updatePassword', 
    updatePasswordValidator,
    Authorization('customer'),
    async (req: Request, res: Response, next: NextFunction) => {
    try {
        // data validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw HttpError.BadRequest(errors.array());
        }

        const {new_password, new_password_confirm} = req.body;
        await service.updatePassword(req.decode.sub, new_password, new_password_confirm);
        
        res.json({message: 'updated'}); 
    } catch(error) {
        next(error);
    }
});

export { router as UserRouter }