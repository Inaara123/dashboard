import React from 'react';
import Header from './components/Header';
import DashboardCard from './components/DashboardCard';
import SearchBar from './components/SearchBar';
import PatientMap from './components/MapComponent';
import { useState } from 'react';
import FilterInputs from './components/InputCorelation';
import Correlation from './components/Correlation';
import CorrelationDashboard from './components/CorrelationDashboard';

import './styles.css';  

const App = () => {
  const hospitalLocation = [17.494890627901075, 78.32833418198928]; // Example: Hospital location (latitude, longitude)
  const patientCoordinates = [
    [17.495032, 78.320560], // Patient 1
    [17.495032, 78.320560], // Patient 2
    [17.495032, 78.320560], // Patient 3
    // Add more patient coordinates here
  ];
  const [filteredData, setFilteredData] = useState({ });
  const handleFilterChange = (filters) => {
    // Here you will implement the logic to filter your data based on the filters
    // Example filtering logic:
    const data = {};  // Replace this with your actual data
    const results = data.filter((item) => {
      return filters.every((filter) => {
        // Implement filter condition based on item and filter
        return true;  // Replace with actual condition
      });
    });
    setFilteredData(results);
  }


  return (
    <div className="app-container">

      <div className="main-content">
        <Header />
        <div className="dashboard">
          <DashboardCard title="Hello Arjun" content="400 Today" />
          </div>

      
        

        

      </div>
      <div className='searchbar'>
        <SearchBar />
        </div>
        <div className='map'>
        <PatientMap hospitalLocation={hospitalLocation} patientCoordinates={patientCoordinates} />

          
          </div>
        <div>
          <CorrelationDashboard/>
        </div>
        <div className='corelation'>
        <Correlation/>
        </div>
    </div>
  );
};

export default App;
