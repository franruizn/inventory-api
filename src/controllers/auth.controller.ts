import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export const AuthController = {
    register: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const user = await AuthService.register(req.body);

            res.status(201).json({data: user})
        } catch (err) {
            next(err)
        }
    },

    login: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const token = await AuthService.login(req.body);

            res.json({data: token})
        } catch (err) {
            next(err)
        }
    }
}