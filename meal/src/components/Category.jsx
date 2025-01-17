import React from 'react';
import { Link } from 'react-router-dom'; 
import '../styles/Category.css';

import CalorieImg from '../assests/Calorie.png';
import TimerImg from '../assests/Timer.png';
import IngredientImg from '../assests/Ingredient.png';
import NutritionImg from '../assests/Nutrition.png';

const categories = [
  { id: 1, title: "TIME", imgSrc: TimerImg, alt: "Time", link: "/time" },
  { id: 2, title: "CALORIES", imgSrc: CalorieImg, alt: "Calories", link: "/calorie" },
  { id: 3, title: "INGREDIENTS", imgSrc: IngredientImg, alt: "Ingredients", link: "/ingredients" },
  { id: 4, title: "NUTRITION", imgSrc: NutritionImg, alt: "Nutrition", link: "/nutrition" },
];

const CategoryPage = () => {
  return (
    <div className="container-fluid" id="body">
      {/* Title Section */}
      <div className="text-center mb-4" id = "y">
        <h2 className="category-title">PERSONALIZED PREFERENCES</h2>
        <p className='content-text'>Explore recipes tailored to your lifestyle—whether you're short on time, counting calories, balancing nutrients, or seeking specific ingredients. Simply choose a category and find your perfect dish!</p>
      </div>

      <div className="row text-center" id="z">
        {categories.map(category => (
          <div key={category.id} className="col-lg-3 col-md-6 mb-4">
            <div className="card category-card">
              <div className="card-body">
                <Link to={category.link} className="category-link">
                  <img src={category.imgSrc} alt={category.alt} className="category-icon" />
                  <h5 className="cat-title">{category.title}</h5>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
