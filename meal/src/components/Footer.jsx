import React from 'react';
import { Link ,useNavigate } from 'react-router-dom';
import '../styles/Footer.css';
import logo from '../assests/Logo.png'; // Fixed 'assests' to 'assets'

const Footer = () => {

    const navigate = useNavigate();

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
        <div className='context-footer'>
        <footer className="footer" >
            <div className="footer-content">
                {/* First column with logo and description */}
                <div className="footer-logo-section">
                    <img src={logo} alt="Meal Muse Logo" className="footer-logo" />
                    <p className="footer-description">
                        <strong>Meal Muse</strong>, your personalized meal recommender according to your needs.
                    </p>
                </div>

                {/* Second column with links */}
                <div className="footer-links">
                <h5 className='link'>LINK</h5>
                    <ul>
                        <li><Link to="/">  HOME</Link></li>
                        <li><a href="#about" className="navLink nav-link" onClick={scrollToAbout}>About</a></li>
                        <li><a href="#category" className="navLink nav-link" onClick={scrollToCategory}>Personalize Preferences</a></li>
                    </ul>
                </div>

                {/* Third column with links */}
                <div className="footer-links">
                <h5 className='link'>MORE LINKS</h5>
                    <ul>
                        <li><Link to="/search">  Search</Link></li>
                        <li><Link to="/quiz">  QUIZ</Link></li>
                        <li><Link to="/profile">  MEAL HEAVEN</Link></li>
                    </ul>
                </div>
            </div>
            <div className='rights'>
                <p>&copy; 2024 Harika and Sneha. All rights reserved.</p>
            </div>
        </footer>
        </div>
    );
};

export default Footer;
