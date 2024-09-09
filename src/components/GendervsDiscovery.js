import React, { useState } from 'react';
import styled from 'styled-components';
import { HeatMapGrid } from 'react-grid-heatmap';
import Switch from 'react-switch';

const WidgetContainer = styled.div`
  background-color: #1e1e1e;
  padding: 20px;
  border-radius: 15px;
  color: #fff;
  width: 80%;
  margin-left: 75px;
  height: auto;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;
const YLabelContainer = styled.div`
  display: flex;
  align-items: center;
  padding-right: 10px; // This creates the gap
  justify-content: flex-end;
  width: 100px; // Adjust this width as needed
`;
const WidgetTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const HeatmapContainer = styled.div`
  width: 100%;
  height: auto;
`;

const GenderVsDiscovery = () => {
  const [showPercentage, setShowPercentage] = useState(true);

  // Dummy data: Simulating 50 patients across different locations and discovery channels
  const dummyData = [
    [300, 5, 3, 7, 5],  // Location 1 (10 from Google, 5 from Facebook, etc.)
    [8, 7, 254, 324, 4],   // Location 2
       // Location 5
  ];

  // Calculate the total number of patients
  const totalPatients = dummyData.flat().reduce((sum, value) => sum + value, 0);
  console.log('Total Patients:', totalPatients);  

  // Convert data to percentages if required, but always use raw data for alpha calculation
  const heatmapData = dummyData.map((row) =>
    row.map((value) => showPercentage ? ((value / totalPatients) * 100).toFixed(2) : value)
  );

  const locations = ['Male', 'Female'];
  const discoveryChannels = ['Google', 'Facebook', 'Instagram', 'Friends & Family', 'Others'];

  // Calculate the maximum value for alpha scaling based on raw data only
  const maxValue = Math.max(...dummyData.flat());

  return (
    <WidgetContainer>
      <WidgetTitle>
        Gender vs Discovery
        <Switch
          onChange={() => setShowPercentage(!showPercentage)}
          checked={showPercentage}
          offColor="#888"
          onColor="#66ff66"
          uncheckedIcon={false}
          checkedIcon={false}
        />
      </WidgetTitle>
      <HeatmapContainer>
        <HeatMapGrid
          data={heatmapData}
          xLabels={discoveryChannels}
          yLabels={locations}
          cellRender={(x, y, value) => (
            <div title={`Location: ${locations[y]}, Channel: ${discoveryChannels[x]} = ${value}`}>
              {value}{showPercentage ? '%' : ''}
            </div>
          )}
          xLabelsStyle={() => ({
            color: '#ffffff',
            fontSize: '1rem',
          })}
          yLabelsStyle={() => ({
            fontSize: '1rem',
            color: '#ffffff',
            marginRight: '15px',  
          })}
          cellStyle={(x, y) => {
            const rawValue = dummyData[x][y]; // Always use raw data for alpha calculation
            const alpha = rawValue / maxValue; // Calculate alpha based on the maximum raw value
            console.log(`Cell [${x}, ${y}] - Raw Value: ${rawValue}, Alpha: ${alpha}`);
            return {
              background: `rgba(128, 0, 128, ${Math.min(Math.max(alpha, 0.1), 1)})`, // #007bff with alpha
              fontSize: '0.9rem',
              color: 'white',
              border: '1px solid #ffffff',
            };
          }}
          cellHeight="5.5rem"
          xLabelsPos="top"
          yLabelsPos="left"
          yLabelsRender={(label) => (
            <YLabelContainer>
              {label}
            </YLabelContainer>
          )}
          square
        />
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <span style={{ color: '#a5a5a5' }}>
            {showPercentage ? 'Showing Percentages' : 'Showing Actual Values'}
          </span>
        </div>
      </HeatmapContainer>
    </WidgetContainer>
  );
};

export default GenderVsDiscovery;