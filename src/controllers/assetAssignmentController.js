import pool from "../config/db.js"

export const saveAssetAssignment = async (req, res) => {
  try {
    const { checkin_id, items } = req.body;
    if (!checkin_id)
      return res.status(400).json({ message: "No active check-in found" });
    if (!items || items.length === 0)
      return res.status(400).json({ message: "No items to save" });

    const invalidItem = items.find(
      (item) =>
        !item.brand?.trim() || !item.asset?.trim() || !item.remarks?.trim(),
    );

    if (invalidItem) {
      return res.status(400).json({ message: "cannot be empty" });
    }

    const values = items.map((item) => [
      checkin_id,
      item.brand,
      item.asset,
      item.remarks,
    ]);

    await pool.query(
      `INSERT INTO asset_assignment(checkin_id, brand, asset_name, remarks) VALUES ?`,
      [values],
    );
    res.json({ message: "Asset assignment saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
