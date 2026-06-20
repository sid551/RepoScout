import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { bookmarkAPI } from "../services/api";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [bookmarkedRepos, setBookmarkedRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userData);
    loadBookmarkedRepos();
  }, []);

  const loadBookmarkedRepos = async () => {
    try {
      const response = await bookmarkAPI.getBookmarks();
      setBookmarkedRepos(response.data.slice(0, 3));
    } catch (error) {
      console.error("Failed to load bookmarks:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center" style={{ marginTop: "100px" }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="page-container">
      <div
        className="card"
        style={{
          backgroundColor: "#f8f9fa",
          marginBottom: "30px",
        }}
      >
        <h1 style={{ marginBottom: "20px", color: "#2c3e50" }}>
          Hello {user?.username || "Developer"}! 👋
        </h1>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <p style={{ margin: 0 }}>
            <strong>Skills:</strong>{" "}
            {user?.skills?.join(", ") || "No skills selected"}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Saved Projects:</strong> {bookmarkedRepos.length}
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "15px" }}>🔍</div>
          <h3 style={{ marginBottom: "15px", color: "#2c3e50" }}>
            Find Projects
          </h3>
          <p style={{ color: "#666", marginBottom: "20px", lineHeight: "1.5" }}>
            Discover open-source repositories matching your skills
          </p>
          <Link
            to="/repositories"
            className="btn"
            style={{
              backgroundColor: "#007bff",
              color: "white",
              textDecoration: "none",
              display: "inline-block",
              width: "auto",
            }}
          >
            Browse Repositories
          </Link>
        </div>

        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "15px" }}>🚀</div>
          <h3 style={{ marginBottom: "15px", color: "#2c3e50" }}>
            Good First Issues
          </h3>
          <p style={{ color: "#666", marginBottom: "20px", lineHeight: "1.5" }}>
            Find beginner-friendly issues to start contributing
          </p>
          <Link
            to="/issues"
            className="btn"
            style={{
              backgroundColor: "#28a745",
              color: "white",
              textDecoration: "none",
              display: "inline-block",
              width: "auto",
            }}
          >
            Find Issues
          </Link>
        </div>

        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "15px" }}>⭐</div>
          <h3 style={{ marginBottom: "15px", color: "#2c3e50" }}>
            Saved Projects
          </h3>
          <p style={{ color: "#666", marginBottom: "20px", lineHeight: "1.5" }}>
            Your bookmarked repositories and issues
          </p>
          <Link
            to="/bookmarks"
            className="btn"
            style={{
              backgroundColor: "#ffc107",
              color: "black",
              textDecoration: "none",
              display: "inline-block",
              width: "auto",
            }}
          >
            View All Bookmarks
          </Link>
        </div>
      </div>

      {bookmarkedRepos.length > 0 && (
        <div>
          <h3 style={{ marginBottom: "20px", color: "#2c3e50" }}>
            Recent Bookmarks
          </h3>
          <div className="dashboard-grid">
            {bookmarkedRepos.map((repo, index) => (
              <div key={index} className="card">
                <h4
                  style={{
                    marginBottom: "10px",
                    color: "#007bff",
                    fontSize: "1.1rem",
                  }}
                >
                  {repo.repoName}
                </h4>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#666",
                    lineHeight: "1.4",
                    margin: 0,
                  }}
                >
                  {repo.description?.slice(0, 100)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
