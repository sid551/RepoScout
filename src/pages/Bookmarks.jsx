import { useState, useEffect } from "react";
import { bookmarkAPI } from "../services/api";
import RepoCard from "../components/RepoCard";

function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    setLoading(true);
    try {
      const response = await bookmarkAPI.getBookmarks();
      setBookmarks(response.data);
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
      setBookmarks(bookmarks.filter((b) => b._id !== bookmarkId));
    } catch (error) {
      console.error("Failed to remove bookmark:", error);
      alert("Failed to remove bookmark. Please try again.");
    }
  };

  return (
    <div className="page-container">
      <h2 className="mb-4">Your Bookmarked Repositories</h2>

      {loading ? (
        <div className="text-center" style={{ marginTop: "50px" }}>
          <p>Loading bookmarks...</p>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="text-center" style={{ marginTop: "50px" }}>
          <p>
            No bookmarks yet. Start exploring repositories and bookmark the ones
            you like!
          </p>
          <a
            href="/repositories"
            className="btn mt-3"
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
        </div>
      ) : (
        <div className="repos-grid">
          {bookmarks.map((bookmark) => (
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
                onRemoveBookmark={() => handleRemoveBookmark(bookmark._id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Bookmarks;
