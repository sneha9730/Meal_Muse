import React from 'react';
import MealCards from '../components/MealCards';
import '../styles/Homepage.css'; 
import CategoryPage from '../components/Category'; 
import recipe from './popular_recipes.json';
import One from '../assests/pe.png';
import Two from '../assests/dr.png';
import Three from '../assests/5.png'

const Homepage = () => {
  return (
    <div className="Homepage">
      <main>
        <div className="fullscreen-bg">
          <div className="overlay">
            <div>
              <h1 className="display-4">My Meal <br /> Recommender</h1>
              <p className="lead">A personalized meal recommender<br /> according to your needs</p>
            </div>
          </div>
        </div>

        <div className="container-fluid" id ="about">
          <h2 className="text-center mb-4 " id ="why">Why Mealmuse?</h2>
          <div className="about-list">
          {/*<div className="points">
          <div className="icon-about">
            <img src={One} alt="point 1" className='point-img'/>
          </div>
          <div className="text-about">
            <h3 className='point-title'>Our Mission</h3>
            <p className='point-description'>To inspire individuals with tailored meal recommendations that foster healthy lifestyles and culinary creativity.</p>
          </div>
        </div>*/}
        <div className="points">
          <div className="icon-about">
            <img src={One} alt="point 1" className='point-img'/>
          </div>
          <div className="text-about">
            <h3 className='point-title'>Personalized Experience</h3>
            <p className='point-description'>We provide customized meal suggestions based on dietary preferences, nutritional goals, and available ingredients.</p>
          </div>
        </div>
        <div className="points">
          <div className="icon-about">
            <img src={Three} alt="point 1" className='point-img'/>
          </div>
          <div className="text-about">
            <h3 className='point-title'> Support for Health Goals</h3>
            <p className='point-description'>We prioritize your well-being, offering recipes aligned with dietary restrictions and specific health conditions.</p>
          </div>
        </div>
        {/*<div className="points">
          <div className="icon-about">
            <img src={One} alt="point 1" className='point-img'/>
          </div>
          <div className="text-about">
            <h3 className='point-title'>Easy Accessibility</h3>
            <p className='point-description'>Access recipes anytime, anywhere, with features for email sharing, PDF printing, and exploration.</p>
          </div>
        </div>*/}
        <div className="points">
          <div className="icon-about">
            <img src={Two} alt="point 1" className='point-img'/>
          </div>
          <div className="text-about">
            <h3 className='point-title'>Diverse Collection of Recipes</h3>
            <p className='point-description'>Our platform offers a rich array of recipes, catering to varied tastes, cultures, and dietary needs.</p>
          </div>
        </div>
        </div>
        </div>



        <div className="container-fluid">
          <h2 className="text-center mb-4 mt-3">Popular Dishes</h2>
          <div className="card-container">

          {recipe.map(recipe => (
            <MealCards key={recipe.RecipeId} recipe={recipe} />
          ))}
      </div>
        </div>
        
        <div className="mt-5 mb-5" id = "category">
          <CategoryPage />
        </div>
      </main>
    </div>
  );
};

export default Homepage;
