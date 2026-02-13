import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await API.post("/api/user/login", {
        username,
        password
      });

      // ✅ Store token
      localStorage.setItem("token", response.data.jwt);
      localStorage.setItem("username", username);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert("Login Successful 🎉");

      // Redirect to recipes page
      navigate("/UserProfile");

    } catch (err) {
      setError("Invalid email or password ❌");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #1e3c72, #2a5298)"
      }}
    >
      <div className="card shadow-lg p-4 border-0" style={{ width: "400px", borderRadius: "15px" }}>
        
        <h3 className="text-center fw-bold mb-4">Welcome Back 👋</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="username"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary w-100 fw-bold"
          onClick={handleLogin}
        >
          Login
        </button>

        <p className="text-center mt-4 mb-0">
          Don't have an account?{" "}
          <Link to="/signup" className="text-decoration-none fw-bold">
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;
