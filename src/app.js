import "./config/env.js";

import express from "express";
import cors from "cors"; // CORS middleware allows frontend like React to talk to backend

import authRoutes from "./routes/authRoutes.js";
import punchRoutes from "./routes/punchRoutes.js";
import protect from "./middleware/authMiddleware.js";
import shopRoutes from "./routes/shopRoutes.js";
import checkinRoutes from "./routes/checkinRoutes.js";
import ownInventoryRoutes from "./routes/ownInventoryRoutes.js";
import competitorInventoryRoutes from "./routes/competitorInventoryRoutes.js";
import productsRoutes from "./routes/productsRoutes.js";
import showcaseRoutes from "./routes/showcaseRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import assetAssignmentRoutes from "./routes/assetAssignmentRoutes.js";
import promotionsRoutes from "./routes/promotionsRoutes.js";
import collectionRoutes from "./routes/collectionRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";

const app = express(); // create express instance

app.use(cors()); // enables cross origin request, w/o this frontend cannot call backend
app.use(express.json()); // allow server to read  JSON from request body

app.get("/", (req, res) => {
  res.json({ message: "SFA Backend Running" });
}); // basic test route, when visiting, localhose 5000, it returns, {"message" : "SFA Backend Running"}

app.get("/protected", protect, (req, res) => {
  res.json({
    message: "You accessed protected route",
    user: req.user,
  });
});

app.use("/api/auth", authRoutes); // all auth routes inside authRoutes will start with /api/auth
app.use("/api/punch", protect, punchRoutes);
app.use("/api/shops", protect, shopRoutes);
app.use("/api/checkin", protect, checkinRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/inventory", ownInventoryRoutes);
app.use("/api/inventory", competitorInventoryRoutes);
app.use("/api/showcase", showcaseRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/asset-assignment", assetAssignmentRoutes);
app.use("/api/promotions", promotionsRoutes);
app.use("/api/collection", collectionRoutes);
app.use("/api/checkout", protect, checkoutRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
