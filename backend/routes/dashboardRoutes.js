const express = require("express");

const router = express.Router();

const {
  getDashboardSummary,
  getVehicleDashboard,
  getAlertsDashboard,
  getTripsDashboard,
  getTelemetryHistory,
} = require("../controllers/dashboardController");

router.get("/dashboard", getDashboardSummary);
router.get("/vehicles", getVehicleDashboard);
router.get("/alerts", getAlertsDashboard);
router.get("/trips", getTripsDashboard);
router.get("/telemetry/:vehicleId", getTelemetryHistory);

module.exports = router;
