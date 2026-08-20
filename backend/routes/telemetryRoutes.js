const express = require("express");

const {
  createTelemetry,
  getTelemetry,
  getTelemetryById,
  updateTelemetry,
  deleteTelemetry,
} = require("../controllers/telemetryController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createTelemetry);
router.get("/", authMiddleware, getTelemetry);
router.get("/:id", authMiddleware, getTelemetryById);
router.put("/:id", authMiddleware, updateTelemetry);
router.delete("/:id", authMiddleware, deleteTelemetry);

module.exports = router;
