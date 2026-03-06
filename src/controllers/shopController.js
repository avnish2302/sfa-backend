import pool from "../config/db.js";

export const getShops = async (req, res) => {
  try {
    const [shops] = await pool.query(
      "SELECT id, shop_name, latitude, longitude FROM shops"
    );

    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};