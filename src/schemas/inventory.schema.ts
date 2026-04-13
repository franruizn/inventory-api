import { z } from 'zod';

export const CategoryEnum = z.enum([
    'electronics', 'clothing', 'food', 'other'
]);

export const CreateItemSchema = z.object({
    name: z.string().min(2).max(100).trim(),
    sku: z.string().regex(/^[A-Z0-9-]{3,20}$/, 'SKU: uppercase + digits, 3-20 chars'),
    quantity: z.number().int().min(0).max(999999),
    price: z.number().positive().multipleOf(0.01),
    category: CategoryEnum,
    description: z.string().max(500).optional(),
});

export const UpdateItemSchema = CreateItemSchema.partial();
export const PaginationSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    category: CategoryEnum.optional()
});

export type CreateItemDto = z.infer<typeof CreateItemSchema>;
export type UpdateItemDto = z.infer<typeof UpdateItemSchema>;
export type PaginationQuery = z.infer<typeof PaginationSchema>;