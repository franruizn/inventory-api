import mysql, { Pool } from 'mysql2/promise';
import { config } from './config';

export const pool: Pool = mysql.createPool({
  host:            config.DB_HOST,
  port:            config.DB_PORT,
  user:            config.DB_USER,
  password:        config.DB_PASSWORD,
  database:        config.DB_NAME,
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit:      0,
});

export async function waitForDb(retries = 5): Promise<void> {
  for (let i = 0; i < retries; i++) {
    try {
      await pool.query('SELECT 1');
      return;
    } catch {
      if (i === retries - 1) throw new Error('DB unavailable after retries');
      await new Promise(r => setTimeout(r, 2000 * (i + 1)));
    }
  }
}