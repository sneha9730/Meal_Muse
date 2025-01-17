import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Navbar.css';
import logo from '../assests/Navbar_logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Logout function
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Function to handle smooth scroll to "About" section
  const scrollToAbout = (e) => {
    e.preventDefault();
    navigate('/');
    setTimeout(() => {
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);
  };

  // Function to handle smooth scroll to "Category" section
  const scrollToCategory = (e) => {
    e.preventDefault();
    navigate('/');
    setTimeout(() => {
      const categorySection = document.getElementById("category");
      if (categorySection) {
        categorySection.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);
  };

  return (
    <nav className="navbarCustom navbar navbar-expand-lg">
      <div className="container-fluid" id= "snsnsn">
        <Link className="navbarBrand navbar-brand" to="/">
          <img src={logo} alt="MealMuse" className="navbar-logo" id="navbar-logo" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="navItem nav-item">
              <Link className="navLink nav-link" to="/">Home</Link>
            </li>
            <li className="navItem nav-item">
              <a href="#about" className="navLink nav-link" onClick={scrollToAbout}>About</a>
            </li>
            <li className="navItem nav-item">
              <a href="#category" className="navLink nav-link" onClick={scrollToCategory}>Personalize Preferences</a>
            </li>
            <li className="navItem nav-item">
              <Link className="navLink nav-link" to="/quiz">Quiz</Link>
            </li>
            <li className="navItem nav-item">
              <Link className="navLink nav-link" to="/search">Search</Link>
            </li>
            
            {token && (
              <li className="navItem nav-item">
                <Link className="navLink nav-link" to="/profile">Dashboard</Link>
              </li>
            )}
          </ul> 

          <div className="d-flex">
            {!token ? (
              <>
                <Link to="/login" className="btn">Login</Link>
                <Link to="/register" className="btn ms-2">Sign Up</Link>
              </>
            ) : (
              <button onClick={handleLogout} className="btn ms-2">Logout</button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
