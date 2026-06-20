import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Skills from "./pages/Skills";
import Dashboard from "./pages/Dashboard";
import Repositories from "./pages/Repositories";
import Issues from "./pages/Issues";
import Bookmarks from "./pages/Bookmarks";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>Loading...</div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/skills"
            element={user ? <Skills /> : <Navigate to="/login" />}
          />
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/repositories"
            element={user ? <Repositories /> : <Navigate to="/login" />}
          />
          <Route
            path="/issues"
            element={user ? <Issues /> : <Navigate to="/login" />}
          />
          <Route
            path="/bookmarks"
            element={user ? <Bookmarks /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
