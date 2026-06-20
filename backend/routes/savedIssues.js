import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import SavedIssue from "../models/SavedIssue.js";

const router = express.Router();

// Get all saved issues
router.get("/", authenticateToken, async (req, res) => {
  try {
    const issues = await SavedIssue.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: "Error fetching saved issues" });
  }
});

// Save an issue
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { issueId, issueTitle, issueRepo, url } = req.body;

    const existing = await SavedIssue.findOne({
      userId: req.user._id,
      issueId,
    });
    if (existing) {
      return res.status(400).json({ message: "Issue already saved" });
    }

    const saved = new SavedIssue({
      userId: req.user._id,
      issueId,
      issueTitle,
      issueRepo,
      url,
    });
    await saved.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Error saving issue" });
  }
});

// Remove a saved issue
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const saved = await SavedIssue.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!saved)
      return res.status(404).json({ message: "Saved issue not found" });
    res.json({ message: "Issue removed" });
  } catch (error) {
    res.status(500).json({ message: "Error removing saved issue" });
  }
});

// Check if issue is saved
router.get("/check/:issueId", authenticateToken, async (req, res) => {
  try {
    const saved = await SavedIssue.findOne({
      userId: req.user._id,
      issueId: req.params.issueId,
    });
    res.json({ isSaved: !!saved, savedId: saved?._id });
  } catch (error) {
    res.status(500).json({ message: "Error checking saved status" });
  }
});

export default router;
