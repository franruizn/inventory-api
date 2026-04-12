import { Request, Response, NextFunction } from "express"
import { AppError } from "../errors/AppError";
import jwt from 'jsonwebtoken'
import { config } from "../config/config";

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization?.split(' ')[1];

    if( !authHeader ) { next( new AppError(401, `Invalid authorization token`)); return;};

    try {
        const decoded = jwt.verify(authHeader, config.JWT_SECRET);

        (req as any).user = decoded;

        next();
    } catch (err) {
        next(new AppError(401, 'Invalid authorization token'));
    }
}