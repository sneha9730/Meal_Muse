import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/MealCards.css';
import Time from '../assests/Time.png';
import Servings from '../assests/Servings.jpg';
import Ingredient from '../assests/image.png';
import StarRating from './StarRating';
import arrow from '../assests/Arrows.png';

const MealCards = ({ recipe }) => {
  // Function to limit the description to 10 words
  const getLimitedDescription = (description) => {
    return description.split(' ').slice(0, 8).join(' ') + (description.split(' ').length > 10 ? '...' : '');
  };

/*const countIngredients = (ingredientsString) => {
    // Remove the "c(" and ")" and split by comma to convert into an array
    const ingredientsArray = ingredientsString.replace(/c\(|\)/g, '').split(',');
    return ingredientsArray.length;
  };*/

  return (
    <div className="card text-center">
      <img src={recipe.Images} alt={recipe.Name} className="card-img-top" />
      <div className="card-body">
        <div className="view-more-container">
          <Link to={`/recipe/${recipe.RecipeId}`} className="view-more-button">
            <img src={arrow} className='recipe_img' alt='view-more' />
          </Link>
        </div>
        <h5 className="card-title">{recipe.Name}</h5>
        <StarRating rating={recipe.AggregatedRating} className='text-warning' />
        <p className="card-text">{getLimitedDescription(recipe.Description)}</p>
        <div className="card-details">
          <div className="detail-item">
            <img src={Time} alt="Time" className="detail-icon" />
            <span>{recipe.TotalTime} mins</span>
          </div>
          <div className="detail-item">
            <img src={Servings} alt="Servings" className="detail-icon" />
            <span>{recipe.RecipeServings} Servings</span>
          </div>
          <div className="detail-item">
            <img src={Ingredient} alt="Calories" className="detail-icon" />
            <span>{recipe.ingredient_count} items</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealCards;
