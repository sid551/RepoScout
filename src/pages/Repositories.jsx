import { useState, useEffect } from "react";
import { repoAPI, bookmarkAPI } from "../services/api";
import RepoCard from "../components/RepoCard";

function Repositories() {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userData);
    if (userData.skills?.length) {
      searchRepositories(userData.skills);
    }
  }, []);

  const searchRepositories = async (skills = null) => {
    setLoading(true);
    try {
      const userSkills = skills || user?.skills || [];
      const response = await repoAPI.searchRepos(userSkills);
      setRepositories(response.data.items || []);
    } catch (error) {
      console.error("Failed to search repositories:", error);
      alert("Failed to load repositories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async (repo) => {
    try {
      await bookmarkAPI.addBookmark({
        repoId: repo.id,
        repoName: repo.full_name,
        description: repo.description,
        stars: repo.stargazers_count,
        language: repo.language,
        url: repo.html_url,
      });
      alert("Repository bookmarked successfully!");
    } catch (error) {
      console.error("Failed to bookmark:", error);
      alert("Failed to bookmark repository. Please try again.");
    }
  };

  return (
    <div className="page-container">
      <div
        className="flex-responsive mb-4"
        style={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <h2 style={{ margin: 0 }}>Repositories for Your Skills</h2>
        <button
          onClick={() => searchRepositories()}
          disabled={loading}
          className="btn"
          style={{
            backgroundColor: "#007bff",
            color: "white",
            cursor: loading ? "not-allowed" : "pointer",
            width: "auto",
          }}
        >
          {loading ? "Searching..." : "Refresh"}
        </button>
      </div>

      {user?.skills?.length ? (
        <p className="mb-3" style={{ color: "#666" }}>
          Showing repositories for: <strong>{user.skills.join(", ")}</strong>
        </p>
      ) : (
        <p className="mb-3" style={{ color: "#666" }}>
          No skills selected.{" "}
          <a href="/skills" style={{ color: "#007bff" }}>
            Add your skills
          </a>{" "}
          to see personalized recommendations.
        </p>
      )}

      {loading ? (
        <div className="text-center" style={{ marginTop: "50px" }}>
          <p>Loading repositories...</p>
        </div>
      ) : (
        <div className="repos-grid">
          {repositories.map((repo) => (
            <RepoCard
              key={repo.id}
              repo={repo}
              onBookmark={() => handleBookmark(repo)}
            />
          ))}
        </div>
      )}

      {!loading && repositories.length === 0 && (
        <div className="text-center" style={{ marginTop: "50px" }}>
          <p>
            No repositories found. Try updating your skills or refresh the
            search.
          </p>
        </div>
      )}
    </div>
  );
}

export default Repositories;
