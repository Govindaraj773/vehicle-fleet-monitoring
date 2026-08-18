const express = require("express");

const {
  createDriver,
  getDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
} = require("../controllers/driverController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createDriver);
router.get("/", authMiddleware, getDrivers);
router.get("/:id", authMiddleware, getDriverById);
router.put("/:id", authMiddleware, updateDriver);
router.delete("/:id", authMiddleware, deleteDriver);

module.exports = router;
