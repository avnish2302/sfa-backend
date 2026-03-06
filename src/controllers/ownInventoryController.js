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
      [values]
    );

    res.json({ message: "Inventory saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};