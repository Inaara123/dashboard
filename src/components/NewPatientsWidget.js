import React, { useState,useEffect } from 'react';
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
import {supabase} from '../supabaseClient';
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
`;

const WidgetTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

async function fetchNewPatientsData(timeRange, customStartDate, customEndDate) {
    const hospitalId = '4rGAVPwMavcn6ZXQJSqynPoJKyE3';
    const doctorId = '0c99dde8-1414-4867-9395-26ffe3355f3f';
  
    // Apply conditional logic to modify timeRange
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

    const { data, error } = await supabase.rpc('get_patient_growth_stats', {
      p_hospital_id: hospitalId,
      p_doctor_id: doctorId,
      p_date_range: timeRange,
      p_custom_start_date: customStartDate,
      p_custom_end_date: customEndDate,
    });

    if (error) {
      console.error('Error fetching patient growth stats:', error);
    } else if (data && data.length > 0) {
      return data;
      //console.log(data[0].old_patients);
    }
  };

const NewPatientsWidget = ({ width=200, height=100,timeRange }) => {
  const [showPercentage, setShowPercentage] = useState(true);
  const [patientData, setPatientData] = useState({ new: 0, old: 0 });

  useEffect(() => {

    async function fetchPatientGrowthStats() {
          let timeComponent = timeRange.type;
          let customStartDate = null;
          let customEndDate = null;
    
          if (timeRange.type === 'Custom') {
            timeComponent = 'custom';
            customStartDate = timeRange.startDate;
            customEndDate = timeRange.endDate;
          }
    
          const data = await fetchNewPatientsData(timeComponent, customStartDate, customEndDate);
          if (data && data.length > 0) {
          setPatientData({
            new: data[0].new_patients,  // Replace with actual field name
            old: data[0].old_patients,  // Replace with actual field name
            
          }); }
        }
        fetchPatientGrowthStats();
      }, [timeRange]);

  // Calculate the total sum for percentage calculation
  const total = patientData.new + patientData.old;

  // Prepare data for the horizontal bar chart
  const data = {
    labels: ['New Patients', 'Old Patients'],
    datasets: [
      {
        label: showPercentage ? 'Percentage' : 'Number of Patients',
        data: showPercentage
          ? [
              ((patientData.new / total) * 100).toFixed(2),
              ((patientData.old / total) * 100).toFixed(2),
            ]
          : [patientData.new, patientData.old],
        backgroundColor: ['#8A2BE2', '#D2691E'], // Purple and chocolate colors
        borderRadius: 5,
        barThickness: 30,
      },
    ],
  };

  const options = {
    indexAxis: 'y', // This makes the bar chart horizontal
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
      <div style={{ height: height ? `calc(${height} - 70px)` : '300px' }}>
        <Bar data={data} options={options} />
      </div>
    </WidgetContainer>
  );
};

export default NewPatientsWidget;
