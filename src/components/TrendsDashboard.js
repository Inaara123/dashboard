import React from 'react';
import styled from 'styled-components';
import DiscoveryTrendsWidget from './DiscoveryTrends';
const WidgetContainer = styled.div`
  background-color: #1e1e1e;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const WidgetTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 12px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;  
`;

const TrendsDashboard = ({timeRange,selectedDoctorId,hospitalId}) => {
  
  return (
    <WidgetContainer>
      <WidgetTitle>Trends Dashboard</WidgetTitle>
      <DiscoveryTrendsWidget timeRange={timeRange} hospitalId = {hospitalId} selectedDoctorId= {selectedDoctorId}/>
      {/* Add more content for the widget here */}
    </WidgetContainer>
  );
};

export default TrendsDashboard  ;