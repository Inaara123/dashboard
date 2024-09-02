import React, { useState,useEffect } from 'react';
import styled from 'styled-components';
import Switch from 'react-switch';
import { supabase } from '../supabaseClient';

// Styled components for the widget container
const WidgetContainer = styled.div`
  background-color: #2c2f33;
  padding: 20px;
  border-radius: 15px;
  color: #fff;
  width: ${({ width }) => width || '300px'}; /* Dynamic width */
  height: ${({ height }) => height || 'auto'}; /* Dynamic height */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const WidgetTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModeList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ModeItem = styled.li`
  font-size: 16px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModeName = styled.span`
  color: #ffffff;
`;

const ModeValue = styled.span`
  color: #ffffff;
  font-weight: bold;
`;
async function fetchModeData(timeRange, customStartDate, customEndDate) {
  const hospitalId = '4rGAVPwMavcn6ZXQJSqynPoJKyE3';
  const doctorId = '0c99dde8-1414-4867-9395-26ffe3355f3f';

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

  const { data, error } = await supabase.rpc('get_top_appointment_types', {
    p_hospital_id: hospitalId,
    p_doctor_id: doctorId || null,
    p_date_range: timeRange,
    p_custom_start_date: customStartDate || null,
    p_custom_end_date: customEndDate || null,
  });

  if (error) {
    console.log('Error fetching gender data:', error);
    return [];
  } else {
    console.log('Gender data fetched:', data);
    return (data || []);
  }
}

const AttendingModeWidget = ({ width = 250, height = 150, timeRange }) => {
  const [showPercentage, setShowPercentage] = useState(true);
  const [modeData, setmodeData] = useState([]);

  useEffect(() => {
    async function getmode() {
      let timeComponent = timeRange.type;
      let customStartDate = null;
      let customEndDate = null;

      if (timeRange.type === 'Custom') {
        timeComponent = 'custom';
        customStartDate = timeRange.startDate;
        customEndDate = timeRange.endDate;
      }
      const data = await fetchModeData(timeComponent, customStartDate, customEndDate);
        setmodeData(data);
        console.log(data);
      
    }
    getmode();
  }, [timeRange]);

  

  // Calculate the total sum for percentage calculation
  const total = modeData.reduce((sum, mode) => sum + mode.count, 0);

  const data = [
    {
      name: 'Walk-in',
      value: showPercentage
        ? ((modeData.Walkin / total) * 100).toFixed(2) + '%'
        : modeData.Walkin,
    },
    {
      name: 'Appointment',
      value: showPercentage
        ? ((modeData.Booking / total) * 100).toFixed(2) + '%'
        : modeData.Booking,
    },
    {
      name: 'Emergency',
      value: showPercentage
        ? ((modeData.emergency / total) * 100).toFixed(2) + '%'
        : modeData.emergency,
    },
  ];

  return (
    <WidgetContainer width={width} height={height}>
      <WidgetTitle>
        Attending Mode
        <div>
          <span style={{ fontSize: '14px', color: '#ffffff' }}>
            {showPercentage ? 'Show Actual' : 'Show %'}
          </span>
          <Switch
            onChange={() => setShowPercentage(!showPercentage)}
            checked={showPercentage}
            offColor="#888"
            onColor="#8A2BE2" // Purple color for toggle
            uncheckedIcon={false}
            checkedIcon={false}
          />
        </div>
      </WidgetTitle>
      <ModeList>
        {data.map((mode, index) => (
          <ModeItem key={index}>
            <ModeName>{mode.name}</ModeName>
            <ModeValue>{mode.value}</ModeValue>
          </ModeItem>
        ))}
      </ModeList>
    </WidgetContainer>
  );
};

export default AttendingModeWidget;
