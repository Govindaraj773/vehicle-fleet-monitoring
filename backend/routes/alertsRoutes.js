const express = require("express");

const {
  createAlert,
  getAllAlerts,
  getAlertById,
  updateAlert,
  deleteAlert,
} = require("../controllers/alertsController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createAlert);
router.get("/", authMiddleware, getAllAlerts);
router.get("/:id", authMiddleware, getAlertById);
router.put("/:id", authMiddleware, updateAlert);
router.delete("/:id", authMiddleware, deleteAlert);

module.exports = router;
