import { pool } from '../config/db';
import { CreateItemDto, PaginationQuery, UpdateItemDto } from '../schemas/inventory.schema';

export interface Item {
    id: number;
    name: string;
    sku: string;
    quantity: number;
    price: number;
    category: string;
    description: string | null;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}

export const InventoryRepository = {
    findAll: async ({ page, limit, category }: PaginationQuery) => {
        const offset = (page - 1) * limit;
        let sql = 'SELECT * FROM items WHERE deleted_at IS NULL';
        const params: (string | number)[] = [];
        
        if (category) {
            sql += ' AND category = ?';
            params.push(category);
        }
        
        sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);
        
        const [rows] = await pool.query(sql, params);
        return (rows as unknown as Item[]) ?? null;
    },

    findById: async (id: number) => {
        const [rows] = await pool.query('SELECT * FROM items WHERE id = ? AND deleted_at IS NULL', [id]);
        return (rows as unknown as Item[])[0] ?? null;
    },

    findBySku: async (sku: string) => {
        const [rows] = await pool.query('SELECT * FROM items WHERE sku = ?', [sku]);
        return (rows as unknown as Item[])[0] ?? null;
    },

    create: async (data: CreateItemDto): Promise <number> => {
        const [result] = await pool.query('INSERT INTO items SET ?', [data]);
        return (result as any).insertId;
    },

    softDelete: async (id: number) => {
        await pool.query('UPDATE items SET deleted_at = NOW() WHERE id = ?', [id]);
    },

    update: async (id: number, data: UpdateItemDto) => {
        const fields = Object.keys(data);

        const setClause = fields.map(field => (`${field} = ?`)).join(',');
        const values = fields.map(field => (data as any)[field]);

        await pool.query(`UPDATE items SET ${setClause}, updated_at = NOW() WHERE id = ?`, [...values, id])
    }
};