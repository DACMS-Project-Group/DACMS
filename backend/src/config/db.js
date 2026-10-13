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

// Ensure every PostgreSQL session uses South African Standard Time (UTC+2).
pool.on('connect', (client) => {
  client.query("SET TIME ZONE 'Africa/Johannesburg'");
});

export default pool;