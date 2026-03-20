const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const { protect } = require("./middleware/authMiddleware");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

// Test Route
app.get("/", (req, res) => {
  res.send("API is running");
});

// Auth Routes
app.use("/api/auth", authRoutes);

// User Routes (frontend expects `/api/users/*`).
app.use("/api/users", userRoutes);

// Protected Dashboard Route
app.get("/api/dashboard", protect, (req, res) => {
  res.json({ message: "Welcome to Dashboard", user: req.user });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});