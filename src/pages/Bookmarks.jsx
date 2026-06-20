import { useState, useEffect } from "react";
import { bookmarkAPI, savedIssueAPI } from "../services/api";
import RepoCard from "../components/RepoCard";

function Bookmarks() {
  const [repoBookmarks, setRepoBookmarks] = useState([]);
  const [issueBookmarks, setIssueBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    setLoading(true);
    try {
      const [repoRes, issueRes] = await Promise.all([
        bookmarkAPI.getBookmarks(),
        savedIssueAPI.getSavedIssues(),
      ]);
      setRepoBookmarks(repoRes.data);
      setIssueBookmarks(issueRes.data);
    } catch (error) {
      console.error("Failed to load bookmarks:", error);
      alert("Failed to load bookmarks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (bookmarkId) => {
    try {
      await bookmarkAPI.removeBookmark(bookmarkId);
      setRepoBookmarks(repoBookmarks.filter((b) => b._id !== bookmarkId));
    } catch (error) {
      console.error("Failed to remove bookmark:", error);
      alert("Failed to remove bookmark. Please try again.");
    }
  };

  const handleRemoveSavedIssue = async (savedId) => {
    try {
      await savedIssueAPI.removeSavedIssue(savedId);
      setIssueBookmarks(issueBookmarks.filter((b) => b._id !== savedId));
    } catch (error) {
      console.error("Failed to remove saved issue:", error);
      alert("Failed to remove saved issue. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="text-center" style={{ marginTop: "50px" }}>
        <p>Loading bookmarks...</p>
      </div>
    );
  }

  const isEmpty = repoBookmarks.length === 0 && issueBookmarks.length === 0;

  return (
    <div className="page-container">
      <h2 className="mb-4">Your Bookmarks</h2>

      {isEmpty ? (
        <div className="text-center" style={{ marginTop: "50px" }}>
          <p>
            No bookmarks yet. Explore repositories and issues to save them here.
          </p>
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              marginTop: "16px",
              flexWrap: "wrap",
            }}
          >
            <a
              href="/repositories"
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
            </a>
            <a
              href="/issues"
              className="btn"
              style={{
                backgroundColor: "#28a745",
                color: "white",
                textDecoration: "none",
                display: "inline-block",
                width: "auto",
              }}
            >
              Browse Issues
            </a>
          </div>
        </div>
      ) : (
        <>
          {repoBookmarks.length > 0 && (
            <div className="mb-4">
              <h3 style={{ marginBottom: "16px", color: "#2c3e50" }}>
                📁 Repositories
              </h3>
              <div className="repos-grid">
                {repoBookmarks.map((bookmark) => (
                  <div key={bookmark._id}>
                    <RepoCard
                      repo={{
                        id: bookmark.repoId,
                        full_name: bookmark.repoName,
                        description: bookmark.description,
                        stargazers_count: bookmark.stars,
                        language: bookmark.language,
                        html_url: bookmark.url,
                      }}
                      isBookmarked={true}
                      onRemoveBookmark={() =>
                        handleRemoveBookmark(bookmark._id)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {issueBookmarks.length > 0 && (
            <div>
              <h3 style={{ marginBottom: "16px", color: "#2c3e50" }}>
                🚀 Issues
              </h3>
              <div className="issues-list">
                {issueBookmarks.map((bookmark) => (
                  <div
                    key={bookmark._id}
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "16px",
                      backgroundColor: "white",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "12px",
                      }}
                    >
                      <div>
                        <h4 style={{ margin: "0 0 8px 0" }}>
                          <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#007bff", textDecoration: "none" }}
                          >
                            {bookmark.issueTitle}
                          </a>
                        </h4>
                        <p
                          style={{ margin: 0, fontSize: "14px", color: "#666" }}
                        >
                          📁 {bookmark.issueRepo}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveSavedIssue(bookmark._id)}
                        style={{
                          background: "transparent",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          padding: "6px 10px",
                          cursor: "pointer",
                          fontSize: "12px",
                          color: "#666",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Bookmarks;
