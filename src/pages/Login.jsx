import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authAPI } from "../services/api";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get("code");

    if (code) {
      handleGitHubCallback(code);
    }
  }, [location]);

  const handleGitHubCallback = async (code) => {
    setGithubLoading(true);
    try {
      const response = await authAPI.githubAuth(code);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      if (!response.data.user.skills?.length) {
        navigate("/skills");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.message || "GitHub authentication failed");
      window.history.replaceState({}, document.title, window.location.pathname);
    } finally {
      setGithubLoading(false);
    }
  };

  const handleGitHubLogin = () => {
    const clientId =
      import.meta.env.VITE_GITHUB_CLIENT_ID || "your_github_client_id";
    const redirectUri = `${window.location.origin}/login`;
    const scope = "read:user user:email";

    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response;
      if (isLogin) {
        response = await authAPI.login(formData);
      } else {
        response = await authAPI.register(formData);
      }

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      if (!isLogin || !response.data.user.skills?.length) {
        navigate("/skills");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  if (githubLoading) {
    return (
      <div className="text-center" style={{ marginTop: "100px" }}>
        <p>Authenticating with GitHub...</p>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="text-center mb-4">
        <h2 className="mb-2">{isLogin ? "Welcome Back" : "Create Account"}</h2>
        <p style={{ color: "#666", margin: "0" }}>
          {isLogin ? "Sign in to your account" : "Join ContribHub today"}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="mb-3">
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
              className="form-control"
            />
          </div>
        )}

        <div className="mb-3">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
            className="form-control"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn"
          style={{
            width: "100%",
            backgroundColor: loading ? "#6c757d" : "#007bff",
            color: "white",
            marginBottom: "20px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Loading..." : isLogin ? "Sign In" : "Create Account"}
        </button>
      </form>

      <div
        style={{
          margin: "20px 0",
          textAlign: "center",
          color: "#666",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: "1px",
            background: "#ddd",
          }}
        />
        <span
          style={{
            background: "white",
            padding: "0 15px",
            position: "relative",
            zIndex: 1,
          }}
        >
          Or
        </span>
      </div>

      <button
        onClick={handleGitHubLogin}
        className="btn"
        style={{
          width: "100%",
          backgroundColor: "#24292e",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "30px",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
        Continue with GitHub
      </button>

      <div className="text-center">
        <span style={{ color: "#666" }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
        </span>
        <button
          onClick={() => setIsLogin(!isLogin)}
          style={{
            background: "none",
            border: "none",
            color: "#007bff",
            cursor: "pointer",
            textDecoration: "underline",
            fontSize: "16px",
          }}
        >
          {isLogin ? "Create one" : "Sign in"}
        </button>
      </div>
    </div>
  );
}

export default Login;
