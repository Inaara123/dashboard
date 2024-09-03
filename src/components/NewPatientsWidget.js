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
  width: ${({ width }) => width || '300px'}; /* Dynamic width */
  height: ${({ height }) => height || 'auto'}; /* Dynamic height */
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

const ChartContainer = styled.div`
  flex-grow: 1;
  width: 100%;
  height: 100%; /* Make the chart take up the full height */
`;

const NewPatientsWidget = ({ width, height }) => {
  const [showPercentage, setShowPercentage] = useState(true);

  const patientData = {
    new: 120,
    oldFreshConsultation: 80,
    oldFollowUp: 100,
  };

  // Calculate the total sum for percentage calculation
  const total = patientData.new + patientData.oldFreshConsultation + patientData.oldFollowUp;

  // Prepare data for the vertical bar chart
  const data = {
    labels: ['New Patients', 'Old Patients (Fresh Consultations)', 'Old Patients (Follow-ups)'],
    datasets: [
      {
        label: showPercentage ? 'Percentage' : 'Number of Patients',
        data: showPercentage
          ? [
              ((patientData.new / total) * 100).toFixed(2),
              ((patientData.oldFreshConsultation / total) * 100).toFixed(2),
              ((patientData.oldFollowUp / total) * 100).toFixed(2),
            ]
          : [patientData.new, patientData.oldFreshConsultation, patientData.oldFollowUp],
        backgroundColor: ['#FF0000', '#4285F4', '#E1306C'], // Using Discovery Widget color scheme: red, blue, pink
        borderRadius: 5,
        barThickness: 30,
      },
    ],
  };

  const options = {
    indexAxis: 'x', // This makes the bar chart vertical
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#ffffff', // X-axis label color
          beginAtZero: true,
          callback: function (value) {
            return showPercentage ? `${value}%` : value;
          },
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#ffffff', // Y-axis label color
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
        offset: 10,
        formatter: (value) => {
          return showPercentage ? `${value}%` : value;
        },
      },
    },
  };

  return (
    <WidgetContainer width={width} height={height}>
      <WidgetTitle>
        New vs Old Patients
        <div>
          <Switch
            onChange={() => setShowPercentage(!showPercentage)}
            checked={showPercentage}
            offColor="#888"
            onColor="#FF0000" // Red color for toggle, matching Discovery Widget
            uncheckedIcon={false}
            checkedIcon={false}
            height={20} /* Adjust the height of the toggle */
            width={40} /* Adjust the width of the toggle */
          />
        </div>
      </WidgetTitle>
      <ChartContainer>
        <Bar data={data} options={options} />
      </ChartContainer>
    </WidgetContainer>
  );
};

export default NewPatientsWidget;
