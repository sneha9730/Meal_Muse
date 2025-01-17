import React, { useState } from 'react';
import "../styles/Search.css";
import Search from "../assests/Search.png";
import MealCards from '../components/MealCards';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    'Dessert', 'Lunch/Snacks', 'Vegetable', 'One Dish Meal', 'Breakfast', 
    'Beverages', 'Breads', 'Pork', 'Chicken', 'Potato', 'Quick Breads',
    'Chicken Breast', 'Sauces', 'Meat', 'Cheese', 'Yeast Breads', '< 60 Mins', 
    '< 30 Mins', 'Drop Cookies', 'Pie', 'Bar Cookie', 'Low Protein', '< 15 Mins',
    'Stew', 'Beans', 'Salad Dressings', 'Candy', 'Smoothies', 'Spreads', 
    'Onions', '< 4 Hours', 'European', 'Steak', 'Frozen Desserts', 'Poultry'
  ];

  const handleSearch = async (page = 1) => {
    try {
      const url = `http://localhost:5000/search?query=${encodeURIComponent(query)}${selectedCategory ? `&category=${encodeURIComponent(selectedCategory)}` : ''}&page=${page}&limit=20`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch results');

      const data = await response.json();
      setResults(data.results);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
      setError(null);
    } catch (error) {
      setError(error.message);
      setResults([]);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    handleSearch(page);
  };

  return (
    <>
      <div className="container mt-4" id="Search-box">
        <h2 className="headingsaa">Search</h2>

        <div className="input-group mb-3" id="input-box">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name"
            value={query}
            id="input-content"
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="input-group-text" onClick={() => handleSearch(1)} style={{ cursor: 'pointer' }}>
            <img src={Search} alt="Search Icon" style={{ width: '20px', height: '20px' }} />
          </span>
        </div>

        <div className="mb-3">
          <div className="d-flex flex-wrap">
            {categories.map((category) => (
              <button
                id="button-search"
                key={category}
                className={`btn me-2 mb-1 mt-1 ${selectedCategory === category ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-danger">Error: {error}</p>}
      </div>

      {/* Search Results Section (Outside of the main container) */}
      <div className="search-results mt-4">
        <h3 className='dude'>Results</h3>
        {results.length > 0 ? (
          <div className="meal-cards-container">
            {results.map((recipe) => (
              <MealCards key={recipe._id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <p>No results found</p>
        )}

        {/* Pagination Controls */}
        <div className="pagination-controls">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn btn-outline-primary"
            id="tired"
          >
            Previous
          </button>
          <span className="mx-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn btn-outline-primary"
            id="tired"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default SearchPage;
