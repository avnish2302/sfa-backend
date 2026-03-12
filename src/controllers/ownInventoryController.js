import pool from "../config/db.js";

export const saveOwnInventory = async (req, res) => {
  try {
    const { checkin_id, items } = req.body;

    if (!checkin_id || !items?.length) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const values = items.map((item) => [
      checkin_id,
      item.product_id,
      item.receipt || 0,
      item.casesWarm || 0,
      item.casesCold || 0,
      item.bottlesWarm || 0,
      item.bottlesCold || 0,
    ]);

    await pool.query(
      `INSERT INTO own_inventory
       (checkin_id, product_id, receipt, cases_warm, cases_cold, bottles_warm, bottles_cold)
       VALUES ?`,
      [values],
    );

    res.json({ message: "Inventory saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
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
      [checkinId]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getTotalInventoryBeforePunchOut = async (req, res) => {
  try {
    const { checkinId } = req.params;

    const [rows] = await pool.query(`
      SELECT 
        p.product_name,
        SUM(oi.receipt) as receipt,
        SUM(oi.cases_warm) as cases_warm,
        SUM(oi.cases_cold) as cases_cold,
        SUM(oi.bottles_warm) as bottles_warm,
        SUM(oi.bottles_cold) as bottles_cold
      FROM own_inventory oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.checkin_id = ?
      GROUP BY p.product_name
    `, [checkinId]);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
