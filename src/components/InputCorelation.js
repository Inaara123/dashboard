import React, { useState } from 'react';

const FilterInputs = ({ onFilterChange,onSearch }) => {
  // Available filter fields
  const filterOptions = [
    { label: 'Location', value: 'location' },
    { label: 'Age', value: 'age' },
    { label: 'Gender', value: 'gender' },
    { label: 'Distance Traveled', value: 'distance' },
    { label: 'Discovery Channel', value: 'discoveryChannel' },
    { label: 'Day of the Week', value: 'dayOfWeek' },
    { label: 'Weekday/Weekend', value: 'weekdayWeekend' },
    { label: 'Type (Walkin/Appointment/Emergency)', value: 'type' },
  ];

  // State to hold the current filters
  const [filters, setFilters] = useState([]);

  // Add a new filter
  const addFilter = () => {
    setFilters([...filters, { field: '', value: '' }]);
  };

  // Remove an existing filter
  const removeFilter = (index) => {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(newFilters);
    onFilterChange(newFilters);  // Update the parent with new filters
  };

  // Handle filter change
  const handleFilterChange = (index, field, value) => {
    const newFilters = [...filters];
    newFilters[index] = { field, value };
    setFilters(newFilters);
    onFilterChange(newFilters);  // Update the parent with new filters
  };

    // Handle search button click
    const handleSearch = () => {
        onSearch(filters);  // Trigger the search action with the current filters
      };

  return (
    <div>
      <button onClick={addFilter}>Add Filter</button>
      {filters.map((filter, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
          <select
            value={filter.field}
            onChange={(e) => handleFilterChange(index, e.target.value, filter.value)}
          >
            <option value="">Select Field</option>
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Enter value"
            value={filter.value}
            onChange={(e) => handleFilterChange(index, filter.field, e.target.value)}
            style={{ marginLeft: '10px' }}
          />

          <button onClick={() => removeFilter(index)} style={{ marginLeft: '10px' }}>
            Remove
          </button>
        </div>
      ))}
        <button 
        onClick={handleSearch} 
        style={{ 
          marginTop: '20px', 
          padding: '10px 20px', 
          backgroundColor: '#007bff', 
          color: '#fff', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Search
      </button>
    </div>
  );
};

export default FilterInputs;
