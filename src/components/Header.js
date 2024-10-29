// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';


const Header = () => {
  const [administratorName, setAdministratorName] = useState('Admin');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('administrator');
  const hospitalId = '4rGAVPwMavcn6ZXQJSqynPoJKyE3';

  // Function to fetch administrator name and doctors
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
  };

  return (
    <div className="header">
      <h2 className="header-title">Hi, {administratorName}</h2>
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
  );
};

export default Header;
