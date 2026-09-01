const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

//Register and login routes
router.post("/register", registerUser);
router.post("/login", loginUser);

//Protected test route
router.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You have access to this protected route",
    user: req.user,
  });
});

module.exports = router;
