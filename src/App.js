import React from 'react';
import Header from './components/Header';
import DashboardCard from './components/DashboardCard';
import SearchBar from './components/SearchBar';
import PatientMap from './components/MapComponent';
import { useState,useEffect } from 'react';
import FilterInputs from './components/InputCorelation';
import TrendsDashboard from './components/TrendsDashboard';
import Correlation from './components/Correlation';
import CorrelationDashboard from './components/CorrelationDashboard';
import { fetchPatientCoordinates } from './fetchPatientCoordinates';
import './styles.css';  
import TimePeriod from './components/TimePeriod';
import styled from 'styled-components';
import { supabase } from './supabaseClient';
const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background-color: #1e1e1e;
  padding-top: 60px;
  box-sizing: border-box;
`;
const App = () => {
  const hospitalLocation = [17.494890627901075, 78.32833418198928]; // Example: Hospital location (latitude, longitude)
  const [patientCoordinates, setPatientCoordinates] = useState([]);
  // const patientCoordinates = [
  //   [17.495032, 78.320560], // Patient 1
  //   [17.495032, 78.320560], // Patient 2
  //   [17.495032, 78.320560], // Patient 3
  //   // Add more patient coordinates here
  // ];
  const [timeRange, setTimeRange] = useState({
    type: '1 Month', // Default value
    startDate: '',
    endDate: ''
  });
  const [administratorName, setAdministratorName] = useState('Admin');
  const [doctors, setDoctors] = useState([]);
  const [hospitalId,setHospitalId] =useState('4rGAVPwMavcn6ZXQJSqynPoJKyE3');
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [dispname,setdispname]=useState('Admin');
  const [selectedDoctor, setSelectedDoctor] = useState('administrator');
  const fetchDoctorsData = async () => {
    const { data, error } = await supabase
      .rpc('get_administrator_and_doctors', { hospitals_id: hospitalId });

    if (error) {
      console.error('Error fetching data:', error);
      return;
    }

    // Assuming that all records have the same administrator name
    if (data && data.length > 0) {
      setAdministratorName(data[0].administrator_name);
      setdispname(data[0].administrator_name)
    }

    // Map doctors from the fetched data
    const fetchedDoctors = data.map((record) => ({
      id: record.doctor_id,
      name: record.doctor_name.trim(),
    }));

    setDoctors(fetchedDoctors);
  };
  
  useEffect(() => {
    fetchDoctorsData();
  }, []);

  const handleDoctorChange = (e) => {
    setSelectedDoctor(e.target.value);
    
    if (selectedDoctor === 'administrator') {
      // If "administrator" is selected, set selectedDoctorId to null
      setSelectedDoctorId(null);
      setdispname(administratorName);
    } else {
      setdispname(e.target.value);
      // Find the doctor from the list by matching the selected name
      const doctor = doctors.find((doc) => doc.name === selectedDoctor);
      // Set selectedDoctorId to the found doctor's id
      setSelectedDoctorId(doctor?.id || null);
      
    }
    console.log('doctor selected',selectedDoctor);
    console.log('the doctor_id',selectedDoctorId);
  };
 
  const [filteredData, setFilteredData] = useState({ });
  useEffect(() => {
    // Replace with your actual hospital ID

    const getPatientCoordinates = async () => {
      const coordinates = await fetchPatientCoordinates(hospitalId,selectedDoctorId,timeRange);
      
      // Map the data to lat/lng pairs if necessary
      
      const mappedCoordinates = coordinates.map((patient) => [patient.latitude, patient.longitude]);
      setPatientCoordinates(mappedCoordinates);
      
      console.log('mapped coordinates');
      console.log(patientCoordinates);
    };

    getPatientCoordinates(); // Call the function to fetch coordinates
  }, [timeRange]); // Empty dependency array ensures this runs once on component mount
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
      <div className="header">
      <h2 className="header-title">Hi, {dispname}</h2>
      <div className="dropdown">
        <select
          value={selectedDoctor}
          onChange={handleDoctorChange}
          className="dropdown-select"
        >
          <option value="administrator">{administratorName}</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.name}>
              {doctor.name}
            </option>
          ))}
        </select>
      </div>
    </div>
      <DashboardContainer>
      <TimePeriod timeRange={timeRange} setTimeRange={setTimeRange} />
      <div className="dashboard">
        
          <DashboardCard  hospitalId = {hospitalId} selectedDoctorId= {selectedDoctorId} timeRange={timeRange} title="Hello Arjun" content="400 Today" />
          </div>
      </DashboardContainer>
      
        
      </div>
      <div className='searchbar'>
        <SearchBar />
        </div>
        <div className='map'>
        <PatientMap hospitalLocation={hospitalLocation} patientCoordinates={patientCoordinates} hospitalId = {hospitalId} selectedDoctorId= {selectedDoctorId} timeRange={timeRange} />

          
          </div>
        <div>
          <CorrelationDashboard hospitalId = {hospitalId} selectedDoctorId= {selectedDoctorId} timeRange={timeRange}/>
        </div>
        <div>
          <TrendsDashboard hospitalId = {hospitalId} selectedDoctorId= {selectedDoctorId} timeRange={timeRange} />
        </div>
        <div className='corelation' >
        <Correlation hospitalId = {hospitalId} selectedDoctorId= {selectedDoctorId}/>
        </div>
    </div>
  );
};

export default App;
