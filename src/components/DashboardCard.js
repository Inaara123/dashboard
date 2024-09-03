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

// Styled component for the grid layout
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr); /* 12-column grid */
  grid-template-rows: repeat(6, auto); /* Customize row sizes */
  gap: 10px;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
`;

// Styled component for each widget
const GridItem = styled.div`
  grid-column: ${({ colStart, colEnd }) => `${colStart} / ${colEnd}`};
  grid-row: ${({ rowStart, rowEnd }) => `${rowStart} / ${rowEnd}`};
  padding: 10px; /* Ensure enough padding */
  box-sizing: border-box; /* Ensure padding and border are included in the grid item's size */
  overflow: visible; /* Allow the widget to fully display */
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
      <GridContainer>
        <GridItem colStart={1} colEnd={3} rowStart={1} rowEnd={3}>
          <VisitsWidget />
        </GridItem>
        <GridItem colStart={3} colEnd={7} rowStart={1} rowEnd={7}>
          <LocationsWidget timeRange={timeRange} />
        </GridItem>
        
        <GridItem colStart={1} colEnd={5} rowStart={3} rowEnd={25}>
          <GenderWidget width={200} height={200} timeRange={timeRange} />
        </GridItem>
        
        <GridItem colStart={6} colEnd={9} rowStart={1} rowEnd={5}>
          <DiscoveryWidget width={150} height={200} />
        </GridItem>
        <GridItem colStart={6} colEnd={9} rowStart={5} rowEnd={9}>
          <AgeGroupWidget />
        </GridItem>
        
        <GridItem colStart={9} colEnd={13} rowStart={1} rowEnd={7}>
          <NewPatientsWidget width={100} height={150}/>
        </GridItem> 
      </GridContainer>
    </DashboardContainer>
  );
};

export default DashboardCard;
