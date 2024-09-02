import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Switch from 'react-switch';
import { supabase } from '../supabaseClient';

// Styled components for the widget
const WidgetContainer = styled.div`
  background-color: #2c2f33;
  padding: 20px;
  border-radius: 15px;
  color: #fff;
  width: 250px;
  height: 200px;
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

const colorMapping = {
  'Google': '#4285F4',
  'Facebook': '#1877F2',
  'Instagram': '#E1306C',
  'Friends & Family': '#ff0000',
  'Other': '#a5a5a5',
};

async function fetchDiscoveryData(timeRange, customStartDate, customEndDate) {
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

  const { data, error } = await supabase.rpc('get_top_how_did_you_get_to_know_us', {
    p_hospital_id: hospitalId,
    p_doctor_id: doctorId,
    p_date_range: timeRange,
    p_custom_start_date: customStartDate || null,
    p_custom_end_date: customEndDate || null,
  });

  if (error) {
    console.error('Error fetching discovery source data:', error);
    return [];
  } else {
    console.log('Discovery data fetched:', data);
    return data || [];
  }
}

const DiscoveryWidget = ({ timeRange }) => {
  const [showPercentage, setShowPercentage] = useState(true);
  const [discoverySources, setDiscoverySources] = useState([]);

  useEffect(() => {
    async function getDiscoveryData() {
      let timeComponent = timeRange.type;
      let customStartDate = null;
      let customEndDate = null;

      if (timeRange.type === 'Custom') {
        timeComponent = 'custom';
        customStartDate = timeRange.startDate;
        customEndDate = timeRange.endDate;
      }

      const data = await fetchDiscoveryData(timeComponent, customStartDate, customEndDate);
      setDiscoverySources(data);
      
    }

    getDiscoveryData();
  }, [timeRange]);

  const sources = ['Google', 'Facebook', 'Instagram', 'Friends and Family'].map(name => {
    const source = discoverySources.find(s => s.how_did_you_get_to_know_us === name);
    return {
      name,
      count: source ? source.count : 0,
      color: colorMapping[name] || colorMapping['Other'],
    };
  });

  const total = sources.reduce((sum, source) => sum + source.count, 0);

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
        {sources.map((source, index) => {
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
