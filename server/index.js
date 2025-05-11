const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const { sequelize } = require("./models");
const authRoutes = require("./routes/authRoutes");
const alertRoutes = require("./routes/alertRoutes");

dotenv.config();
const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/alerts", alertRoutes); // protected

// Routes placeholder
app.get("/", (req, res) => res.send("SecTrack API is running"));

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log("Database connected!");
  } catch (err) {
    console.error("Unable to connect to DB:", err);
  }
});
