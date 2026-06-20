import { useState, useEffect } from "react";
import { issueAPI } from "../services/api";
import IssueCard from "../components/IssueCard";

function Issues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userData);
    if (userData.skills?.length) {
      searchIssues(userData.skills);
    }
  }, []);

  const searchIssues = async (skills = null) => {
    setLoading(true);
    try {
      const userSkills = skills || user?.skills || [];
      const response = await issueAPI.searchIssues(userSkills);
      setIssues(response.data.items || []);
    } catch (error) {
      console.error("Failed to search issues:", error);
      alert("Failed to load issues. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div
        className="flex-responsive mb-4"
        style={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <h2 style={{ margin: 0 }}>Good First Issues</h2>
        <button
          onClick={() => searchIssues()}
          disabled={loading}
          className="btn"
          style={{
            backgroundColor: "#28a745",
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
          Showing beginner-friendly issues for:{" "}
          <strong>{user.skills.join(", ")}</strong>
        </p>
      ) : (
        <p className="mb-3" style={{ color: "#666" }}>
          No skills selected.{" "}
          <a href="/skills" style={{ color: "#007bff" }}>
            Add your skills
          </a>{" "}
          to see personalized issues.
        </p>
      )}

      {loading ? (
        <div className="text-center" style={{ marginTop: "50px" }}>
          <p>Loading issues...</p>
        </div>
      ) : (
        <div className="issues-list">
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}

      {!loading && issues.length === 0 && (
        <div className="text-center" style={{ marginTop: "50px" }}>
          <p>
            No good first issues found. Try updating your skills or refresh the
            search.
          </p>
        </div>
      )}
    </div>
  );
}

export default Issues;
