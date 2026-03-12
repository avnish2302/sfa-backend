import pool from "../config/db.js";

export const saveCollection = async (req, res) => {
  try {
    const { checkin_id, invoice, amount, paymentMode, remarks } = req.body;

    // map frontend → DB column names
    const invoice_no = invoice;
    const payment_mode = paymentMode;
    const remark = remarks;

    if (!checkin_id)
      return res.status(400).json({ message: "No active check-in found" });

    if (!invoice_no || !amount || !payment_mode)
      return res.status(400).json({ message: "Required fields missing" });

    await pool.query(
      `INSERT INTO collection
      (checkin_id, invoice_no, amount, payment_mode, remark)
      VALUES (?, ?, ?, ?, ?)`,
      [checkin_id, invoice_no, amount, payment_mode, remark],
    );

    res.json({ message: "Collection saved successfully" });
  } catch (error) {
    console.error("COLLECTION ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCollectionByCheckin = async (req, res) => {
  try {
    const { checkinId } = req.params;

    const [rows] = await pool.query(
      `SELECT 
          invoice_no,
          amount,
          payment_mode,
          remark,
          image,
          created_at
       FROM collection
       WHERE checkin_id = ?`,
      [checkinId],
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTotalCollectionBeforePunchOut = async (req, res) => {
  try {
    const { checkinId } = req.params;

    const [rows] = await pool.query(
      `
      SELECT 
        c.invoice_no, 
        c.remark, 
        c.payment_mode, 
        SUM(c.amount) as total_amount
      FROM collection c
      WHERE c.checkin_id = ?
      GROUP BY c.invoice_no, c.remark, c.payment_mode
    `,
      [checkinId],
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
