import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import styled from 'styled-components';

// Register the required components with Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Styled component for the widget container
const WidgetContainer = styled.div`
  background-color: #1e1e1e;
  padding: 20px;
  border-radius: 15px;
  color: #fff;
  width: 90%;
  margin-left: 10px;
  height: auto;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

// Dummy data spanning over a week
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const googleData = [10, 15, 12, 8, 20, 18, 25];
const instagramData = [5, 10, 7, 12, 15, 10, 8];
const facebookData = [7, 8, 5, 10, 9, 12, 15];
const friendsFamilyData = [12, 18, 10, 14, 17, 20, 22];
const othersData = [2, 5, 3, 4, 6, 7, 10];

// Chart data configuration
const data = {
  labels: days,
  datasets: [
    {
      label: 'Google',
      data: googleData,
      borderColor: 'rgba(0, 0, 255, 1)', // Blue
      backgroundColor: 'rgba(0, 123, 255, 0.2)',
      fill: true,
    },
    {
      label: 'Instagram',
      data: instagramData,
      borderColor: 'rgba(225, 48, 108, 1)', // Instagram Pink
      backgroundColor: 'rgba(225, 48, 108, 0.2)',
      fill: true,
    },
    {
      label: 'Facebook',
      data: facebookData,
      borderColor: 'rgba(128, 0, 128, 1)', // Facebook Blue
      backgroundColor: 'rgba(59, 89, 152, 0.2)',
      fill: true,
    },
    {
      label: 'Friends & Family',
      data: friendsFamilyData,
      borderColor: 'rgba(0, 255, 0, 1)', // Aqua Green
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: true,
    },
    {
      label: 'Others',
      data: othersData,
      borderColor: 'rgba(255, 159, 64, 1)', // Orange
      backgroundColor: 'rgba(255, 159, 64, 0.2)',
      fill: true,
    },
  ],
};

// Chart options
const options = {
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Number of Patients',
      },
    },
    x: {
      title: {
        display: true,
        text: 'Days of the Week',
      },
    },
  },
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
    },
  },
};

const TrendsWidget = () => {
  return (
    <WidgetContainer>
      <h3 style={{ color: '#ffffff' }}>Weekly Trends: Discovery Channels</h3>
      <Line data={data} options={options} />
    </WidgetContainer>
  );
};

export default TrendsWidget;
