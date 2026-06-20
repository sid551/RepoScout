import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30s to handle Render cold starts
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  githubAuth: (code) => api.post("/auth/github", { code }),
};

// User API
export const userAPI = {
  getProfile: () => api.get("/users/profile"),
  updateSkills: (skills) => api.put("/users/skills", { skills }),
};

// Repository API
export const repoAPI = {
  searchRepos: (skills) => api.get(`/repos/search?skills=${skills.join(",")}`),
  getTrending: (language) =>
    api.get(`/repos/trending?language=${language || ""}`),
};

// Issues API
export const issueAPI = {
  searchIssues: (skills) =>
    api.get(`/issues/search?skills=${skills.join(",")}`),
  getRepoIssues: (owner, repo) => api.get(`/issues/repo/${owner}/${repo}`),
  getBeginnerLabels: () => api.get("/issues/beginner-labels"),
};

// Bookmarks API
export const bookmarkAPI = {
  getBookmarks: () => api.get("/bookmarks"),
  addBookmark: (bookmarkData) => api.post("/bookmarks", bookmarkData),
  removeBookmark: (bookmarkId) => api.delete(`/bookmarks/${bookmarkId}`),
  removeByRepoId: (repoId) => api.delete(`/bookmarks/repo/${repoId}`),
  checkBookmarked: (repoId) => api.get(`/bookmarks/check/${repoId}`),
};

export default api;
