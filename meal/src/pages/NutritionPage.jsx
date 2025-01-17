import React, { useState } from 'react';
import '../styles/NutritionPage.css';
import MealCards from '../components/MealCards'; // Import MealCards component
import bodyScaleIcon from '../assests/body-scale.png';
import generalHealthyDietIcon from '../assests/general-healthy-diet.png';
import healthyFlexIcon from '../assests/healthy-flex.png';
import zoneDietIcon from '../assests/zone-diet.png';
import boneHealthIcon from '../assests/bone-health.png';
import eatMoreVeggiesIcon from '../assests/eat-more-veggies.png';
import highFiberIcon from '../assests/high-fiber.png';
import increaseEnergyIcon from '../assests/increase-energy.png';
import lowCarbIcon from '../assests/low-carb.png';
import lowCarbHighFatIcon from '../assests/low-carb-high-fat.png';
import lowSodiumIcon from '../assests/low-sodium.png';
import mediterraneanDietIcon from '../assests/mediterranean-diet.png';
import musclegainIcon from '../assests/muscle-gain.png';
import whole30Icon from '../assests/whole30.png';
import enduranceIcon from '../assests/endurance.png';

const NutritionPage = () => {
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null); // Allow null to load all recipes initially
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [hasFetched, setHasFetched] = useState(false); // New state to track if fetch has occurred


    const scrollGoals = (direction) => {
        const container = document.getElementById('goals');
        const scrollAmount = 150;
        container.scrollLeft += direction * scrollAmount;
    };

    const selectGoal = (goal, element) => {
        setSelectedGoal(goal);
        const items = document.querySelectorAll('.goal-item');
        items.forEach(item => item.classList.remove('selected'));
        element.classList.add('selected');
    };

    const selectCategory = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1); // Reset to first page on category change
    };

    const displayRecipes = async (page = 1) => {
        setLoading(true); // Set loading only when displaying recipes
        setError(null);

        try {
            let url = `http://localhost:5000/recipes-by-nutrition-and-diet?page=${page}&limit=20`;

            // Build URL based on selections
            if (selectedGoal) {
                url += `&LifestyleGoals=${encodeURIComponent(selectedGoal)}`;
            }
            if (selectedCategory) {
                url += `&DietaryCategory=${encodeURIComponent(selectedCategory)}`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            const data = await response.json();
            setRecipes(data.recipes || []);
            setTotalPages(data.totalPages || 0);
            setCurrentPage(page);
            setHasFetched(true); // Set to true once data has been fetched
        } catch (error) {
            setError('Error fetching recipes: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            displayRecipes(currentPage + 1); // Fetch next page
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            displayRecipes(currentPage - 1); // Fetch previous page
        }
    };

    const goals = [
        { name: 'General Healthy Diet', icon: generalHealthyDietIcon },
        { name: 'Lose Weight', icon: bodyScaleIcon },
        { name: 'Whole30', icon: whole30Icon },
        { name: 'Healthy Flex', icon: healthyFlexIcon },
        { name: 'Zone Diet', icon: zoneDietIcon },
        { name: 'Bone Health', icon: boneHealthIcon },
        { name: 'Eat More Veggies', icon: eatMoreVeggiesIcon },
        { name: 'Endurance', icon: enduranceIcon },
        { name: 'High Fiber', icon: highFiberIcon },
        { name: 'Increase Energy', icon: increaseEnergyIcon },
        { name: 'Low Carb', icon: lowCarbIcon },
        { name: 'Low Carb/High Fat', icon: lowCarbHighFatIcon },
        { name: 'Low Sodium', icon: lowSodiumIcon },
        { name: 'Mediterranean Diet', icon: mediterraneanDietIcon },
        { name: 'Muscle Gain', icon: musclegainIcon },
    ];

    return (
        <div className="container-fluid" id = "styling">
            <section className="goals">
                <h1>Lifestyle Goals</h1>
                <p className='page-descrption'>Elevate your dining with purposefully crafted recipes. From nutrient-dense selections to high-fiber and plant-centric creations, explore dishes that align with your wellness ideals.</p>
                <div className="navigation">
                    <div className="arrow left-arrow" onClick={() => scrollGoals(-1)}>
                        &#10094;
                    </div>
                    <div className="goals-container" id="goals">
                        {goals.map((goal) => (
                            <div key={goal.name} className="goal-item" onClick={(e) => selectGoal(goal.name, e.currentTarget)}>
                                <img src={goal.icon} alt={goal.name} />
                                <p>{goal.name}</p>
                            </div>
                        ))}
                    </div>
                    <div className="arrow right-arrow" onClick={() => scrollGoals(1)}>
                        &#10095;
                    </div>
                </div>
            </section>

            <section className="dietary-category">
                <div className="category-filter text-center mb-4">
                    <div
                        className={`filter-box ${selectedCategory === 'Herbivore' ? 'selected' : ''}`}
                        onClick={() => selectCategory('Herbivore')}
                    >
                        <span role="img" aria-label="leaf">🌿</span> Herbivore
                    </div>
                    <div
                        className={`filter-box ${selectedCategory === 'Carnivore' ? 'selected' : ''}`}
                        onClick={() => selectCategory('Carnivore')}
                    >
                        <span role="img" aria-label="meat">🍖</span> Carnivore
                    </div>
                    <div
                        className={`filter-box ${selectedCategory === 'Eggitarian' ? 'selected' : ''}`}
                        onClick={() => selectCategory('Eggitarian')}
                    >
                        <span role="img" aria-label="egg">🥚</span> Eggitarian
                    </div>
                    <div
                        className={`filter-box ${selectedCategory === 'Vegan' ? 'selected' : ''}`}
                        onClick={() => selectCategory('Vegan')}
                    >
                        <span role="img" aria-label="plant">🌱</span> Vegan
                    </div>
                    <div
                        className={`filter-box ${selectedCategory === 'Pescatarian' ? 'selected' : ''}`}
                        onClick={() => selectCategory('Pescatarian')}
                    >
                        <span role="img" aria-label="fish">🐟</span> Pescatarian
                    </div>
                </div>
                <button className="nutritional-button" onClick={() => displayRecipes()}>
                    Display Recipes
                </button>

                {loading && (
                    <div className="loading-message">
                        <p>🍽️ Cooking up something delicious. . . Please hold your forks! 🍴</p>
                    </div>
                )}

                {error && <p className="error-message">{error}</p>} {/* Display error message */}
            </section>

            <div id="recipesContainer" className="recipes-container">
                {hasFetched && !loading && recipes.length > 0 ? (
                    <>
                        <div className="card-container">
                            {recipes.map((recipe) => (
                                <MealCards key={recipe.RecipeId} recipe={recipe} />
                            ))}
                        </div>
                        <div className="pagination">
    <button className="pagination-button" onClick={handlePreviousPage} disabled={currentPage === 1}>
        Previous
    </button>
    <span>
        Page {currentPage} of {totalPages}
    </span>
    <button className="pagination-button" onClick={handleNextPage} disabled={currentPage === totalPages}>
        Next
    </button>
</div>

                    </>
                ) : hasFetched && !loading && (
                    <p>No recipes found for the selected goal and/or dietary category.</p>
                )}
            </div>
        </div>
    );
};

export default NutritionPage;
