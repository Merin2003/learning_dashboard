const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/profile", protect, (req, res) => {
  res.json({ user: req.user });
});

router.get("/check-user", protect, (req, res) => {
  res.json({ role: req.user.role });
});

router.get("/check-admin", protect, adminOnly, (req, res) => {
  res.json({ message: "Admin verified" });
});

module.exports = router;