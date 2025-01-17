import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Login.css';

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error during login');
      }

      const data = await response.json();
      localStorage.setItem("token", data.token); // Store JWT token in localStorage
      localStorage.setItem("userId", data._id); // Store user ID in localStorage

      setUser({ token: data.token }); // Set user state
      setMessage("Login Successful!");
      navigate("/profile");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-overlay">
        <form onSubmit={handleLogin} className="form">
          <h3 className="title">Login</h3>
          {message && <p className="error-message">{message}</p>}
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              id="input"
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              id="input"
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary" id="login-button">
              Login
            </button>
          </div>
          <p className="forgot-password text-right" id="another-text">
            Don't have an account? <a href="/register" className="form-link">Register</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
