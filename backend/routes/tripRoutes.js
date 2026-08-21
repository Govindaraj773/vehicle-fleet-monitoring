const express = require("express");

const {
  createTrip,
  getAllTrips,
  updateTrip,
  tripGetById,
  deleteTrip,
} = require("../controllers/tripController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, createTrip);
router.get("/", authMiddleware, getAllTrips);
router.get("/:id", authMiddleware, tripGetById);
router.put("/:id", authMiddleware, updateTrip);
router.delete("/:id", authMiddleware, deleteTrip);

module.exports = router;
