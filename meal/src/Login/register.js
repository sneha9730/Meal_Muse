import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Login.css';

function Register({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, name }),
        });

        if (response.status === 400) {
            const errorData = await response.json();
            throw new Error(errorData.message); // Throw specific error message
        }

        if (!response.ok) throw new Error('Error during registration');

        const data = await response.json();

        // Store JWT token and user ID in localStorage
        localStorage.setItem("token", data.token); // Store JWT token
        localStorage.setItem("userId", data._id); // Store user ID

        // Update user state
        setUser({ 
            token: data.token, 
            userId: data._id, 
            email: data.email, 
            name: data.name 
        });

        setMessage("User Registered Successfully!");

        // Redirect to profile page or any other page
        navigate("/profile");
    } catch (error) {
        setMessage(error.message);
    }
};


  return (
    <div className="login-bg">
      <div className="login-overlay">
        <form onSubmit={handleRegister} className="form">
          <h3 className="title">Register</h3>
          {message && <p className="error-message">{message}</p>}
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              id="input"
            />
          </div>
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
              Register
            </button>
          </div>
          <p className="forgot-password text-right" id="another-text">
            Already have an account? <a href="/login" className="form-link">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
