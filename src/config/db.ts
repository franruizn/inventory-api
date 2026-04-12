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