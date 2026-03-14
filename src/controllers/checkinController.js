import pool from "../config/db.js";

export const createCheckin = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const userId = req.user.id;
    const { shop_id, latitude, longitude } = req.body;

    await connection.beginTransaction();

    // 1️⃣ Get active punch
    const [activePunch] = await connection.query(
      `SELECT id 
       FROM punch_ins 
       WHERE user_id = ? AND is_active = TRUE
       LIMIT 1
       FOR UPDATE`,
      [userId],
    );

    if (activePunch.length === 0) {
      await connection.rollback();
      return res.status(400).json({ message: "No active punch found" });
    }

    const punchInId = activePunch[0].id;

    // 2️⃣ Check if checkin already active
    const [activeCheckin] = await connection.query(
      `SELECT c.id
       FROM checkins c
       LEFT JOIN checkouts co ON co.checkin_id = c.id
       WHERE c.punch_in_id = ?
       AND co.id IS NULL
       LIMIT 1`,
      [punchInId],
    );

    if (activeCheckin.length > 0) {
      await connection.rollback();
      return res.status(400).json({
        message: "Already checked in. Please checkout first.",
      });
    }

    // 3️⃣ Insert checkin
    const [result] = await connection.query(
      `INSERT INTO checkins 
       (user_id, shop_id, punch_in_id, latitude, longitude)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, shop_id, punchInId, latitude || null, longitude || null],
    );

    await connection.commit();

    res.status(201).json({
      message: "Checkin created",
      checkin_id: result.insertId,
    });
  } catch (error) {
    await connection.rollback();

    // ✅ handle duplicate checkin
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "You are already checked in to this shop.",
      });
    }

    console.error(error);
    res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
};

// to get checkin data in checkout page (fetched from db)
export const getActiveCheckin = async (req, res) => {
  try {
    const userId = req.user.id;

    // get current active punch
    const [[punch]] = await pool.query(
      `SELECT id 
       FROM punch_ins
       WHERE user_id = ? AND is_active = TRUE
       LIMIT 1`,
      [userId],
    );

    if (!punch) return res.json(null);

    const [[checkin]] = await pool.query(
      `SELECT c.id, c.shop_id
       FROM checkins c
       LEFT JOIN checkouts co ON co.checkin_id = c.id
       WHERE c.punch_in_id = ?
       AND co.id IS NULL
       ORDER BY c.id DESC
       LIMIT 1`,
      [punch.id],
    );

    res.json(checkin || null);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
