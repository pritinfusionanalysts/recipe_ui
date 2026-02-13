import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    let newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      setServerError("");

      const response = await API.post("/api/user/signup", {
        username: email,
        password: password
      });

      alert("Signup Successful ✅");

      // Redirect to login page after signup
      navigate("/login");

    } catch (error) {
      if (error.response) {
        setServerError(error.response.data.message || "Signup failed");
      } else {
        setServerError("Server not responding");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #667eea, #764ba2)"
      }}
    >
      <div
        className="card shadow-lg p-4 border-0"
        style={{ width: "400px", borderRadius: "15px" }}
      >
        <h3 className="text-center fw-bold mb-4">Create Account ✨</h3>

        {serverError && (
          <div className="alert alert-danger">{serverError}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="text"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-success w-100 fw-bold"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          <p className="text-center mt-3 mb-0">
            Already have an account?{" "}
            <Link to="/login" className="text-decoration-none fw-bold">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
