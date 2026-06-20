import express from "express";
import axios from "axios";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Search good first issues based on user skills
router.get("/search", authenticateToken, async (req, res) => {
  try {
    const { skills } = req.query;
    const userSkills = skills ? skills.split(",") : req.user.skills;

    if (!userSkills || userSkills.length === 0) {
      return res.status(400).json({ message: "No skills provided" });
    }

    // Create search query for good first issues
    const skillsQuery = userSkills.join(" OR ");
    const searchQuery = `label:"good first issue" ${skillsQuery} state:open`;

    const response = await axios.get("https://api.github.com/search/issues", {
      params: {
        q: searchQuery,
        sort: "created",
        order: "desc",
        per_page: 30,
      },
      headers: {
        Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    // Format issues
    const issues = response.data.items.map((issue) => ({
      id: issue.id,
      title: issue.title,
      body: issue.body,
      html_url: issue.html_url,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
      labels: issue.labels,
      repository_url: issue.repository_url,
      repository: {
        name: issue.repository_url.split("/").slice(-1)[0],
        full_name: issue.repository_url.split("/").slice(-2).join("/"),
      },
    }));

    res.json({
      items: issues,
      total_count: response.data.total_count,
    });
  } catch (error) {
    console.error("Issues search error:", error);

    if (error.response?.status === 403) {
      return res.status(403).json({
        message: "GitHub API rate limit exceeded. Please try again later.",
      });
    }

    res.status(500).json({ message: "Error searching issues" });
  }
});

// Get good first issues from specific repository
router.get("/repo/:owner/:repo", authenticateToken, async (req, res) => {
  try {
    const { owner, repo } = req.params;

    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/issues`,
      {
        params: {
          labels: "good first issue",
          state: "open",
          per_page: 20,
        },
        headers: {
          Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    const issues = response.data.map((issue) => ({
      id: issue.id,
      title: issue.title,
      body: issue.body,
      html_url: issue.html_url,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
      labels: issue.labels,
      repository: {
        name: repo,
        full_name: `${owner}/${repo}`,
      },
    }));

    res.json(issues);
  } catch (error) {
    console.error("Repository issues error:", error);
    res.status(500).json({ message: "Error fetching repository issues" });
  }
});

// Get beginner-friendly labels
router.get("/beginner-labels", authenticateToken, async (req, res) => {
  try {
    const beginnerLabels = [
      "good first issue",
      "beginner-friendly",
      "easy",
      "starter",
      "newcomer",
      "first-timers-only",
      "help wanted",
    ];

    res.json({ labels: beginnerLabels });
  } catch (error) {
    console.error("Beginner labels error:", error);
    res.status(500).json({ message: "Error fetching beginner labels" });
  }
});

export default router;
