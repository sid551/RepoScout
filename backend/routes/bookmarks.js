import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import Bookmark from "../models/Bookmark.js";

const router = express.Router();

// Get user's bookmarks
router.get("/", authenticateToken, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(bookmarks);
  } catch (error) {
    console.error("Get bookmarks error:", error);
    res.status(500).json({ message: "Error fetching bookmarks" });
  }
});

// Add bookmark
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { repoId, repoName, description, stars, language, url } = req.body;

    const existingBookmark = await Bookmark.findOne({
      userId: req.user._id,
      repoId,
    });
    if (existingBookmark) {
      return res.status(400).json({ message: "Repository already bookmarked" });
    }

    const bookmark = new Bookmark({
      userId: req.user._id,
      repoId,
      repoName,
      description,
      stars,
      language,
      url,
    });
    await bookmark.save();
    res.status(201).json(bookmark);
  } catch (error) {
    console.error("Add bookmark error:", error);
    res.status(500).json({ message: "Error adding bookmark" });
  }
});

// Remove bookmark
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    res.json({ message: "Bookmark removed successfully" });
  } catch (error) {
    console.error("Remove bookmark error:", error);
    res.status(500).json({ message: "Error removing bookmark" });
  }
});

// Remove bookmark by repository ID
router.delete("/repo/:repoId", authenticateToken, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({
      repoId: req.params.repoId,
      userId: req.user._id,
    });

    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    res.json({ message: "Bookmark removed successfully" });
  } catch (error) {
    console.error("Remove bookmark by repo error:", error);
    res.status(500).json({ message: "Error removing bookmark" });
  }
});

// Check if repository is bookmarked
router.get("/check/:repoId", authenticateToken, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({
      userId: req.user._id,
      repoId: req.params.repoId,
    });

    res.json({ isBookmarked: !!bookmark });
  } catch (error) {
    console.error("Check bookmark error:", error);
    res.status(500).json({ message: "Error checking bookmark status" });
  }
});

export default router;
