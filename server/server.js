require("dotenv").config({ quiet: true });
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const allowed = (process.env.CLIENT_ORIGIN || "").split(",").map((s) => s.trim());

app.use(cors({ origin: allowed }));
app.use(express.json());

// Make sure the DB is connected before any route runs
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.log("DB error:", err.message);
    res.status(500).json({ message: "Database connection failed" });
  }
});

const itemsRoutes = require("./routes/items");
const productRoutes = require("./routes/products");

app.use("/api/products", productRoutes);
app.use("/api/items", itemsRoutes);

// Local development only. Vercel does not need listen.
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;