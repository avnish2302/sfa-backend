import pool from "../config/db.js";

export const getSalesmen = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name FROM users WHERE role = 'salesman'"
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};