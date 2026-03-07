import pool from "../config/db.js";

export const punchIn = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT. req.user was set by auth middleware
    const { own_vehicle, vehicle_type, odometer_reading } = req.body;

    // Check if already punched in
    const [activePunch] = await pool.query(
      "SELECT id FROM punch_ins WHERE user_id = ? AND is_active = TRUE",
      [userId],
    );
    if (activePunch.length > 0) {
      return res.status(400).json({
        message: "Already punched in",
      });
    }
    // Insert new punch
    const [result] = await pool.query(
      `INSERT INTO punch_ins (user_id, own_vehicle, vehicle_type, odometer_reading) VALUES (?, ?, ?, ?)`,
      [userId, own_vehicle, vehicle_type, odometer_reading],
    );
    res.status(201).json({
      message: "Punch in successful",
      punch_in_id: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// punch out
export const punchOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const { end_odometer_reading, shops_visited, shops_pending } = req.body;

    // 1️⃣ Find active punch
    const [activePunch] = await pool.query(
      "SELECT id FROM punch_ins WHERE user_id = ? AND is_active = TRUE",
      [userId],
    );

    if (activePunch.length === 0) {
      return res.status(400).json({
        message: "No active punch found",
      });
    }

    const punchInId = activePunch[0].id;

    // Insert into punch_outs
    await pool.query(
      `INSERT INTO punch_outs 
       (punch_in_id, user_id, end_odometer_reading, shops_visited, shops_pending)
       VALUES (?, ?, ?, ?, ?)`,
      [punchInId, userId, end_odometer_reading, shops_visited, shops_pending],
    );

    // Update punch_ins to inactive
    await pool.query("UPDATE punch_ins SET is_active = FALSE WHERE id = ?", [
      punchInId,
    ]);

    res.status(200).json({
      message: "Punch out successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPunchSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const [activePunch] = await pool.query(
      "SELECT id, own_vehicle FROM punch_ins WHERE user_id = ? AND is_active = TRUE",
      [userId],
    );

    if (activePunch.length === 0) {
      return res.status(400).json({ message: "No active punch" });
    }

    const punchInId = activePunch[0].id;
    const ownVehicle = activePunch[0].own_vehicle;

    const [[shops]] = await pool.query(
      "SELECT COUNT(*) as count FROM checkins WHERE punch_in_id = ?",
      [punchInId],
    );

const [[inventoryEntered]] = await pool.query(
  `SELECT SUM(
    COALESCE(cases_cold,0) +
    COALESCE(cases_warm,0) +
    COALESCE(bottles_cold,0) +
    COALESCE(bottles_warm,0)
  ) AS count
  FROM own_inventory
  WHERE checkin_id IN
    (SELECT id FROM checkins WHERE punch_in_id = ?)`,
  [punchInId]
);


    const [[cash]] = await pool.query(
      `SELECT IFNULL(SUM(amount),0) as total 
       FROM collection
       WHERE checkin_id IN 
       (SELECT id FROM checkins WHERE punch_in_id = ?)`,
      [punchInId],
    );

    res.json({
      ownVehicle,
      shopsVisited: shops.count,
      shopsPending: 0,
      cashCollected: cash.total,
      totalInventory: inventoryEntered.count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
