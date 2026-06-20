import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// Update user skills
router.put("/skills", authenticateToken, async (req, res) => {
  try {
    const { skills } = req.body;

    if (!Array.isArray(skills)) {
      return res.status(400).json({ message: "Skills must be an array" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { skills },
      { new: true }
    ).select("-password");

    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        skills: user.skills,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error("Update skills error:", error);
    res.status(500).json({ message: "Server error updating skills" });
  }
});

// Get user profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        skills: user.skills,
        avatarUrl: user.avatarUrl,
        githubUsername: user.githubUsername,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error fetching profile" });
  }
});

export default router;
