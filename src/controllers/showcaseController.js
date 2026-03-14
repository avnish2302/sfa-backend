import pool from "../config/db.js";

export const saveShowcase = async (req, res) => {
  try {
    const { checkin_id, items } = req.body;

    if (!checkin_id) {
      return res.status(400).json({ message: "No active check-in found" });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items to save" });
    }

    const invalidItem = items.find(
      (item) => !item.category?.trim() || !item.product?.trim()
    );

    if (invalidItem) {
      return res
        .status(400)
        .json({ message: "Category and Product cannot be empty" });
    }

    const values = items.map((item) => [
      checkin_id,
      item.category,
      item.product,
    ]);

    await pool.query(
      `INSERT INTO showcase (checkin_id, category, product) VALUES ?`,
      [values]
    );

    res.json({ message: "Showcase saved successfully" });

  } catch (error) {

  if (error.code === "ER_DUP_ENTRY") {
    return res.status(400).json({
      message: "This showcase entry already exists for this check-in",
    });
  }

  console.error(error);
  res.status(500).json({ message: "Server error" });
}
};