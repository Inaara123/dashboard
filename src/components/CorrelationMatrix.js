import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Switch from 'react-switch';
import { supabase } from '../supabaseClient';
import { HeatMapGrid } from 'react-grid-heatmap'; // A suitable library for heatmap visualization

// Styled components for the widget
const MatrixContainer = styled.div`
  background-color: #2c2f33;
  padding: 20px;
  border-radius: 15px;
  color: #fff;
  width: 90%;
  height: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const WidgetTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MatrixGrid = styled.div`
  width: 100%;
  height: auto;
`;

const CorrelationMatrix = ({ timeRange }) => {
  const [data, setData] = useState([]);
  const [showPercentage, setShowPercentage] = useState(true);

  useEffect(() => {
    async function fetchCorrelationData() {
      const hospitalId = '4rGAVPwMavcn6ZXQJSqynPoJKyE3';
      const { data, error } = await supabase.rpc('get_correlation_data', {
        p_hospital_id: hospitalId,
        p_date_range: timeRange.type,
      });

      if (error) {
        console.error('Error fetching correlation data:', error);
      } else {
        setData(data);
      }
    }

    fetchCorrelationData();
  }, [timeRange]);

  const headers = ["Top 5 Locations", "Gender", "Age Group", "Discovery", "Gender"];
  
  const heatmapData = data.map((row) => row.map((value) => showPercentage ? (value * 100).toFixed(2) : value));

  return (
    <MatrixContainer>
      <WidgetTitle>
        Correlation Matrix
        <Switch
          onChange={() => setShowPercentage(!showPercentage)}
          checked={showPercentage}
          offColor="#888"
          onColor="#66ff66"
          uncheckedIcon={false}
          checkedIcon={false}
        />
      </WidgetTitle>
      <MatrixGrid>
        <HeatMapGrid
          data={heatmapData}
          xLabels={headers}
          yLabels={headers}
          cellHeight="40px"
          cellWidth="80px"
          background={(value) => `rgba(0, 0, 255, ${value / 100})`}
          cellStyle={(value, x, y) => ({
            fontSize: "12px",
            color: value > 50 ? "white" : "black",
          })}
        />
      </MatrixGrid>
    </MatrixContainer>
  );
};

export default CorrelationMatrix;
