// src/components/Sidebar.js
import React from 'react';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">Logo</div>
      <nav>
        <ul>
          <li>Home</li>
          <li>Intelligence</li>
          <li>Settings</li>
        </ul>
      </nav>
      <div className="user-profile">
        <img src="path_to_image" alt="User" />
        <p>User Name</p>
      </div>
    </div>
  );
};

export default Sidebar;
