require("dotenv").config();

// Import dependencies
const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

// Import routes
const authRoutes = require("./routes/authRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const driverRoutes = require("./routes/driverRoutes");
const telemetryRoutes = require("./routes/telemetryRoutes");
const tripRoutes = require("./routes/tripRoutes");
const alertsRoutes = require("./routes/alertsRoutes");

const { startAllJobs } = require("./jobs/jobRunner");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/telemetry", telemetryRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/alerts", alertsRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the backend server!",
    status: "Success",
  });
});

// Databace health check route
app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      status: "healthy",
      database: "Connected",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error("Health check error:", error);

    res.status(500).json({
      status: "unhealthy",
      database: "Disconnected",
      error: error.message,
    });
  }
});

// 404 handler for undefined routes
app.use((req, res) => {
  return res.status(404).json({
    message: "Route not found",
  });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  startAllJobs();
});
