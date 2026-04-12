import { pool } from "../config/db";
import { CreateUserDto } from "../schemas/auth.schema";

interface User {
    id: number,
    email: string,
    password_hash: string,
    created_at: Date,
}

export const AuthRepository = {
    getByEmail: async (email: string): Promise<User | null> => {
        const rows = await pool.query(`SELECT * FROM users WHERE email = ?`, [email])

        return (rows as unknown as User[])[0] ?? null;
    },

    getById: async (id: string): Promise<User | null> => {
        const rows = await pool.query(`SELECT * FROM users WHERE id = ?`, [id])

        return (rows as unknown as User[])[0] ?? null;;
    },

    create: async (data: CreateUserDto) => {
        const result = pool.query(`INSERT INTO users SET ?`, [data]);

        return (result as any).insertId;
    }


} 