import express from "express";
import axios from "axios";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Search repositories based on user skills
router.get("/search", authenticateToken, async (req, res) => {
  try {
    const { skills } = req.query;
    const userSkills = skills ? skills.split(",") : req.user.skills;

    if (!userSkills || userSkills.length === 0) {
      return res.status(400).json({ message: "No skills provided" });
    }

    // Sanitize skills for GitHub search query (remove special chars)
    const sanitizedSkills = userSkills
      .map((s) =>
        s
          .replace(/\./g, "")
          .replace(/[^a-zA-Z0-9\s-]/g, "")
          .trim()
      )
      .filter(Boolean);

    // Create search query
    const skillsQuery = sanitizedSkills.join(" OR ");
    const searchQuery = `${skillsQuery} in:name,description,topics`;

    // GitHub API search
    const response = await axios.get(
      "https://api.github.com/search/repositories",
      {
        params: {
          q: searchQuery,
          sort: "stars",
          order: "desc",
          per_page: 30,
        },
        headers: {
          Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    // Filter and format results
    const repositories = response.data.items.map((repo) => ({
      id: repo.id,
      full_name: repo.full_name,
      description: repo.description,
      stargazers_count: repo.stargazers_count,
      language: repo.language,
      html_url: repo.html_url,
      topics: repo.topics,
      created_at: repo.created_at,
      updated_at: repo.updated_at,
    }));

    res.json({
      items: repositories,
      total_count: response.data.total_count,
    });
  } catch (error) {
    console.error("Repository search error:", error);

    if (error.response?.status === 403) {
      return res.status(403).json({
        message: "GitHub API rate limit exceeded. Please try again later.",
      });
    }

    res.status(500).json({ message: "Error searching repositories" });
  }
});

// Get trending repositories
router.get("/trending", authenticateToken, async (req, res) => {
  try {
    const { language } = req.query;

    // Get date for last week
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const dateStr = lastWeek.toISOString().split("T")[0];

    let searchQuery = `created:>${dateStr}`;
    if (language) {
      searchQuery += ` language:${language}`;
    }

    const response = await axios.get(
      "https://api.github.com/search/repositories",
      {
        params: {
          q: searchQuery,
          sort: "stars",
          order: "desc",
          per_page: 20,
        },
        headers: {
          Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    const repositories = response.data.items.map((repo) => ({
      id: repo.id,
      full_name: repo.full_name,
      description: repo.description,
      stargazers_count: repo.stargazers_count,
      language: repo.language,
      html_url: repo.html_url,
      topics: repo.topics,
    }));

    res.json({
      items: repositories,
      total_count: response.data.total_count,
    });
  } catch (error) {
    console.error("Trending repositories error:", error);
    res.status(500).json({ message: "Error fetching trending repositories" });
  }
});

export default router;
