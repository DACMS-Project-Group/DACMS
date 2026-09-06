import pool from '../config/db.js';

class BaseRepository {
    constructor(tableName, modelClass = null) {
        this.tableName = tableName;
        this.modelClass = modelClass;
        this.pool = pool;
    }

    async query(sql, params = []) {
        const result = await this.pool.query(sql, params);
        return result.rows;
    }

    async getTableMetrics() {
        const sql = `
            SELECT
                s.relname AS table_name,
                COALESCE(s.n_live_tup, 0)::bigint AS row_count
            FROM pg_stat_user_tables s
            ORDER BY s.relname;
        `;
        const rows = await this.query(sql);
        return rows.map((row) => ({
            table_name: row.table_name,
            row_count: Number(row.row_count),
        }));
    }

    async getDatabaseTime() {
        const rows = await this.query('SELECT NOW()');
        return rows[0].now;
    }
}

export default BaseRepository;