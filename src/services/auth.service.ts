import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { AppError } from "../errors/AppError";
import { CreateUserDto, LoginUserDto } from "../schemas/auth.schema"; 
import { AuthRepository } from "../repositories/auth.repository";
import { config } from "../config/config";

export const AuthService = {
    register: async (data: CreateUserDto) => {
        const existingUser = await AuthRepository.getByEmail(data.email);

        if(existingUser) { throw new AppError(409, `Email ${data.email} is already registered`)};

        const hashedPass = await bcrypt.hash(data.pass, 10);

        const insertId = await AuthRepository.create({
            email: data.email,
            pass: hashedPass,
        });

        return {
            id: insertId,
            email: data.email,
        };
    },

    login: async (data: LoginUserDto) => {
        const existingUser = await AuthRepository.getByEmail(data.email);

        if(!existingUser) { throw new AppError(401, `Invalid email or password`)};

        const passwordMatches = await bcrypt.compare(data.pass, existingUser.password_hash);

        if(!passwordMatches) { throw new AppError(401, `Invalid email or password provided`)};

        const token = jwt.sign(
            { userId: existingUser.id, email: data.email },
            config.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return token;
    }
}