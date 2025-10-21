import { Pool, PoolClient } from 'pg';
import { logger } from '../utils/logger';

let pool: Pool | null = null;

export const connectDatabase = async (): Promise<Pool> => {
  if (pool) {
    return pool;
  }

  try {
    // Use DATABASE_URL if available (Render/production), otherwise individual vars (local dev)
    const config = process.env.DATABASE_URL 
      ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
      : {
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5432'),
          database: process.env.DB_NAME || 'wastewins',
          user: process.env.DB_USER || 'postgres',
          password: process.env.DB_PASSWORD,
        };

    pool = new Pool({
      ...config,
      max: 10, // Reduced max connections for better stability
      idleTimeoutMillis: 60000, // Increased idle timeout
      connectionTimeoutMillis: 10000, // Increased connection timeout
      statement_timeout: 30000, // Statement timeout
      query_timeout: 30000, // Query timeout
    });

    // Test the connection
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();

    logger.info('PostgreSQL connection pool established');
    return pool;
  } catch (error) {
    logger.error('Failed to connect to PostgreSQL:', error);
    throw error;
  }
};

export const getPool = (): Pool => {
  if (!pool) {
    throw new Error('Database pool not initialized. Call connectDatabase first.');
  }
  return pool;
};

export const query = async (text: string, params?: any[]): Promise<any> => {
  const client = await getPool().connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
};

export const transaction = async <T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> => {
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const closeDatabase = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    pool = null;
    logger.info('Database connection pool closed');
  }
};
