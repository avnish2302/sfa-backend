import pool from "../config/db.js";

export const saveOwnInventory = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { checkin_id, items } = req.body;

    if (!checkin_id || !items?.length) {
      return res.status(400).json({ message: "Invalid data" });
    }

    await connection.beginTransaction();

    // lock the checkin row
    await connection.query(
      "SELECT id FROM checkins WHERE id = ? FOR UPDATE",
      [checkin_id]
    );

    const values = items.map((item) => [
      checkin_id,
      item.product_id,
      item.receipt || 0,
      item.casesWarm || 0,
      item.casesCold || 0,
      item.bottlesWarm || 0,
      item.bottlesCold || 0,
    ]);

    await connection.query(
      `INSERT INTO own_inventory
       (checkin_id, product_id, receipt, cases_warm, cases_cold, bottles_warm, bottles_cold)
       VALUES ?`,
      [values]
    );

    await connection.commit();

    res.json({ message: "Inventory saved successfully" });

  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
};





export const getOwnInventoryByCheckin = async (req, res) => {
  try {
    const { checkinId } = req.params;

    const [rows] = await pool.query(
      `SELECT 
        p.name AS product_name,
        oi.receipt,
        oi.cases_warm,
        oi.cases_cold,
        oi.bottles_warm,
        oi.bottles_cold
      FROM own_inventory oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.checkin_id = ?`,
      [checkinId],
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getInventoryBeforePunchOut = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `
      SELECT 
  s.shop_name,
  p.name AS product_name,
  oi.receipt,
  oi.cases_warm,
  oi.cases_cold,
  oi.bottles_warm,
  oi.bottles_cold
FROM own_inventory oi
JOIN products p ON oi.product_id = p.id
JOIN checkins c ON oi.checkin_id = c.id
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
