import { pool } from '../../src/config/db';

export async function clearDb(): Promise<void> {
    await pool.query('DELETE FROM items');
}

export async function closeDb(): Promise<void> {
    await pool.end();
}