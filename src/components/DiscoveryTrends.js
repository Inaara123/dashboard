import React,{ useState, useEffect } from 'react';
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
import { supabase } from '../supabaseClient';
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
// const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
// const googleData = [10, 15, 12, 8, 20, 18, 25];
// const instagramData = [5, 10, 7, 12, 15, 10, 8];
// const facebookData = [7, 8, 5, 10, 9, 12, 15];
// const friendsFamilyData = [12, 18, 10, 14, 17, 20, 22];
// const othersData = [2, 5, 3, 4, 6, 7, 10];

// // Chart data configuration
// const data = {
//   labels: days,
//   datasets: [
//     {
//       label: 'Google',
//       data: googleData,
//       borderColor: 'rgba(0, 0, 255, 1)', // Blue
//       backgroundColor: 'rgba(0, 123, 255, 0.2)',
//       fill: true,
//     },
//     {
//       label: 'Instagram',
//       data: instagramData,
//       borderColor: 'rgba(225, 48, 108, 1)', // Instagram Pink
//       backgroundColor: 'rgba(225, 48, 108, 0.2)',
//       fill: true,
//     },
//     {
//       label: 'Facebook',
//       data: facebookData,
//       borderColor: 'rgba(128, 0, 128, 1)', // Facebook Blue
//       backgroundColor: 'rgba(59, 89, 152, 0.2)',
//       fill: true,
//     },
//     {
//       label: 'Friends & Family',
//       data: friendsFamilyData,
//       borderColor: 'rgba(0, 255, 0, 1)', // Aqua Green
//       backgroundColor: 'rgba(75, 192, 192, 0.2)',
//       fill: true,
//     },
//     {
//       label: 'Others',
//       data: othersData,
//       borderColor: 'rgba(255, 159, 64, 1)', // Orange
//       backgroundColor: 'rgba(255, 159, 64, 0.2)',
//       fill: true,
//     },
//   ],
// };

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

const TrendsWidget = ({timeRange,selectedDoctorId,hospitalId}) => {
  const [data, setData] = useState({
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: []
  });
  console.log('trendsWidget',timeRange);
  useEffect(() => {
    const fetchData = async () => {
    let timeComponent = timeRange.type;
    let customStartDate = null;
    let customEndDate = null;

    if (timeRange.type === 'Custom') {
      timeComponent = 'custom';
      customStartDate = timeRange.startDate;
      customEndDate = timeRange.endDate;
    } else if (timeRange.type === '1 Day') {
      timeComponent = 'single_day';
    } else if (timeRange.type === '1 Week') {
      timeComponent = '1_week';
    } else if (timeRange.type === '1 Month') {
      timeComponent = '1_month';
    } else if (timeRange.type === '3 Months') {
      timeComponent = '3_months';
    }
      try {
        // Fetch data from Supabase
        const { data: queryData, error } = await supabase
          .rpc('patient_discovery_count_dynamic', {
            p_group_by: 'how_did_you_get_to_know_us',
            p_secondary_group_by: 'day_of_week',
            p_time_range:timeComponent, 
            p_start_date: timeComponent === 'custom' ? customStartDate : null,
            p_end_date: timeComponent === 'custom' ? customEndDate : null,
            p_hospital_id:hospitalId,
            p_doctor_id:selectedDoctorId
          });

        if (error) throw error;

        // Initialize dataset arrays
        const googleData = Array(7).fill(0);
        const instagramData = Array(7).fill(0);
        const facebookData = Array(7).fill(0);
        const friendsFamilyData = Array(7).fill(0);
        const othersData = Array(7).fill(0);

        // Map query results to arrays
        queryData.forEach(row => {
          const dayIndex = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
            .indexOf(row.secondary_group_value.trim());
          
          if (dayIndex !== -1) {
            switch (row.group_value) {
              case 'Google':
                googleData[dayIndex] = row.count;
                break;
              case 'Instagram':
                instagramData[dayIndex] = row.count;
                break;
              case 'Facebook':
                facebookData[dayIndex] = row.count;
                break;
              case 'Friends and Family':
                friendsFamilyData[dayIndex] = row.count;
                break;
              case 'Other':
                othersData[dayIndex] = row.count;
                break;
              default:
                break;
            }
          }
        });
        setData({
          labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
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
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [timeRange,selectedDoctorId,hospitalId]);
  return (
    <WidgetContainer>
      <h3 style={{ color: '#ffffff' }}>Weekly Trends: Discovery Channels</h3>
      <Line data={data} options={options} />
    </WidgetContainer>
  );
};

export default TrendsWidget;
