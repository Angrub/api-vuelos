import { NextFunction, Request, Response } from "express";
import { Scope } from "../../../entities/user.entity";
import Jwt from 'jsonwebtoken';
import { config } from "../../../config";
import { HttpError } from "../../httpError.module";
import { Types } from 'mongoose';

interface DecodePayload extends Jwt.JwtPayload {
    sub: string;
    scope: Scope;
    id: Types.ObjectId;
}

function Authorization(type: Scope) {
    enum permissions {
        'admin' = 3,
        'employee' = 2,
        'customer' = 1
    }

    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.header('Authorization');

            if(token) {
                const decode = <DecodePayload>Jwt.verify(token, config.app.jwtSecret);
                if(permissions[decode.scope]  >= permissions[type]) {
                    req.decode = decode;
                    next();
                } else {
                    throw HttpError.Forbidden();
                }
                
            } else {
                throw HttpError.Unauthorized();
            }
        } catch(error) {
            next(error);
        }
    }
}

export { Authorization, DecodePayload }