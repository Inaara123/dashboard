import React, { useState } from 'react';
import styled from 'styled-components';
import LocationvsDiscovery from './LocationvsDiscovery';
import LocationsvsAge from './LocationsvsAge';
import DistancevsDiscovery from './DistancevsDiscovery';
import DiscoveryvsAge from './DiscoveryvsAge';
import GenderVsLocation from './GendervsLocation';
import GenderVsAge from './GendervsAge';
import GendervsDistance from './GendervsDistance';
import GendervsDiscovery from './GendervsDiscovery';
import Header from './TimePeriod';
// import GenderVsDiscovery from './GenderVsDiscovery';
// import AgeGroupVsDiscovery from './AgeGroupVsDiscovery';
// import AgeGroupVsLocations from './AgeGroupVsLocations';
// import AgeGroupVsGender from './AgeGroupVsGender';

// Styled component for the dashboard container
const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background-color: #1e1e1e;
  padding-top: 60px;
  box-sizing: border-box;
`;

const WidgetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 20px;
  width: 100%;
  padding: 20px;
`;

const GridItem = styled.div`
  grid-column: span 6;
`;

const Dashboard = ({timeRange,selectedDoctorId,hospitalId}) => {
  return (
    <DashboardContainer>
      <WidgetGrid>
        <GridItem><LocationvsDiscovery hospitalId = {hospitalId} selectedDoctorId= {selectedDoctorId} timeRange={timeRange} /></GridItem>
        <GridItem><LocationsvsAge hospitalId = {hospitalId} selectedDoctorId= {selectedDoctorId} timeRange={timeRange}  /></GridItem>
        <GridItem><DistancevsDiscovery hospitalId = {hospitalId} selectedDoctorId= {selectedDoctorId} timeRange={timeRange} /></GridItem>
        <GridItem><DiscoveryvsAge hospitalId = {hospitalId} selectedDoctorId= {selectedDoctorId} timeRange={timeRange} /></GridItem>
        <GridItem><GenderVsLocation hospitalId = {hospitalId} selectedDoctorId= {selectedDoctorId} timeRange={timeRange} /></GridItem>
        <GridItem><GenderVsAge hospitalId = {hospitalId} selectedDoctorId= {selectedDoctorId} timeRange={timeRange} /></GridItem>
        <GridItem><GendervsDistance hospitalId = {hospitalId} selectedDoctorId= {selectedDoctorId} timeRange={timeRange} /></GridItem>
        <GridItem><GendervsDiscovery  hospitalId = {hospitalId} selectedDoctorId= {selectedDoctorId} timeRange={timeRange} /></GridItem>
        {/* <GridItem><GenderVsDiscovery timeRange={timeRange} /></GridItem>
        <GridItem><AgeGroupVsDiscovery timeRange={timeRange} /></GridItem>
        <GridItem><AgeGroupVsGender timeRange={timeRange} /></GridItem> */}
      </WidgetGrid>
    </DashboardContainer>
  );
};

export default Dashboard;
