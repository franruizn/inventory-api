import { pool } from '../../src/config/db';

export async function clearDb(): Promise<void> {
    await pool.query('DELETE FROM items');
    await pool.query('DELETE FROM users');
}

export async function closeDb(): Promise<void> {
    await pool.end();
}