const express = require("express");

const router = express.Router();

const {
  getDashboardSummary,
  getVehicleDashboard,
  getAlertsDashboard,
} = require("../controllers/dashboardController");

router.get("/dashboard", getDashboardSummary);
router.get("/vehicles", getVehicleDashboard);
router.get("/alerts", getAlertsDashboard);

module.exports = router;
