import React from 'react';
import styled from 'styled-components';

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
`;

const MetricList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MetricItem = styled.li`
  font-size: 16px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MetricName = styled.span`
  color: #ffffff;
`;

const MetricValue = styled.span`
  color: #ffffff;
  font-weight: bold;
`;

const Subheading = styled.div`
  font-size: 14px;
  color: ${({ isPositive }) => (isPositive ? '#4CAF50' : '#FF5722')}; /* Green for positive, Red for negative */
  margin-bottom: 10px;
`;

const TimeMetricsWidget = ({ width, height }) => {
  // Example values
  const averageWaitTime = 15; // minutes
  const averageConsultationTime = 30; // minutes

  // Comparison with yesterday's values
  const waitTimeDifference = 5; // Difference compared to yesterday (in minutes)
  const consultationTimeDifference = -3; // Difference compared to yesterday (in minutes)

  // Determine the color based on whether the difference is positive or negative
  const waitTimeIsPositive = waitTimeDifference < 0;
  const consultationTimeIsPositive = consultationTimeDifference < 0;

  return (
    <WidgetContainer width={width} height={height}>
      <WidgetTitle>Time Metrics</WidgetTitle>

      <MetricList>
        <MetricItem>
          <div>
            <MetricName>Average Wait Time</MetricName>
            <Subheading isPositive={waitTimeIsPositive}>
              {Math.abs(waitTimeDifference)} min {waitTimeDifference > 0 ? '↑' : '↓'} than yesterday
            </Subheading>
          </div>
          <MetricValue>{averageWaitTime} min</MetricValue>
        </MetricItem>

        <MetricItem>
          <div>
            <MetricName>Average Consultation Time</MetricName>
            <Subheading isPositive={consultationTimeIsPositive}>
              {Math.abs(consultationTimeDifference)} min {consultationTimeDifference > 0 ? '↑' : '↓'} than yesterday
            </Subheading>
          </div>
          <MetricValue>{averageConsultationTime} min</MetricValue>
        </MetricItem>
      </MetricList>
    </WidgetContainer>
  );
};

export default TimeMetricsWidget;
