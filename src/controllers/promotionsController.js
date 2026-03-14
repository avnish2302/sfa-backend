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

    if (
      !start_date ||
      !end_date ||
      !party ||
      !brand ||
      !category ||
      !sku ||
      !scheme
    )
      return res.status(400).json({ message: "Required fields missing" });

    await pool.query(
      `INSERT INTO promotions
      (checkin_id, start_date, end_date, party, category, brand, sku, scheme)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [checkin_id, start_date, end_date, party, category, brand, sku, scheme],
    );

    res.json({ message: "Promotions saved successfully" });
  } catch (error) {
    console.error("PROMOTIONS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPromotionsByCheckin = async (req, res) => {
  try {
    const { checkinId } = req.params;

    const [rows] = await pool.query(
      `SELECT start_date,end_date,party,category,brand,sku,scheme
       FROM promotions
       WHERE checkin_id = ?`,
      [checkinId],
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPromotionBeforePunchOut = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `
      SELECT
  s.shop_name,
  p.party,
  p.category,
  p.brand,
  p.sku,
  p.start_date,
  p.end_date,
  p.scheme
FROM promotions p
JOIN checkins c ON p.checkin_id = c.id
JOIN shops s ON c.shop_id = s.id
JOIN punch_ins pi ON c.punch_in_id = pi.id
WHERE pi.user_id = ?
AND pi.is_active = TRUE
ORDER BY s.shop_name;
    `,
      [userId],
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
