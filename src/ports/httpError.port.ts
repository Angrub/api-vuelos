interface HttpErrorsPort {
    BadRequest: (errData: object) => Error;
    Unauthorized: () => Error;
    Forbidden: () => Error; 
    InternalServerError: (message: string) => Error;
}

export { HttpErrorsPort }