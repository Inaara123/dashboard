import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import styled from 'styled-components';
import Switch from 'react-switch';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register necessary chart components and plugins
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

// Styled components for the widget container
const WidgetContainer = styled.div`
  background-color: #2c2f33;
  padding: 20px;
  border-radius: 15px;
  color: #fff;
  width: 300px; /* Adjust width as needed */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const WidgetTitle = styled.div`
  font-size: 18px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SwitchLabel = styled.span`
  font-size: 14px;
  color: #ffffff;
`;

const ReasonWidget = () => {
  const [showPercentage, setShowPercentage] = useState(true);

  // Example actual numbers for each reason
  const reasonData = [
    { name: 'Acne', actual: 140 },
    { name: 'Hair', actual: 100 },
    { name: 'Eczema', actual: 120 },
    { name: 'Skin', actual: 80 },
    { name: 'Coloring', actual: 60 },
  ];

  // Calculate the total sum of all actual numbers
  const total = reasonData.reduce((sum, reason) => sum + reason.actual, 0);

  // Calculate the percentages based on the actual numbers
  const percentageData = reasonData.map(reason => ({
    ...reason,
    percentage: ((reason.actual / total) * 100).toFixed(2),
  }));

  const data = {
    labels: percentageData.map(reason => reason.name),
    datasets: [
      {
        label: showPercentage ? 'Percentage' : 'Actual Number',
        data: showPercentage
          ? percentageData.map(reason => Number(reason.percentage))
          : reasonData.map(reason => reason.actual),
        backgroundColor: '#66ff66', // Light green color for bars
        borderRadius: 5,
        barThickness: 20,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#ffffff', // X-axis label color
        },
      },
      y: {
        grid: {
          color: '#3b3f45', // Y-axis grid line color
        },
        ticks: {
          color: '#ffffff', // Y-axis label color
          beginAtZero: true,
          maxTicksLimit: 5,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false, // Disable the default tooltip
      },
      datalabels: {
        display: true,
        color: '#ffffff',
        anchor: 'end',
        align: 'top',
        formatter: (value) => {
          return showPercentage ? `${value}%` : value;
        },
      },
    },
  };

  return (
    <WidgetContainer>
      <WidgetTitle>
        <div>Reason</div>
        <div>
          <SwitchLabel>{showPercentage ? 'Show Actual' : 'Show %'}</SwitchLabel>
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
      <div style={{ height: '200px' }}>
        <Bar data={data} options={options} />
      </div>
    </WidgetContainer>
  );
};

export default ReasonWidget;
