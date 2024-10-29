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
  width: 250px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const WidgetTitle = styled.h3`
  font-size: 25px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LocationList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: ${({ expanded }) => (expanded ? '400px' : '300px')}; /* Height adjustment */
  overflow-y: ${({ expanded }) => (expanded ? 'auto' : 'hidden')}; /* Scrollbar in expanded mode */
  overflow-x: hidden; /* Remove horizontal scrollbar */
`;

const LocationItem = styled.li`
  margin-bottom: 10px;
`;

const LocationName = styled.span`
  font-size: 16px;
  display: block;
  margin-bottom: 5px;
  white-space: nowrap; /* Prevent wrapping */
  overflow: hidden;
  text-overflow: ellipsis; /* Show ellipsis if text overflows */
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

const ShowMoreButton = styled.button`
  background: none;
  border: none;
  color: #66ff66;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
  padding: 0;
  text-decoration: underline;
`;

const PopUpContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PopUpContent = styled.div`
  background-color: #2c2f33;
  padding: 20px;
  border-radius: 15px;
  width: 80%;
  max-height: 80%;
  overflow-y: auto;
`;

const CustomSwitch = styled(Switch)`
  & .react-switch-bg {
    width: 10px; /* Make the toggle smaller */
    height: 15px;
  }
  & .react-switch-handle {
    width: 13px;
    height: 13px;
  }
`;

async function fetchTopLocations(timeRange, customStartDate, customEndDate,hospitalId,selectedDoctorId) {
    const hospital_Id = hospitalId;
    const doctorId = selectedDoctorId;

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

    const { data, error } = await supabase
    .rpc('get_top_addresses', {
        p_hospital_id: hospital_Id,
        p_doctor_id: doctorId || null, 
        p_date_range: timeRange,
        p_custom_start_date: customStartDate || null,
        p_custom_end_date: customEndDate || null,
    });
  
    if (error) {
      console.log('The error while trying to fetch locations is: ', error);
      return [];
    } else {
      console.log('The data while trying to fetch locations is: ', data);
    }
    return data;
}

const normalizeLocationName = (name) => {
  return name.toLowerCase().replace(/\s+/g, '').trim();
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

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

  return Array.from(locationMap, ([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count); 
};

const LocationsWidget = ({ timeRange,hospitalId,selectedDoctorId }) => {
  const [locations, setLocations] = useState([]);
  const [showPercentage, setShowPercentage] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [popUpVisible, setPopUpVisible] = useState(false);

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
  
      const data = await fetchTopLocations(timeComponent, customStartDate, customEndDate,hospitalId,selectedDoctorId);
      const groupedLocations = groupLocations(data);
      setLocations(groupedLocations);
    }
    getLocations();
  }, [timeRange,hospitalId,selectedDoctorId]);

  const displayedLocations = expanded ? locations : locations.slice(0, 7);

  const total = locations.reduce((sum, location) => sum + location.count, 0);
  const maxCount = Math.max(...locations.map(location => location.count));

  return (
    <WidgetContainer>
      <WidgetTitle>
        Location
        <CustomSwitch
          onChange={() => setShowPercentage(!showPercentage)}
          checked={showPercentage}
          offColor="#888"
          onColor="#66ff66"
          uncheckedIcon={false}
          checkedIcon={false}
        />
      </WidgetTitle>
      <p>You've had your hospital visits from...</p>
      <LocationList expanded={expanded}>
        {displayedLocations.map((location, index) => {
          const percentage = ((location.count / total) * 100).toFixed(2);
          const displayValue = showPercentage ? `${percentage}%` : location.count;

          const firstWords = location.name.split(',').map(word => word.split(' ')[0]).join(', '); // Show only first word

          return (
            <LocationItem key={index}>
              <LocationName>{capitalizeFirstLetter(firstWords)}</LocationName>
              <BarContainer>
                <Bar percentage={showPercentage ? percentage : (location.count / maxCount) * 100} />
              </BarContainer>
              <LocationCount>{displayValue}</LocationCount>
            </LocationItem>
          );
        })}
      </LocationList>
      {locations.length > 5 && (
        <ShowMoreButton onClick={() => setPopUpVisible(true)}>
          Show All
        </ShowMoreButton>
      )}
      {popUpVisible && (
        <PopUpContainer onClick={() => setPopUpVisible(false)}>
          <PopUpContent onClick={(e) => e.stopPropagation()}>
            <h2>All Locations</h2>
            <LocationList expanded={true}>
              {locations.map((location, index) => {
                const percentage = ((location.count / total) * 100).toFixed(2);
                const displayValue = showPercentage ? `${percentage}%` : location.count;

                const firstWords = location.name.split(',').map(word => word.split(' ')[0]).join(', '); // Show only first word

                return (
                  <LocationItem key={index}>
                    <LocationName>{capitalizeFirstLetter(firstWords)}</LocationName>
                    <BarContainer>
                      <Bar percentage={showPercentage ? percentage : (location.count / maxCount) * 100} />
                    </BarContainer>
                    <LocationCount>{displayValue}</LocationCount>
                  </LocationItem>
                );
              })}
            </LocationList>
            <ShowMoreButton onClick={() => setPopUpVisible(false)}>
              Show Less
            </ShowMoreButton>
          </PopUpContent>
        </PopUpContainer>
      )}
    </WidgetContainer>
  );
};

export default LocationsWidget;
