import pool from "../config/db.js";

export const getCheckinSummary = async (req, res) => {
  try {
    const { checkinId } = req.params;

    const [[inventory]] = await pool.query(
      `SELECT SUM(
        COALESCE(cases_cold,0) +
        COALESCE(cases_warm,0) +
        COALESCE(bottles_cold,0) +
        COALESCE(bottles_warm,0)
      ) AS count
      FROM own_inventory
      WHERE checkin_id = ?`,
      [checkinId]
    );

    const [[cash]] = await pool.query(
      `SELECT IFNULL(SUM(amount),0) AS total
       FROM collection
       WHERE checkin_id = ?`,
      [checkinId]
    );

    res.json({
      inventoryEntered: inventory.count,
      cashCollected: cash.total,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const checkoutController = async (req, res) => {
  try {
    const { checkinId } = req.params;

    // calculate cash collected
    const [[cash]] = await pool.query(
      `SELECT IFNULL(SUM(amount),0) AS total
       FROM collection
       WHERE checkin_id = ?`,
      [checkinId]
    );

    const collectedCash = cash.total;

    await pool.query(
      `INSERT INTO checkouts (checkin_id, collected_cash, checkout_time)
       VALUES (?, ?, NOW())`,
      [checkinId, collectedCash]
    );

    res.json({
      message: "Checkout successful",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}