import pg from 'pg';

const pool = process.env.DATABASE_URL
  ? new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : undefined,
    })
  : new pg.Pool({
      user: process.env.POSTGRES_USER || 'postgres',
      host: process.env.POSTGRES_HOST || 'postgres',
      database: process.env.POSTGRES_DB || 'app_db',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      port: process.env.POSTGRES_PORT || 5432,
    });

export default pool;