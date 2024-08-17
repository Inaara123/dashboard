import React from 'react';
import Header from './components/Header';
import DashboardCard from './components/DashboardCard';
import SearchBar from './components/SearchBar';
import PatientMap from './components/MapComponent';

import './styles.css';  

const App = () => {
  const hospitalLocation = [17.494890627901075, 78.32833418198928]; // Example: Hospital location (latitude, longitude)
  const patientCoordinates = [
    [17.495032, 78.320560], // Patient 1
    [17.495032, 78.320560], // Patient 2
    [17.495032, 78.320560], // Patient 3
    // Add more patient coordinates here
  ];
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
    </div>
  );
};

export default App;
