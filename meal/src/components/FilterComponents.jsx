import React from 'react';
import '../styles/FilterComponents.css'; // Import your custom styles

const FilterComponents = ({ placeholder, filterValue, onFilterChange }) => {
  return (
    <div className="filter-container text-center mb-4">
      <input
        type="text"
        placeholder={placeholder}
        value={filterValue}
        onChange={onFilterChange}
        className="filter-input"
      />
    </div>
  );
}

export default FilterComponents;
