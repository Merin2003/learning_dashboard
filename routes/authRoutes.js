const express = require("express");
const router = express.Router();
const { signup, login, profile } = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", protect, profile);
router.get("/check-admin", protect, adminOnly, (req, res) => {
  res.json({ message: "Admin verified" });
});

module.exports = router;