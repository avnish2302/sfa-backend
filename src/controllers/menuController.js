import pool from "../config/db.js";

export const saveMenu = async (req, res) => {
  try {
    const { checkin_id, items } = req.body;
    if (!checkin_id) return res.status(400).json({ message: "No active check-in found" });
    if (!items || items.length === 0) return res.status(400).json({ message: "No items to save" });
    
    const invalidItem = items.find((item) => !item.category?.trim() || !item.product?.trim(),)

    if (invalidItem) {
        return res
        .status(400)
        .json({message : "cannot be empty"})
    }

    const values = items.map((item) => [checkin_id, item.category, item.product, item.price])
    await pool.query(`INSERT INTO menu (checkin_id, category, product, price) VALUES ?`, [values])
    res.json({message : "Menu saved successfully"})
  } catch (error) {
    console.log(error)
    res.status(500).json({message : "Server error"})
  }
}
