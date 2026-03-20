const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

router.get("/profile", protect, (req, res) => {
  res.json({ user: req.user });
});

// Frontend expects these endpoints under `/api/users/*`.
router.get("/dashboard", protect, userController.getDashboard);
router.get("/courses", protect, userController.getCourses);
router.put("/courses/:courseName", protect, userController.markCourseComplete);
router.put("/profile/update", protect, userController.updateProfile);

router.get("/check-user", protect, (req, res) => {
  res.json({ role: req.user.role });
});

router.get("/check-admin", protect, adminOnly, (req, res) => {
  res.json({ message: "Admin verified" });
});

module.exports = router;