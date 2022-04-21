class CustomError extends Error {
    status?: number;
    errorData?: object;

    constructor(message: string, status?: number, errorData?: object) {
        super(message);
        this.message = message;
        this.status = status;
        this.errorData = errorData;
    }
}

export { CustomError }