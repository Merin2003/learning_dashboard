const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["user", "admin", "seller"],
    default: "user"
  },
  bio: {
    type: String,
    default: "New User"
  },
  progress: {
    type: Number,
    default: 0
  },
  courses: [
    {
      name: String,
      completed: { type: Boolean, default: false }
    }
  ]
});

module.exports = mongoose.model("User", userSchema);