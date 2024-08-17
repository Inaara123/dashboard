// src/components/Header.js
import React from 'react';

const Header = () => {
  return (
    <div className="header">
      <input type="text" placeholder="Search for stats..." />
      <div className="filters">
        <button>Filters</button>
      </div>
    </div>
  );
};

export default Header;
