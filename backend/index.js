import express from 'express';
import cors from 'cors';
import pool from './src/config/db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', async (req, res) => {
  try {
    const dbRes = await pool.query('SELECT NOW()');
    res.json({
      status: 'ok',
      message: 'Backend and PostgreSQL connected!',
      time: dbRes.rows[0].now,
    });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

app.get('/api/metrics/tables', async (req, res) => {
  try {
    const dbRes = await pool.query(`
      SELECT
        s.relname AS table_name,
        COALESCE(s.n_live_tup, 0)::bigint AS row_count
      FROM pg_stat_user_tables s
      ORDER BY s.relname;
    `);

    const tables = dbRes.rows.map((row) => ({
      table_name: row.table_name,
      row_count: Number(row.row_count),
    }));

    res.json({ tables });
  } catch (err) {
    res.status(500).json({status: 'error', error: err.message})
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});