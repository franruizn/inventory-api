import mysql, { Pool } from 'mysql2/promise';

export const pool: Pool = mysql.createPool({
  host:               process.env.DB_HOST     ?? 'localhost',
  port:               Number(process.env.DB_PORT ?? 3306),
  user:               process.env.DB_USER     ?? 'root',
  password:           process.env.DB_PASSWORD ?? 'secret',
  database:           process.env.DB_NAME     ?? 'inventory',
  connectionLimit:    10,
  waitForConnections: true,
  queueLimit:         0,
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