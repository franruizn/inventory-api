import { pool } from '../config/db';
import { CreateItemDto, PaginationQuery, UpdateItemDto } from '../schemas/inventory.schema';

export const InventoryRepository = {
    findAll: async ({ page, limit, category }: PaginationQuery) => {
        const offset = (page - 1) * limit;
        let sql = 'SELECT * FROM items WHERE deleted_at IS NULL';
        const params = [];

        if(category){
            sql += ' AND category = ?';
            params.push(category);
        }

        sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';

        params.push(limit, offset);

        const rows = await pool.query(sql, params);

        return rows;
    },

    findById: async (id: number) => {
        const rows = await pool.query('SELECT * FROM items WHERE id = ?', [id]);

        return rows[0] ?? null;
    },

    findBySku: async (sku: string) => {
        const rows = await pool.query('SELECT * FROM items WHERE sku = ?', [sku]);

        return rows[0] ?? null;
    },

    create: async (data: CreateItemDto): Promise <number> => {
        const [result] = await pool.query('INSERT INTO item SET ?', [data]);
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