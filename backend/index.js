import express from 'express';
import cors from 'cors';
import pool from './db.js';
import SupportingDocument from './models/SupportingDocument.js';

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

app.get('/api/fetch/doc/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const dbRes = await pool.query(
      `SELECT "DocumentID", "StudentID", "DocumentType", "FilePath",
              "UploadTimestamp"
       FROM "SUPPORTING_DOCUMENT"
       WHERE "DocumentID" = $1`,
      [id]
    );

    if (dbRes.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        error: 'Document not found',
      });
    }

    const document = SupportingDocument.fromDb(dbRes.rows[0]);
    const fileBuffer = await document.getFile();

    res.type(document.file_path);
    res.send(fileBuffer);
  } catch (err) {
    res.status(500).json({
      status: 'error',
      error: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});