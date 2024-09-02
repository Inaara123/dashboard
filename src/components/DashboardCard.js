import React, { useState } from 'react';
import styled from 'styled-components';
import VisitsWidget from './VisitsWidget';
import LocationsWidget from './LocationsWidget';
import GenderWidget from './GenderWidget';
import DiscoveryWidget from './DiscoveryWidget';
import ReasonWidget from './Reason';
import AgeGroupWidget from './AgeGroupWidget';
import NewPatientsWidget from './NewPatientsWidget';
import AttendingModeWidget from './AttendingMode';
import TimeMetricsWidget from './TimeMetricsWidget';
import Header from './TimePeriod';

// Styled component for the dashboard container
const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: #1e1e1e;
  padding-top: 60px; /* Space for the header */
  box-sizing: border-box;
`;

// Widget container with relative positioning
const WidgetContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

// Styled component for each widget
const WidgetArea = styled.div`
  position: absolute;
  top: ${({ y }) => y || '0%'};
  left: ${({ x }) => x || '0%'};
  width: ${({ width }) => width || '20%'};
  height: ${({ height }) => height || '20%'};
  background-color: #2c2f33;
  border-radius: 10px;
  padding: 10px;
  color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const DashboardCard = () => {
  const [timeRange, setTimeRange] = useState({
    type: '1 Day', // Default value
    startDate: '',
    endDate: ''
  });

  return (
    <DashboardContainer>
      <Header timeRange={timeRange} setTimeRange={setTimeRange} />
      <WidgetContainer>
        <WidgetArea x="2%" y="5%" width="12%" height="20%">
          <VisitsWidget width={200} height={100} timeRange={timeRange} />
        </WidgetArea>
        <WidgetArea x="20%" y="5%" width="24%" height="80%">
        <LocationsWidget timeRange={timeRange} />
        </WidgetArea>
        <WidgetArea x="2%" y="30%" width="15%" height="25%">
          <GenderWidget width={200} height={100} timeRange={timeRange}  />
        </WidgetArea>
         <WidgetArea x="47%" y="5%" width="25%" height="50%">
           <DiscoveryWidget width={200} height={100} timeRange={timeRange} />
         </WidgetArea>

        <WidgetArea x="47%" y="60%" width="25%" height="50%">
          <AgeGroupWidget width={200} height={100} timeRange={timeRange} />
        </WidgetArea>
        <WidgetArea x="75%" y="5%" width="20%" height="50%">
          <NewPatientsWidget width={200} height={100} timeRange={timeRange}/>
        </WidgetArea>
        {/*
        <WidgetArea x="5%" y="30%" width="20%" height="25%">
          <TimeMetricsWidget />
        </WidgetArea>

        <WidgetArea x="70%" y="30%" width="25%" height="25%">
          <ReasonWidget />
  </WidgetArea> */}
        <WidgetArea x="5%" y="85%" width="23%" height="35%">
          <AttendingModeWidget width={200} height={100} timeRange={timeRange} />
        </WidgetArea> 
      </WidgetContainer>
    </DashboardContainer>
  );
};

export default DashboardCard;
