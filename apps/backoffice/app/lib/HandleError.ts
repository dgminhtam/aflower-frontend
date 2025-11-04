export class BaseError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, BaseError.prototype);
    }
}

export class AuthorizationError extends Error {
    statusCode: number;

    constructor(message: string) {
        super(message);
        this.statusCode = 401;
        Object.setPrototypeOf(this, BaseError.prototype);
    }
}