import { z } from 'zod';

export const CreateUserSchema = z.object({
    email: z.email(),
    pass: z.string().min(8).max(100),
})

export const LoginUserSchema = z.object({
    email: z.email(),
    pass: z.string().min(1),
})


export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type LoginUserDto = z.infer<typeof LoginUserSchema>;