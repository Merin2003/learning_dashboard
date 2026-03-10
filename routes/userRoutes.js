const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  getDashboardInfo,
  updateProfile,
  getUserCourses,
  markCourseComplete
} = require("../controllers/userController");

router.get("/profile", protect, (req, res) => {
  res.json({ user: req.user });
});

router.get("/check-user", protect, (req, res) => {
  res.json({ role: req.user.role });
});

router.get("/check-admin", protect, adminOnly, (req, res) => {
  res.json({ message: "Admin verified" });
});

router.get("/dashboard", protect, getDashboardInfo);
router.put("/profile/update", protect, updateProfile); // Different from GET /profile
router.get("/courses", protect, getUserCourses);
router.put("/courses/:courseName", protect, markCourseComplete);

module.exports = router;