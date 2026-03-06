import pool from "../config/db.js";

export const saveCompetitorInventory = async (req, res) => {
  try {
    const { checkin_id, items } = req.body;

    const values = items.map((item) => [
      checkin_id,
      item.category,
      item.product,
      item.sku,
      item.caseQty,
      item.bottleQty,
    ]);

    await pool.query(
      `INSERT INTO competitor_inventory
      (checkin_id, category, product_name, sku, case_qty, bottle_qty)
      VALUES ?`,
      [values]
    );

    res.json({ message: "Competitor inventory saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};