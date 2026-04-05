export class AppError extends Error{
    public readonly statusCode: number;
    public readonly status: string;

    constructor(statusCode: number, message: string){
        super(message);

        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode<500 ? 'FAIL' : 'ERROR';
        
        Error.captureStackTrace(this, this.constructor);
    }
}