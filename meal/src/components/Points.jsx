// Benefit.js
import React from 'react';
import '../styles/Points.css';

const Points = ({ icon, title, description }) => {
  return (
    <div className="benefit">
      <div className="icon">
        <img src={icon} alt={title} />
      </div>
      <div className="text">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default Points;
