import pool from "../config/db.js";


// ================================
// Create Routes (Salesman self)
// ================================
export const createRoutes = async (req, res) => {
  try {
    const { planDate, shops } = req.body;
    const userId = req.user.id;

    if (!planDate || !shops?.length) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const values = shops.map((shopId) => [
      planDate,
      userId,
      shopId
    ]);

    await pool.query(
      `INSERT INTO routes (plan_date, user_id, shop_id)
       VALUES ?`,
      [values]
    );

    res.json({ message: "Routes sent for approval" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================================
// Get Routes (Manager approve)
// ================================
export const getRoutes = async (req, res) => {
  try {
    const { date, user } = req.query;

    const [rows] = await pool.query(`
      SELECT 
        routes.id,
        routes.plan_date,
        shops.shop_name,
        routes.km,
        routes.gps
      FROM routes
      JOIN shops ON routes.shop_id = shops.id
      WHERE routes.plan_date = ?
      AND routes.user_id = ?
      AND routes.isApproved = false
    `, [date, user]);

    res.json(rows);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================================
// Approve Routes
// ================================
export const approveRoutes = async (req, res) => {
  try {
    const { planDate, userId } = req.body;

    await pool.query(
      `UPDATE routes
       SET isApproved = true
       WHERE plan_date = ?
       AND user_id = ?`,
      [planDate, userId]
    );

    res.json({ message: "Routes approved" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const createManagerRoutes = async (req, res) => {
  try {
    const { planDate, userId, shops } = req.body;

    const values = shops.map((shopId) => [
      planDate,
      userId,
      shopId,
      true // approved by default
    ]);

    await pool.query(
      `INSERT INTO routes (plan_date, user_id, shop_id, isApproved)
       VALUES ?`,
      [values]
    );

    res.json({ message: "Routes saved" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};