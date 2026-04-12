import { z } from 'zod';

export const CreateUserSchema = z.object({
    email: z.email(),
    pass: z.string().min(8).max(100),
})

export const LoginUserSchema = z.object({
    email: z.email(),
    pass: z.string().min(1),
})

export const UpdateUserSchema = CreateUserSchema.partial();

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
export type LoginUserDto = z.infer<typeof LoginUserSchema>;