import { HttpErrorsPort } from "../ports/httpError.port";
import { CustomError } from "./middlewares/error_handler/customError";

// static not work with interfaces
class HttpError implements HttpErrorsPort {

    constructor(){}

    BadRequest(errData: object) {
        return new CustomError('Bad Request', 400, errData);
    }

    Unauthorized() {
        return new CustomError('Unauthorized', 401);
    }
    
    Forbidden() {
        return new CustomError('Forbidden', 403);
    }

    InternalServerError(message: string) {
        return new CustomError(message);
    }
}

const instance = new HttpError();

export { instance as HttpError }