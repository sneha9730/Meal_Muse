import React, { useState, useEffect, useCallback } from 'react';
import MealCards from '../components/MealCards';
import '../styles/TimePage.css';
import ResetIcon from '../assests/reset.png';

const TimePage = () => {
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [minTimeFilter, setMinTimeFilter] = useState('');
  const [maxTimeFilter, setMaxTimeFilter] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasFetched, setHasFetched] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    // Load filters from local storage
    const storedMinTime = localStorage.getItem('minTimeFilter');
    const storedMaxTime = localStorage.getItem('maxTimeFilter');
    const storedCategory = localStorage.getItem('categoryFilter');

    if (storedMinTime) setMinTimeFilter(storedMinTime);
    if (storedMaxTime) setMaxTimeFilter(storedMaxTime);
    if (storedCategory) setCategoryFilter(storedCategory);
  }, []);

  const resetFilters = () => {
    setMinTimeFilter('');
    setMaxTimeFilter('');
    setCategoryFilter('');
    setCurrentPage(1);
    // Clear filters from local storage
    localStorage.removeItem('minTimeFilter');
    localStorage.removeItem('maxTimeFilter');
    localStorage.removeItem('categoryFilter');
  };

  const fetchMeals = useCallback(async () => {
    setLoading(true);
    setError(null);

    let url = `http://localhost:5000/recipes?page=${currentPage}`;
    if (minTimeFilter || maxTimeFilter || categoryFilter) {
      url += `&minTime=${minTimeFilter}&maxTime=${maxTimeFilter}&DietaryCategory=${categoryFilter}`;
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
  }, [minTimeFilter, maxTimeFilter, currentPage, categoryFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        minTimeFilter ||
        maxTimeFilter ||
        categoryFilter ||
        (!minTimeFilter && !maxTimeFilter && !categoryFilter)
      ) {
        if (
          (minTimeFilter && (isNaN(minTimeFilter) || Number(minTimeFilter) < 0)) ||
          (maxTimeFilter && (isNaN(maxTimeFilter) || Number(maxTimeFilter) < 0))
        ) {
          setError("Please enter valid numbers greater than or equal to 0 for time.");
          return;
        }

        if (Number(minTimeFilter) > Number(maxTimeFilter)) {
          setError("Minimum time cannot be greater than maximum time.");
          return;
        }

        fetchMeals();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [minTimeFilter, maxTimeFilter, currentPage, categoryFilter, fetchMeals]);

  const handleMinTimeChange = (e) => {
    setMinTimeFilter(e.target.value);
    setCurrentPage(1);
    // Save filter to local storage
    localStorage.setItem('minTimeFilter', e.target.value);
  };

  const handleMaxTimeChange = (e) => {
    setMaxTimeFilter(e.target.value);
    setCurrentPage(1);
    // Save filter to local storage
    localStorage.setItem('maxTimeFilter', e.target.value);
  };

  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
    setCurrentPage(1);
    // Save filter to local storage
    localStorage.setItem('categoryFilter', category);
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
    <div className="TimePage">
      <main>
        <div className="container-fluid">

          <h1 className="text-center mb-2 mt-3">Filter Meals by Time Range</h1>
          <p className='page-descrption'>Curate dishes that harmonize with the rhythms of your day. Whether a swift culinary interlude or an unhurried creation, discover recipes perfectly attuned to your available time.</p>
          <div className="filter-container text-center mb-4">
            <input
              type="number"
              placeholder="Min Time:"
              value={minTimeFilter}
              onChange={handleMinTimeChange}
              className="time-filter-input"
            />
            <input
              type="number"
              placeholder="Max Time:"
              value={maxTimeFilter}
              onChange={handleMaxTimeChange}
              className="time-filter-input"
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
                <p>🍽️ Cooking up something delicious. . . Please hold your forks! 🍴</p>
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

export default TimePage;
