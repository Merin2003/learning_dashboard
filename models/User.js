const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  bio: {
    type: String,
    default: ""
  },
  role: {
    type: String,
    enum: ["user", "admin", "seller"],
    default: "user"
  },
  courses: [
    {
      name: { type: String, required: true },
      completed: { type: Boolean, default: false }
    }
  ]
});

module.exports = mongoose.model("User", userSchema);