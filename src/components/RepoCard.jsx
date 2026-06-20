function RepoCard({
  repo,
  onBookmark,
  isBookmarked = false,
  onRemoveBookmark,
}) {
  const formatStars = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

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
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "#007bff" }}
            >
              {repo.full_name}
            </a>
          </h3>

          <p
            style={{
              color: "#666",
              margin: "10px 0",
              fontSize: "14px",
              lineHeight: "1.4",
            }}
          >
            {repo.description || "No description available"}
          </p>

          <div
            style={{
              display: "flex",
              gap: "15px",
              alignItems: "center",
              marginTop: "15px",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "14px",
              }}
            >
              ⭐ {formatStars(repo.stargazers_count)} stars
            </span>

            {repo.language && (
              <span
                style={{
                  fontSize: "12px",
                  backgroundColor: "#f1f3f4",
                  padding: "2px 8px",
                  borderRadius: "12px",
                }}
              >
                {repo.language}
              </span>
            )}
          </div>
        </div>

        <div style={{ marginLeft: "15px" }}>
          {isBookmarked ? (
            <button
              onClick={onRemoveBookmark}
              style={{
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              Remove
            </button>
          ) : (
            <button
              onClick={onBookmark}
              style={{
                backgroundColor: "#ffc107",
                color: "black",
                border: "none",
                padding: "8px 12px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              ⭐ Bookmark
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default RepoCard;
