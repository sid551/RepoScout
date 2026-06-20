import express from "express";
import jwt from "jsonwebtoken";
import axios from "axios";
import User from "../models/User.js";

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email or username already exists",
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        skills: user.skills,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        skills: user.skills,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// GitHub OAuth callback
router.post("/github", async (req, res) => {
  try {
    const { code } = req.body;

    // Exchange code for access token
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (tokenResponse.data.error) {
      console.error("GitHub token exchange error:", tokenResponse.data);
      return res.status(400).json({
        message: `GitHub error: ${tokenResponse.data.error_description}`,
      });
    }

    const accessToken = tokenResponse.data.access_token;

    // Get user data from GitHub
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });

    const githubUser = userResponse.data;

    // Check if user already exists
    let user = await User.findOne({
      $or: [
        { githubId: githubUser.id.toString() },
        { email: githubUser.email },
      ],
    });

    if (user) {
      // Update existing user with GitHub data
      user.githubId = githubUser.id.toString();
      user.githubUsername = githubUser.login;
      user.avatarUrl = githubUser.avatar_url;
      if (githubUser.email && !user.email) {
        user.email = githubUser.email;
      }
      await user.save();
    } else {
      // Create new user
      user = new User({
        username: githubUser.login,
        email: githubUser.email || `${githubUser.login}@github.local`,
        githubId: githubUser.id.toString(),
        githubUsername: githubUser.login,
        avatarUrl: githubUser.avatar_url,
      });
      await user.save();
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      token,
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
    console.error("GitHub OAuth error:", error.response?.data || error.message);
    res
      .status(500)
      .json({
        message: "GitHub authentication failed",
        detail: error.response?.data || error.message,
      });
  }
});

export default router;
