import React, { useState } from 'react';
import styled from 'styled-components';
import Switch from 'react-switch';

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

const AttendingModeWidget = ({ width, height }) => {
  const [showPercentage, setShowPercentage] = useState(true);

  const attendingData = {
    walkin: 120,
    appointment: 150,
    emergency: 30,
  };

  // Calculate the total sum for percentage calculation
  const total = attendingData.walkin + attendingData.appointment + attendingData.emergency;

  const data = [
    {
      name: 'Walk-in',
      value: showPercentage
        ? ((attendingData.walkin / total) * 100).toFixed(2) + '%'
        : attendingData.walkin,
    },
    {
      name: 'Appointment',
      value: showPercentage
        ? ((attendingData.appointment / total) * 100).toFixed(2) + '%'
        : attendingData.appointment,
    },
    {
      name: 'Emergency',
      value: showPercentage
        ? ((attendingData.emergency / total) * 100).toFixed(2) + '%'
        : attendingData.emergency,
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
