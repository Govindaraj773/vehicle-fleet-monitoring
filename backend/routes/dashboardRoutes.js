const express = require("express");

const router = express.Router();

const { getDashboardSummary } = require("../controllers/dashboardController");

router.get("/dashboard", getDashboardSummary);

module.exports = router;
