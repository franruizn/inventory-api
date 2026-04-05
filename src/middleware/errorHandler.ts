import { AppError } from "../errors/AppError";

export const errorHandler = (err: any, req: any, res: any, next: any) => {
    if (err instanceof AppError){
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }

    return res.status(500).json({
        status: 'ERROR',
        message: 'Internal Server Error'
    })
}