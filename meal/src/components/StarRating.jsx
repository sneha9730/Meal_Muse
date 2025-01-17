import React from 'react';
import '../styles/StarRating.css'; 

const StarRating = ({ rating }) => {
  const totalStars = 5;
  const filledStars = Math.round(rating);

  return (
    <div className="star-rating">
      {[...Array(totalStars)].map((_, index) => (
        <span key={index} className={index < filledStars ? 'filled' : 'empty'}>
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
