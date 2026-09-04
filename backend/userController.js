import pool from './db.js';

export async function getUserById(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT u."UserID", u."FName", u."LName", u."Email", r."RoleName", u."CreatedAt"
       FROM "APP_USER" u
       JOIN "SYSTEM_ROLE" r ON u."RoleID" = r."RoleID"
       WHERE u."UserID" = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching user' });
  }
}