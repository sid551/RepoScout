import { useState, useEffect } from "react";
import { bookmarkAPI } from "../services/api";

function IssueCard({ issue }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await bookmarkAPI.checkIssueBookmarked(issue.id);
        setIsBookmarked(res.data.isBookmarked);
        setBookmarkId(res.data.bookmarkId);
      } catch {
        // ignore
      }
    };
    check();
  }, [issue.id]);

  const handleBookmark = async () => {
    setLoading(true);
    try {
      if (isBookmarked) {
        await bookmarkAPI.removeBookmark(bookmarkId);
        setIsBookmarked(false);
        setBookmarkId(null);
      } else {
        const res = await bookmarkAPI.addIssueBookmark({
          issueId: String(issue.id),
          issueTitle: issue.title,
          issueRepo: issue.repository_url?.split("/").slice(-2).join("/"),
          url: issue.html_url,
        });
        setIsBookmarked(true);
        setBookmarkId(res.data._id);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update bookmark");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "20px",
        backgroundColor: "white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: "0 0 10px 0", fontSize: "18px" }}>
            <a
              href={issue.html_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "#007bff" }}
            >
              {issue.title}
            </a>
          </h3>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              marginBottom: "10px",
              fontSize: "14px",
              color: "#666",
            }}
          >
            <span>
              📁{" "}
              <strong>
                {issue.repository_url?.split("/").slice(-2).join("/") ||
                  "Unknown repo"}
              </strong>
            </span>
            <span>📅 Created {formatDate(issue.created_at)}</span>
          </div>

          {issue.body && (
            <p
              style={{
                color: "#666",
                margin: "10px 0",
                fontSize: "14px",
                lineHeight: "1.4",
              }}
            >
              {issue.body.slice(0, 200)}...
            </p>
          )}

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "15px",
              flexWrap: "wrap",
            }}
          >
            {issue.labels?.map((label) => (
              <span
                key={label.id}
                style={{
                  fontSize: "12px",
                  backgroundColor: `#${label.color}`,
                  color: "white",
                  padding: "2px 8px",
                  borderRadius: "12px",
                }}
              >
                {label.name}
              </span>
            ))}
          </div>
        </div>

        <div
          style={{
            marginLeft: "15px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            alignItems: "flex-end",
          }}
        >
          <a
            href={issue.html_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              backgroundColor: "#28a745",
              color: "white",
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: "4px",
              fontSize: "12px",
              whiteSpace: "nowrap",
            }}
          >
            View Issue
          </a>
          <button
            onClick={handleBookmark}
            disabled={loading}
            style={{
              backgroundColor: isBookmarked ? "#ffc107" : "transparent",
              color: isBookmarked ? "#000" : "#666",
              border: "1px solid",
              borderColor: isBookmarked ? "#ffc107" : "#ddd",
              padding: "8px 12px",
              borderRadius: "4px",
              fontSize: "12px",
              cursor: loading ? "not-allowed" : "pointer",
              whiteSpace: "nowrap",
              width: "100%",
            }}
          >
            {loading ? "..." : isBookmarked ? "⭐ Saved" : "☆ Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default IssueCard;
