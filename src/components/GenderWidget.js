import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Switch from 'react-switch';
import { supabase } from '../supabaseClient';

const WidgetContainer = styled.div`
  background-color: #2c2f33;
  padding: 10px;
  border-radius: 15px;
  color: #fff;
  width: ${({ width }) => width || '250px'};
  height: ${({ height }) => height || '150px'};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-rows: auto 1fr;
  box-sizing: border-box;
`;

const WidgetTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: ${({ height }) => `calc(${height} / 7)`};
`;

const TitleText = styled.h3`
  font-size: inherit;
`;

const StyledSwitch = styled(Switch)`
  transform: scale(${({ width, height }) => Math.min(width / 250, height / 150)});
`;

const GenderList = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-grow: 1;
`;

const GenderItem = styled.div`
  text-align: center;
  flex: 1;
  align-items: space-between;
`;

const GenderIcon = styled.div`
  font-size: ${({ height }) => `calc(${height} / 4)`};
  margin-bottom: 5px;
`;

const GenderName = styled.div`
  font-size: ${({ height }) => `calc(${height} / 7)`};
  margin-bottom: 5px;
`;

const GenderPercentage = styled.div`
  font-size: ${({ height }) => `calc(${height} / 7)`};
  color: ${({ color }) => color};
  font-weight: bold;
`;

async function fetchGenderData(timeRange, customStartDate, customEndDate,hospitalId,selectedDoctorId) {
    const hospital_Id = hospitalId;
    const doctorId = selectedDoctorId;
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
  
    console.log('Time Range inside fetchGenderData:', timeRange);
    console.log('Custom Start Date inside fetchGenderData:', customStartDate);
    console.log('Custom End Date inside fetchGenderData:', customEndDate);
  
    const { data, error } = await supabase.rpc('get_genders', {
      p_hospital_id: hospital_Id,
      p_doctor_id: doctorId ,
      p_date_range: timeRange,
      p_custom_start_date: customStartDate || null,
      p_custom_end_date: customEndDate || null,
    });
    
    if (error) {
      console.log('Error fetching gender data:', error);
      return [];
    } else {
      console.log('Gender data fetched:', data);
      return data;
    }
  }
  

const GenderWidget = ({ width = 250, height = 150, timeRange,hospitalId,selectedDoctorId }) => {
  const [showPercentage, setShowPercentage] = useState(true);
  const [genderData, setGenderData] = useState([]);

  useEffect(() => {
    async function getGender() {
      let timeComponent = timeRange.type;
      let customStartDate = null;
      let customEndDate = null;

      if (timeRange.type === 'Custom') {
        timeComponent = 'custom';
        customStartDate = timeRange.startDate;
        customEndDate = timeRange.endDate;
      }

      const data = await fetchGenderData(timeComponent, customStartDate, customEndDate,hospitalId,selectedDoctorId);
      
      if (data.length) {
        const gData = data.map((item) => ({
          name: item.gender,
          count: item.count,
          icon: item.gender === 'Female' ? '♀️' : '♂️',
          color: item.gender === 'Female' ? '#ff6b6b' : '#4dabf7',
        }));
       
        setGenderData(gData);
        
      }
      else {
        // If data is empty, set counts for both Male and Female to 0
        const gData = [
          {
            name: 'Female',
            count: 0,
            icon: '♀️',
            color: '#ff6b6b',
          },
          {
            name: 'Male',
            count: 0,
            icon: '♂️',
            color: '#4dabf7',
          },
        ];
      
        setGenderData(gData);
      }
     
    }

    getGender();
  }, [timeRange,hospitalId,selectedDoctorId]);

  const total = genderData.reduce((sum, gender) => sum + gender.count, 0);

  return (
    <WidgetContainer width={`${width}px`} height={`${height}px`}>
      <WidgetTitle height={height}>
        <TitleText>Gender</TitleText>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <StyledSwitch
            onChange={() => setShowPercentage(!showPercentage)}
            checked={showPercentage}
            offColor="#888"
            onColor="#66ff66"
            uncheckedIcon={false}
            checkedIcon={false}
            handleDiameter={20}
            height={45}
            width={75}
            activeBoxShadow="0 0 2px 3px #66ff66"
          />
        </div>
      </WidgetTitle>
      <GenderList>
        {genderData.map((gender, index) => {
          const percentage = ((gender.count / total) * 100).toFixed(2);
          const displayValue = showPercentage ? `${percentage}%` : gender.count;

          return (
            <GenderItem key={index}>
              <GenderIcon height={height}>{gender.icon}</GenderIcon>
              <GenderName height={height}>{gender.name}</GenderName>
              <GenderPercentage height={height} color={gender.color}>
                {displayValue}
              </GenderPercentage>
            </GenderItem>
          );
        })}
      </GenderList>
    </WidgetContainer>
  );
};

export default GenderWidget;
