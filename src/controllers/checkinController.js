import pool from "../config/db.js";

export const createCheckin = async (req, res) => {
  try {
    const userId = req.user.id
    const { shop_id, latitude, longitude } = req.body;
    const [activePunch] = await pool.query("SELECT id FROM punch_ins WHERE user_id = ? AND is_active = TRUE",[userId])
    if (activePunch.length === 0) return res.status(400).json({ message: "No active punch found" })
    const punchInId = activePunch[0].id
    // Insert checkin
    const [result] = await pool.query(`INSERT INTO checkins (user_id, shop_id, punch_in_id, latitude, longitude) VALUES (?, ?, ?, ?, ?)`,[userId, shop_id, punchInId, latitude || null, longitude || null])
    res.status(201).json({
      message: "Checkin created",
      checkin_id: result.insertId,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// to get checkin data in checkout page (fetched from db)
export const getActiveCheckin = async (req, res) => {
  try {
    const userId = req.user.id

    // get current active punch
    const [[punch]] = await pool.query(
      `SELECT id FROM punch_ins
       WHERE user_id = ? AND is_active = TRUE
       LIMIT 1`,
      [userId]
    )

    if (!punch) return res.json(null)

    const [[checkin]] = await pool.query(
      `SELECT id, shop_id
       FROM checkins
       WHERE punch_in_id = ?
       AND id NOT IN (SELECT checkin_id FROM checkouts)
       ORDER BY id DESC
       LIMIT 1`,
      [punch.id]
    )

    res.json(checkin || null)

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};