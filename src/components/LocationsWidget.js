import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Switch from 'react-switch';
import { supabase } from '../supabaseClient';

// Styled components for the widget
const WidgetContainer = styled.div`
  background-color: #2c2f33;
  padding: 20px;
  border-radius: 15px;
  color: #fff;
  width: 300px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const WidgetTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LocationList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const LocationItem = styled.li`
  margin-bottom: 10px;
`;

const LocationName = styled.span`
  font-size: 16px;
  display: block;
  margin-bottom: 5px;
`;

const BarContainer = styled.div`
  background-color: #3b3f45;
  border-radius: 5px;
  height: 10px;
  position: relative;
`;

const Bar = styled.div`
  background-color: #ff7f50; /* Coral color for the bar */
  height: 100%;
  border-radius: 5px;
  width: ${({ percentage }) => percentage}%;
  position: absolute;
`;

const LocationCount = styled.span`
  font-size: 14px;
  margin-left: 5px;
  color: #a5a5a5;
`;

async function fetchTopLocations(timeRange, customStartDate, customEndDate) {
    // const hospitalId = '4rGAVPwMavcn6ZXQJSqynPoJKyE3'; // Replace with your hospital ID
    // const dateRange = '6_months'; // or 'single_day', '1_week', '1_month', '3_months', 'custom'
    // const doctorId = '0c99dde8-1414-4867-9395-26ffe3355f3f';  // Use null or omit if not filtering by doctor
    // const customStartDate = null;  // Set to specific date if using 'custom'
    // const customEndDate = null;
////////////////////////////////////////////////
    const hospitalId = '4rGAVPwMavcn6ZXQJSqynPoJKyE3';
    const doctorId = '0c99dde8-1414-4867-9395-26ffe3355f3f';
  
    // Apply conditional logic to modify timeRange
    if (timeRange && timeRange !== 'custom') {
      if (timeRange === '1 Day') {
        timeRange = 'single_day';
      } else if (timeRange === '1 Week') {
        timeRange = '1_week';
      } else if (timeRange === '1 Month') {
        timeRange = '1_month';
      } else if (timeRange === '3 Months') {
        timeRange = '3_months';
      }
    }

////////////////////////////////////////////////
    const { data, error } = await supabase
    .rpc('get_top_addresses', {
        p_hospital_id: hospitalId,
        p_doctor_id: doctorId || null,  // Use null if doctorId is not provided
        p_date_range: timeRange,
        p_custom_start_date: customStartDate || null,
        p_custom_end_date: customEndDate || null,
    });
  if (error) {
    console.log('The error while trying to fetch locations is: ', error);
    return [];
  }
  else{
    console.log('The data while trying to fetch locations is: ', data);
  }
  return data;
}

// Normalize the location name by removing spaces and converting to lowercase
const normalizeLocationName = (name) => {
  return name
    .toLowerCase()      // Convert to lowercase
    .replace(/\s+/g, '') // Remove all spaces
    .trim();            // Trim any surrounding whitespace
};

// Capitalize the first letter of a string
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Group locations with normalized names and remove spaces
const groupLocations = (locations) => {
  const locationMap = new Map();

  locations.forEach(({ address, count }) => {
    const normalizedAddress = normalizeLocationName(address);

    if (locationMap.has(normalizedAddress)) {
      locationMap.set(normalizedAddress, locationMap.get(normalizedAddress) + count);
    } else {
      locationMap.set(normalizedAddress, count);
    }
  });

  // Convert map back to array and sort by count in descending order
  return Array.from(locationMap, ([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count); // Sort by count in descending order
};

const LocationsWidget = ({timeRange}) => {
  const [locations, setLocations] = useState([]);
  const [showPercentage, setShowPercentage] = useState(true);

  useEffect(() => {
    async function getLocations() {
        let timeComponent = timeRange.type;
        let customStartDate = null;
        let customEndDate = null;
  
        if (timeRange.type === 'Custom') {
          timeComponent = 'custom';
          customStartDate = timeRange.startDate;
          customEndDate = timeRange.endDate;
        }
  
      const data = await fetchTopLocations(timeComponent, customStartDate, customEndDate);
      const groupedLocations = groupLocations(data);
      setLocations(groupedLocations);
    }
    getLocations();
  }, [timeRange]);

  // Calculate the total and maximum count for scaling the bars
  const total = locations.reduce((sum, location) => sum + location.count, 0);
  const maxCount = Math.max(...locations.map(location => location.count));

  return (
    <WidgetContainer>
      <WidgetTitle>
        Location
        <div>
          <span style={{ fontSize: '14px', color: '#ffffff' }}>
            {showPercentage ? 'Show Actual' : 'Show %'}
          </span>
          <Switch
            onChange={() => setShowPercentage(!showPercentage)}
            checked={showPercentage}
            offColor="#888"
            onColor="#66ff66"
            uncheckedIcon={false}
            checkedIcon={false}
          />
        </div>
      </WidgetTitle>
      <p>You've had your hospital visits from...</p>
      <LocationList>
        {locations.map((location, index) => {
          const percentage = ((location.count / total) * 100).toFixed(2);
          const displayValue = showPercentage ? `${percentage}%` : location.count;

          return (
            <LocationItem key={index}>
              <LocationName>{capitalizeFirstLetter(location.name)}</LocationName>
              <BarContainer>
                <Bar percentage={showPercentage ? percentage : (location.count / maxCount) * 100} />
              </BarContainer>
              <LocationCount>{displayValue}</LocationCount>
            </LocationItem>
          );
        })}
      </LocationList>
    </WidgetContainer>
  );
};

export default LocationsWidget;
