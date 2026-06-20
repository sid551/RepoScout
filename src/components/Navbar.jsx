import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

function Navbar() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    return () => setIsMenuOpen(false);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" onClick={closeMenu} className="navbar-logo">
          <span className="logo-icon">🔍</span>
          <span className="logo-text">RepoScout</span>
        </Link>

        {user ? (
          <>
            {/* Desktop Menu */}
            <div className="desktop-menu">
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/repositories" className="nav-link">
                Repositories
              </Link>
              <Link to="/issues" className="nav-link">
                Issues
              </Link>
              <Link to="/bookmarks" className="nav-link">
                Bookmarks
              </Link>
              <Link to="/skills" className="nav-link">
                Skills
              </Link>

              <div className="nav-divider"></div>

              <div className="user-section">
                <span className="user-info">
                  <span className="user-icon">👤</span>
                  {user.username}
                </span>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              className="hamburger-btn"
            >
              <span
                className={`hamburger-line ${isMenuOpen ? "open" : ""}`}
              ></span>
              <span
                className={`hamburger-line ${isMenuOpen ? "open" : ""}`}
              ></span>
              <span
                className={`hamburger-line ${isMenuOpen ? "open" : ""}`}
              ></span>
            </button>

            {/* Mobile Menu Backdrop */}
            {isMenuOpen && (
              <div onClick={closeMenu} className="mobile-backdrop" />
            )}

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="mobile-menu">
                <Link
                  to="/dashboard"
                  onClick={closeMenu}
                  className="mobile-nav-link"
                >
                  <span className="mobile-icon">📊</span>
                  Dashboard
                </Link>
                <Link
                  to="/repositories"
                  onClick={closeMenu}
                  className="mobile-nav-link"
                >
                  <span className="mobile-icon">📁</span>
                  Repositories
                </Link>
                <Link
                  to="/issues"
                  onClick={closeMenu}
                  className="mobile-nav-link"
                >
                  <span className="mobile-icon">🚀</span>
                  Issues
                </Link>
                <Link
                  to="/bookmarks"
                  onClick={closeMenu}
                  className="mobile-nav-link"
                >
                  <span className="mobile-icon">⭐</span>
                  Bookmarks
                </Link>
                <Link
                  to="/skills"
                  onClick={closeMenu}
                  className="mobile-nav-link"
                >
                  <span className="mobile-icon">🎯</span>
                  Skills
                </Link>

                <div className="mobile-user-info">
                  <span className="mobile-user-icon">👤</span>
                  <span>Hi, {user.username}</span>
                </div>

                <button onClick={handleLogout} className="mobile-btn-logout">
                  <span>🚪</span> Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <Link to="/login" className="btn-login">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
