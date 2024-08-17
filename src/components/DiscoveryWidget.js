import React, { useState } from 'react';
import styled from 'styled-components';
import Switch from 'react-switch';

// Styled components for the widget
const WidgetContainer = styled.div`
  background-color: #2c2f33;
  padding: 20px;
  border-radius: 15px;
  color: #fff;
  width: 250px;
  height : 200px; /* Adjust width as needed */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const WidgetTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SourceList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SourceItem = styled.li`
  margin-bottom: 20px;
`;

const SourceName = styled.div`
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const ProgressBarContainer = styled.div`
  background-color: #3b3f45;
  border-radius: 5px;
  height: 10px;
  position: relative;
`;

const ProgressBar = styled.div`
  background-color: ${({ color }) => color};
  height: 100%;
  border-radius: 5px;
  width: ${({ percentage }) => percentage}%;
`;

const PercentageText = styled.span`
  font-size: 14px;
  color: #a5a5a5;
`;

const DiscoveryWidget = () => {
  const [showPercentage, setShowPercentage] = useState(true);

  const discoverySources = [
    { name: 'Friends & Family', count: 200, color: '#ff0000' },  // YouTube red
    { name: 'Google', count: 140, color: '#4285F4' },   // Google blue
    { name: 'Instagram', count: 100, color: '#E1306C' }, // Instagram pink
    { name: 'Facebook', count: 60, color: '#1877F2' },  // Facebook blue
  ];

  // Calculate the total sum for percentage calculation
  const total = discoverySources.reduce((sum, source) => sum + source.count, 0);

  return (
    <WidgetContainer>
      <WidgetTitle>
        Discovery
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
      <SourceList>
        {discoverySources.map((source, index) => {
          const percentage = ((source.count / total) * 100).toFixed(2);
          const displayValue = showPercentage ? `${percentage}%` : source.count;

          return (
            <SourceItem key={index}>
              <SourceName>
                {source.name}
                <PercentageText>{displayValue}</PercentageText>
              </SourceName>
              <ProgressBarContainer>
                <ProgressBar
                  percentage={showPercentage ? percentage : (source.count / total) * 100}
                  color={source.color}
                />
              </ProgressBarContainer>
            </SourceItem>
          );
        })}
      </SourceList>
    </WidgetContainer>
  );
};

export default DiscoveryWidget;
