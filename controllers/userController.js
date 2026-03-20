const User = require("../models/User");

// Keep in sync with frontend `availableCourses`.
const DEFAULT_COURSES = ["React", "Node", "MongoDB", "Python", "JavaScript"];

function ensureCoursesInitialized(user) {
  const existing = Array.isArray(user.courses) ? user.courses : [];

  // Map by course name to avoid duplicates.
  const map = new Map(existing.map((c) => [c.name, c]));

  for (const name of DEFAULT_COURSES) {
    if (!map.has(name)) map.set(name, { name, completed: false });
  }

  // Only return the default set (frontend renders those).
  return DEFAULT_COURSES.map((name) => {
    const course = map.get(name);
    return { name, completed: Boolean(course?.completed) };
  });
}

exports.getDashboard = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.courses = ensureCoursesInitialized(user);
  await user.save();

  const totalCourses = user.courses.length;
  const completedCourses = user.courses.filter((c) => c.completed).length;
  const overallProgress =
    totalCourses === 0 ? 0 : Math.round((completedCourses / totalCourses) * 100);

  res.json({
    totalCourses,
    completedCourses,
    overallProgress,
  });
};

exports.getCourses = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.courses = ensureCoursesInitialized(user);
  await user.save();

  res.json(user.courses);
};

exports.markCourseComplete = async (req, res) => {
  const { courseName: rawCourseName } = req.params;
  const courseName = String(rawCourseName || "").trim();
  const normalizedCourseName = courseName.toLowerCase();

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.courses = ensureCoursesInitialized(user);

  const course = user.courses.find(
    (c) => String(c.name || "").trim().toLowerCase() === normalizedCourseName
  );
  if (!course) {
    // If someone calls with an unexpected name, don't break the user doc.
    return res.status(400).json({ message: "Unknown course" });
  }

  course.completed = true;
  await user.save();

  res.json(user.courses);
};

exports.updateProfile = async (req, res) => {
  const { name, email, bio } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  // Basic validation.
  if (email && email !== user.email) {
    const existing = await User.findOne({ email });
    if (existing && existing._id.toString() !== user._id.toString()) {
      return res.status(400).json({ message: "Email already in use" });
    }
  }

  if (typeof name === "string") user.name = name;
  if (typeof email === "string") user.email = email;
  if (typeof bio === "string") user.bio = bio;

  await user.save();

  res.json({
    name: user.name,
    email: user.email,
    bio: user.bio,
  });
};

