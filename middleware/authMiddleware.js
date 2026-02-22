const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.json({ message: "No token" });
  }

  const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
  req.user = decoded;
  next();
};

exports.adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.json({ message: "Admin access only" });
  }
  next();
};