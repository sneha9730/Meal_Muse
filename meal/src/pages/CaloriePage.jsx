import React, { useState, useEffect, useCallback } from 'react';
import MealCards from '../components/MealCards';
import '../styles/TimePage.css';
import ResetIcon from '../assests/reset.png';

const CaloriePage = () => {
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [minCalorieFilter, setMinCalorieFilter] = useState(() => localStorage.getItem('minCalorieFilter') || 0);
  const [maxCalorieFilter, setMaxCalorieFilter] = useState(() => localStorage.getItem('maxCalorieFilter') || 0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState(() => localStorage.getItem('categoryFilter') || '');
  const [hasFetched, setHasFetched] = useState(false);

  const resetFilters = () => {
    setMinCalorieFilter('');
    setMaxCalorieFilter('');
    setCategoryFilter('');
    setCurrentPage(1);
    localStorage.removeItem('minCalorieFilter');
    localStorage.removeItem('maxCalorieFilter');
    localStorage.removeItem('categoryFilter');
  };

  const fetchMeals = useCallback(async () => {
    setLoading(true);
    setError(null);

    let url = `http://localhost:5000/recipes?page=${currentPage}`;

    if (minCalorieFilter || maxCalorieFilter || categoryFilter) {
      url += `&minCalories=${minCalorieFilter}&maxCalories=${maxCalorieFilter}&DietaryCategory=${categoryFilter}`;
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
  }, [minCalorieFilter, maxCalorieFilter, currentPage, categoryFilter]);

  useEffect(() => {
    // Load filters from local storage on component mount
    setMinCalorieFilter(localStorage.getItem('minCalorieFilter') || 0);
    setMaxCalorieFilter(localStorage.getItem('maxCalorieFilter') || 0);
    setCategoryFilter(localStorage.getItem('categoryFilter') || '');

    const timer = setTimeout(() => {
      setError(null);

      // Validate calorie filters
      if ((minCalorieFilter < 0) || (maxCalorieFilter < 0)) {
        setError("Please enter valid numbers for calories (greater than or equal to 0).");
        return;
      }

      if (Number(minCalorieFilter) > Number(maxCalorieFilter)) {
        setError("Minimum calories cannot be greater than maximum calories.");
        return;
      }

      fetchMeals();
    }, 500);
    return () => clearTimeout(timer); // Cleanup the timer
  }, [minCalorieFilter, maxCalorieFilter, currentPage, categoryFilter, fetchMeals]);

  const handleMinCalorieChange = (e) => {
    const value = e.target.value;
    setMinCalorieFilter(value);
    setCurrentPage(1);
    localStorage.setItem('minCalorieFilter', value); // Save to local storage
  };

  const handleMaxCalorieChange = (e) => {
    const value = e.target.value;
    setMaxCalorieFilter(value);
    setCurrentPage(1);
    localStorage.setItem('maxCalorieFilter', value); // Save to local storage
  };

  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
    setCurrentPage(1);
    localStorage.setItem('categoryFilter', category); // Save to local storage
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1); // Increment page number
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1); // Decrement page number
    }
  };

  return (
    <div className="CaloriePage">
      <main>
        <div className="container-fluid">
          <h1 className="text-center mt-3">Filter Meals by Calorie Range</h1>
          <p className='page-descrption'>Select recipes with precision, balancing flavor and nutrition within your desired caloric range, crafted to complement your health goals with both indulgence and restraint.</p>
          <div className="filter-container text-center mb-4">
            <input
              type="number"
              placeholder="Min Calories:"
              value={minCalorieFilter}
              onChange={handleMinCalorieChange}
              className="time-filter-input"
            />
            <input
              type="number"
              placeholder="Max Calories:"
              value={maxCalorieFilter}
              onChange={handleMaxCalorieChange}
              className="time-filter-input"
            />
            <button className="reset-button" onClick={resetFilters}>
              <img src={ResetIcon} alt="Reset Filters" className="reset-icon" />
            </button>
          </div>

          {/* Category Filter Section */}
          <div className="category-filter text-center mb-4">
            <div
              className={`filter-box ${categoryFilter === 'Herbivore' ? 'selected' : ''}`}
              onClick={() => handleCategoryChange('Herbivore')}
            >
              <span role="img" aria-label="leaf">🌿</span> Vegetarian
            </div>
            <div
              className={`filter-box ${categoryFilter === 'Carnivore' ? 'selected' : ''}`}
              onClick={() => handleCategoryChange('Carnivore')}
            >
              <span role="img" aria-label="meat">🍖</span> Non-Vegetarian
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

export default CaloriePage;
