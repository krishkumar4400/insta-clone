interface ApiErrorOptions {
    statusCode: number,
    message?: string,
    errors?: unknown[]
}

class ApiError extends Error {
    statusCode: number;
    errors: unknown[];
    data: null;
    success: false;

    constructor({ statusCode, message = "Something went wrong", errors = [] }: ApiErrorOptions) {
        super(message);

        this.name = "ApiError";
        this.statusCode = statusCode;
        this.errors = errors;
        this.data = null;
        this.success = false;

        Object.setPrototypeOf(this, ApiError.prototype);
    }
}

export default ApiError;
