const User = require("../models/User");

// @desc    Get user dashboard info
// @route   GET /api/users/dashboard
// @access  Private
exports.getDashboardInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Calculate stats
        const totalCourses = user.courses ? user.courses.length : 0;
        const completedCourses = user.courses ? user.courses.filter(c => c.completed).length : 0;

        // Simplified progress logic: percentage of completed courses
        let overallProgress = user.progress;
        if (totalCourses > 0) {
            overallProgress = Math.round((completedCourses / totalCourses) * 100);
        }

        res.json({
            totalCourses,
            completedCourses,
            overallProgress
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const { name, email, bio } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (bio) user.bio = bio;

        await user.save();

        // Return updated fields to frontend
        res.json({
            name: user.name,
            email: user.email,
            bio: user.bio,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Get user courses
// @route   GET /api/users/courses
// @access  Private
exports.getUserCourses = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user.courses || []);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Mark course as completed
// @route   PUT /api/users/courses/:courseName
// @access  Private
exports.markCourseComplete = async (req, res) => {
    try {
        const { courseName } = req.params;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if course exists in user's list
        if (!user.courses) {
            user.courses = [];
        }

        const courseIndex = user.courses.findIndex(c => c.name === courseName);

        if (courseIndex !== -1) {
            // Mark existing course as complete
            user.courses[courseIndex].completed = true;
        } else {
            // Add and mark as complete if not found (for demonstration)
            user.courses.push({ name: courseName, completed: true });
        }

        await user.save();
        res.json(user.courses);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
