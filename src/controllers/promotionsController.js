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

export const getPromotionsByCheckin = async (req, res) => {
  try {
    const { checkinId } = req.params;

    const [rows] = await pool.query(
      `SELECT start_date,end_date,party,category,brand,sku,scheme
       FROM promotions
       WHERE checkin_id = ?`,
      [checkinId]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getTotalPromotionBeforePunchOut = async (req, res) => {
  try {
    const { checkinId } = req.params;

    const [rows] = await pool.query(`
      SELECT 
        p.party, 
        p.category, 
        p.brand, 
        p.sku, 
        p.start_date, 
        p.end_date, 
        p.scheme
      FROM promotions p
      WHERE p.checkin_id = ?
    `, [checkinId]);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};