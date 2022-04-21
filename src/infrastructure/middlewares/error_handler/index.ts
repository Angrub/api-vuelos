import { NextFunction, Response, Request } from "express";
import { CustomError } from "./customError";

function errorHandler(err: CustomError, req: Request, res: Response, next: NextFunction) {
    if(!err.status) {
        res.status(500).json({
            error: 'Internal server error'
        });

    } else {
        const data = err.errorData ? err.errorData : err.message;
        res.status(err.status).json({
            error: data
        });
    }
}

export { errorHandler }