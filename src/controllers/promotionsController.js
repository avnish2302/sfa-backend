import pool from "../config/db.js";

export const savePromotions = async (req, res) => {
  try {
    const {
      checkin_id,
      start_date,
      end_date,
      party,
      category,
      brand,
      sku,
      scheme,
    } = req.body;

    if (!checkin_id)
      return res.status(400).json({ message: "No active check-in found" });

    if (!start_date || !end_date || !party || !brand || !category || !sku || !scheme)
      return res.status(400).json({ message: "Required fields missing" });

    await pool.query(
      `INSERT INTO promotions
      (checkin_id, start_date, end_date, party, category, brand, sku, scheme)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        checkin_id,
        start_date,
        end_date,
        party,
        category,
        brand,
        sku,
        scheme,
      ]
    );

    res.json({ message: "Promotions saved successfully" });

  } catch (error) {
    console.error("PROMOTIONS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};