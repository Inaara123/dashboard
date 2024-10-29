import  { useState,useEffect} from 'react';
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
import {supabase} from '../supabaseClient'
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

const NewPatientsWidget = ({ width, height,timeRange,selectedDoctorId, hospitalId }) => {
  const [showPercentage, setShowPercentage] = useState(true);
  const [patientData, setPatientData] = useState({
    new: 0,
    old:0,
    oldFreshConsultation: 0,
    oldFollowUp: 0,
  });
  const [loading, setLoading] = useState(true); // Loading state for data fetching

  // Function to fetch patient growth stats from Supabase using the RPC function
  const fetchPatientGrowthStats = async () => {
    setLoading(true); // Start loading

    // Extract and transform timeRange values based on the original logic
    let timeComponent = timeRange.type;
    let customStartDate = null;
    let customEndDate = null;

    // Apply conditional logic to modify timeRange for fetching data
    if (timeRange.type === 'Custom') {
      timeComponent = 'custom';
      customStartDate = timeRange.startDate;
      customEndDate = timeRange.endDate;
    } else {
      if (timeComponent === '1 Day') {
        timeComponent = 'single_day';
      } else if (timeComponent === '1 Week') {
        timeComponent = '1_week';
      } else if (timeComponent === '1 Month') {
        timeComponent = '1_month';
      } else if (timeComponent === '3 Months') {
        timeComponent = '3_months';
      }
    }

    try {
      // Replace 'hospital_id' and '1_month' with your actual parameters
      const { data, error } = await supabase.rpc('get_patient_growth_stats', {
        p_hospital_id: hospitalId, // Use actual UUID
        p_date_range: timeComponent,
        p_doctor_id:selectedDoctorId,
        p_custom_start_date: null,
        p_custom_end_date: null,
      });
      console.log('the data for time perios is :',data);
      if (error) {
        console.error('Error fetching patient growth stats:', error.message);
        setLoading(false); // Stop loading in case of error
        return;
      }
  
      // Assuming the returned data contains the required fields
      setPatientData({
        new: data[0].new_patients || 0,
        old:data[0].old_patients||0,
        oldFreshConsultation: data[0].old_patients_with_fresh_consultation || 0,
        oldFollowUp: data[0].old_patients_with_follow_up || 0,
      });
      console.log("the new patient data is ",patientData);
      setLoading(false); // Stop loading after data is set
    } catch (err) {
      console.error('Fetch error:', err);
      setLoading(false); // Stop loading in case of error
    }
  };
  useEffect(() => {
    fetchPatientGrowthStats(); // Fetch data on component mount
  }, [timeRange,selectedDoctorId, hospitalId]);
  
  // const patientData = {
  //   new: 120,
  //   oldFreshConsultation: 80,
  //   oldFollowUp: 100,
  // };

  // Calculate the total sum for percentage calculation
  const total = patientData.new + patientData.old;

  // Prepare data for the vertical bar chart
  const data = {
    labels: ['New Patients', 'Old patients', 'Old Patients (Fresh Consultations)', 'Old Patients (Follow-ups)'],
    datasets: [
      {
        label: showPercentage ? 'Percentage' : 'Number of Patients',
        data: showPercentage
          ? [
              ((patientData.new / total) * 100).toFixed(2),
              ((patientData.old / total) * 100).toFixed(2),
              (patientData.oldFreshConsultation) ,
              (patientData.oldFollowUp) ,
            ]
          : [patientData.new,patientData.old, patientData.oldFreshConsultation, patientData.oldFollowUp],
        backgroundColor: ['#FF0000','#FFFF00', '#4285F4', '#E1306C'], // Using Discovery Widget color scheme: red, blue, pink
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
          callback: function (value, index) {
            const labels = ['New Patients', 'Old patients', 'Old Patients (Fresh Consultations)', 'Old Patients (Follow-ups)'];
            return showPercentage ? labels[index] : labels[index]; 
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
