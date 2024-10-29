import React, { useState, useEffect } from 'react';
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
import { supabase } from '../supabaseClient';

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

async function fetchAgeGroupData(timeRange, customStartDate, customEndDate,selectedDoctorId, hospitalId ) {
  const hospital_Id = hospitalId; // Replace with the actual hospital ID
  const doctorId = selectedDoctorId; // Replace with the actual doctor ID

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

  const { data, error } = await supabase.rpc('get_age_range_counts', {
    p_hospital_id: hospital_Id,
    p_doctor_id: doctorId,
    p_date_range: timeRange,
    p_custom_start_date: customStartDate,
    p_custom_end_date: customEndDate,
  });

  if (error) {
    console.error('Error fetching age group data:', error);
  } else {
    return data || [];
  }
}

const AgeGroupWidget = ({ timeRange,selectedDoctorId, hospitalId  }) => {
  const [showPercentage, setShowPercentage] = useState(true);
  const [ageGroups, setAgeGroups] = useState([]);

  useEffect(() => {
    async function fetchData() {
      let timeComponent = timeRange.type;
      let customStartDate = null;
      let customEndDate = null;

      if (timeRange.type === 'Custom') {
        timeComponent = 'custom';
        customStartDate = timeRange.startDate;
        customEndDate = timeRange.endDate;
      }

      const data = await fetchAgeGroupData(timeComponent, customStartDate, customEndDate,selectedDoctorId, hospitalId );
      setAgeGroups(data);
    }

    fetchData();
  }, [timeRange,selectedDoctorId, hospitalId]);

  const total = ageGroups.reduce((sum, group) => sum + group.count, 0);

  const data = {
    labels: ageGroups.map(group => group.age_range),
    datasets: [
      {
        label: showPercentage ? 'Percentage' : 'Number of Patients',
        data: showPercentage
          ? ageGroups.map(group => ((group.count / total) * 100).toFixed(2))
          : ageGroups.map(group => group.count),
        backgroundColor: '#8A2BE2',
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
          color: '#ffffff',
        },
      },
      y: {
        grid: {
          color: '#3b3f45',
        },
        ticks: {
          color: '#ffffff',
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
        enabled: true,
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
        color: '#ffffff',
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
            onColor="#8A2BE2"
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
