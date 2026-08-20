const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const driverRoutes = require("./routes/driverRoutes");
const telemetryRoutes = require("./routes/telemetryRoutes");
// const tripRoutes = require("./routes/tripRoutes");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/telemetry", telemetryRoutes);
// app.use("/api/trips", tripRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the backend server!",
    status: "Success",
  });
});

app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      status: "healthy",
      database: "Connected",
      time: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      database: "Disconnected",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
