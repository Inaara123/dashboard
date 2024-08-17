import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import styled from 'styled-components';
import Switch from 'react-switch';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

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
`;

const WidgetTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AgeGroupWidget = () => {
  const [showPercentage, setShowPercentage] = useState(true);

  const ageGroups = [
    { range: '17-25 Years', count: 120 },
    { range: '26-35 Years', count: 150 },
    { range: '36-45 Years', count: 90 },
    { range: '46-55 Years', count: 60 },
    { range: '56+ Years', count: 30 },
  ];

  // Calculate the total sum for percentage calculation
  const total = ageGroups.reduce((sum, group) => sum + group.count, 0);

  // Prepare data for the bar chart
  const data = {
    labels: ageGroups.map(group => group.range),
    datasets: [
      {
        label: showPercentage ? 'Percentage' : 'Number of Patients',
        data: showPercentage
          ? ageGroups.map(group => ((group.count / total) * 100).toFixed(2))
          : ageGroups.map(group => group.count),
        backgroundColor: '#8A2BE2', // Purple color for bars
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
          callback: function (value) {
            return showPercentage ? `${value}%` : value;
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true, // Enable the default tooltip
        callbacks: {
          label: function (tooltipItem) {
            return showPercentage
              ? `${tooltipItem.raw}%`
              : tooltipItem.raw;
          },
        },
      },
      datalabels: {
        display: true,
        color: '#ffffff', // White color for the data labels
        anchor: 'end',
        align: 'start',
        offset: -10,
        formatter: (value) => {
          return showPercentage ? `${value}%` : value;
        },
      },
    },
  };

  return (
    <WidgetContainer>
      <WidgetTitle>
        Age Group
        <div>
          <span style={{ fontSize: '14px', color: '#ffffff' }}>
            {showPercentage ? 'Show Actual' : 'Show %'}
          </span>
          <Switch
            onChange={() => setShowPercentage(!showPercentage)}
            checked={showPercentage}
            offColor="#888"
            onColor="#8A2BE2" // Purple color for toggle
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

export default AgeGroupWidget;
