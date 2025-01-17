import React, { useState, useEffect, useCallback } from 'react';
import MealCards from '../components/MealCards'; // Ensure the path is correct
import '../styles/IngredientPage.css'; // Import your custom styles
import ResetIcon from '../assests/reset.png';

const IngredientPage = () => {
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [ingredients, setIngredients] = useState(localStorage.getItem('ingredients') || ''); // Retrieve from localStorage
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState(localStorage.getItem('categoryFilter') || ''); // Retrieve from localStorage
  const [hasFetched, setHasFetched] = useState(false);

  const resetFilters = () => {
    setIngredients('');
    setCategoryFilter('');
    setCurrentPage(1);
    localStorage.removeItem('ingredients'); // Clear from localStorage
    localStorage.removeItem('categoryFilter'); // Clear from localStorage
  };

  const fetchMeals = useCallback(async () => {
    setLoading(true);
    setError(null);

    let url = `http://localhost:5000/recipes?page=${currentPage}&limit=20`;

    if (ingredients) {
      url += `&ingredients=${encodeURIComponent(ingredients)}`;
    }
    if (categoryFilter) {
      url += `&DietaryCategory=${encodeURIComponent(categoryFilter)}`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const mealsData = await response.json();
      setFilteredMeals(mealsData.recipes);
      setTotalPages(mealsData.totalPages);
      setHasFetched(true);
    } catch (error) {
      console.error('Error fetching meals:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [ingredients, currentPage, categoryFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMeals();
    }, 500);

    return () => clearTimeout(timer);
  }, [ingredients, currentPage, fetchMeals]);

  useEffect(() => {
    localStorage.setItem('ingredients', ingredients); // Store ingredients in localStorage
    localStorage.setItem('categoryFilter', categoryFilter); // Store category in localStorage
  }, [ingredients, categoryFilter]); // Update localStorage whenever these change

  const handleIngredientChange = (e) => {
    const value = e.target.value;

    const validInput = /^[a-zA-Z\s,]*$/;

    if (validInput.test(value) || value === '') {
      setIngredients(value);
      setCurrentPage(1);
    } else {
      setError("Please enter valid ingredients...");
    }
  };

  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="IngredientPage">
      <main>
        <div className="container-fluid">
          <h1 className="text-center mt-3">Filter Meals by Ingredients</h1>
          <p className='page-descrption'>Unlock the art of refined simplicity. Enter your available ingredients, and discover dishes that transform everyday elements into sophisticated, unexpected combinations</p>
          <div className="filter-container text-center mb-4">
            <input
              type="text"
              placeholder="Enter Ingredients:"
              value={ingredients}
              onChange={handleIngredientChange}
              className="ingredient-filter-input"
            />
            <button className="reset-button" onClick={resetFilters}>
              <img src={ResetIcon} alt="Reset Filters" className="reset-icon" />
            </button>
          </div>
          <div className="category-filter text-center mb-4">
            <div
              className={`filter-box ${categoryFilter === 'Herbivore' ? 'selected' : ''}`}
              onClick={() => handleCategoryChange('Herbivore')}
            >
              <span role="img" aria-label="leaf">🌿</span> Herbivore
            </div>
            <div
              className={`filter-box ${categoryFilter === 'Carnivore' ? 'selected' : ''}`}
              onClick={() => handleCategoryChange('Carnivore')}
            >
              <span role="img" aria-label="meat">🍖</span> Carnivore
            </div>
            <div
              className={`filter-box ${categoryFilter === 'Eggitarian' ? 'selected' : ''}`}
              onClick={() => handleCategoryChange('Eggitarian')}
            >
              <span role="img" aria-label="egg">🥚</span> Eggitarian
            </div>
            <div
              className={`filter-box ${categoryFilter === 'Vegan' ? 'selected' : ''}`}
              onClick={() => handleCategoryChange('Vegan')}
            >
              <span role="img" aria-label="plant">🌱</span> Vegan
            </div>
            <div
              className={`filter-box ${categoryFilter === 'Pescatarian' ? 'selected' : ''}`}
              onClick={() => handleCategoryChange('Pescatarian')}
            >
              <span role="img" aria-label="fish">🐟</span> Pescatarian
            </div>
          </div>
          {loading && (
            <div className="loading-message">
              <p>🍽️ Cooking up something delicious... Please hold your forks! 🍴</p>
            </div>
          )}

          {!loading && error && <p>{error}</p>}
          {!loading && filteredMeals.length > 0 ? (
            <>
              <div className="meal-cards-container">
                {filteredMeals.map((recipe) => (
                  <MealCards key={recipe.RecipeId} recipe={recipe} />
                ))}
              </div>
              <div className="pagination">
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                  Next
                </button>
              </div>
            </>
          ) : (
            !loading && hasFetched && <p>No meals found.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default IngredientPage;
