import React, { useState , useEffect} from 'react';
import styled from 'styled-components';
import { HeatMapGrid } from 'react-grid-heatmap';
import Switch from 'react-switch';
import { supabase } from '../supabaseClient';

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
const YLabelContainer = styled.div`
  display: flex;
  align-items: center;
  
  line-height: 1.2;
  text-align: right;
  width: 100px; // Adjust this width as needed
`;
const WidgetTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const HeatmapContainer = styled.div`
  width: 100%;
  height: auto;
`;

const DiscoveryVsAge = ({timeRange,selectedDoctorId,hospitalId}) => {
  const [showPercentage, setShowPercentage] = useState(true);
  const [heatmapData, setHeatmapData] = useState([]);
  const [totalPatients, setTotalPatients] = useState(0);
  // Dummy data: Simulating 50 patients across different locations and discovery channels
  const dummyData = [
    [300, 5, 3, 7, 5,4],  // Location 1 (10 from Google, 5 from Facebook, etc.)
    [8, 7, 254, 9, 4,14],   // Location 2
    [6, 234, 9, 4, 3,23],   // Location 3
    [12, 64, 2, 3, 385,72],  // Location 4
    [4, 2, 5, 7, 6,57]   // Location 5
  ];

  // // Calculate the total number of patients
  // const totalPatients = dummyData.flat().reduce((sum, value) => sum + value, 0);
  // console.log('Total Patients:', totalPatients);  

  // // Convert data to percentages if required, but always use raw data for alpha calculation
  // const heatmapData = dummyData.map((row) =>
  //   row.map((value) => showPercentage ? ((value / totalPatients) * 100).toFixed(2) : value)
  // );

  const locations = ['Google', 'Instagram', 'Facebook', 'Friends and Family', 'Other'];
  const discoveryChannels = ['<20', '20-25', '25-30', '30-35', '35-40','>40'];
  console.log('location vs discoveryChannels');
  const fetchPatientDiscoveryData = async () => {
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
      const { data, error } = await supabase.rpc('patient_discovery_count_dynamic', {
        p_group_by: 'how_did_you_get_to_know_us',
        p_secondary_group_by: 'age', // Refers to the age range calculation
        p_time_range:timeComponent, 
        p_start_date: timeComponent === 'custom' ? customStartDate : null,
        p_end_date: timeComponent === 'custom' ? customEndDate : null,
        p_hospital_id:hospitalId,
        p_doctor_id:selectedDoctorId
      });// Call RPC function
      if (error) {
        throw error;
      }
      console.log(data);
      const matrix = Array(locations.length).fill(0).map(() => Array(discoveryChannels.length).fill(0));

      let totalCount = 0;
      data.forEach((item) => {
        const locationIndex = locations.indexOf(item.group_value); // Find index of the discovery source
        const ageRangeIndex = discoveryChannels.indexOf(item.secondary_group_value); // Find index of the age range
        if (locationIndex !== -1 && ageRangeIndex !== -1) {
          matrix[locationIndex][ageRangeIndex] = item.count; // Populate the matrix with the count
          totalCount += item.count;
        }
      });
      setHeatmapData(matrix);
      setTotalPatients(totalCount);
      console.log('The data is ',heatmapData);
    } catch (error) {
      console.error('Error fetching patient discovery data:', error);
    }
  };
  useEffect(() => {
    fetchPatientDiscoveryData();
  }, [timeRange,selectedDoctorId,hospitalId]);

  const formattedData = heatmapData.map((row) =>
    row.map((value) => showPercentage ? ((value / totalPatients) * 100).toFixed(2) : value)
  );

  // Calculate the maximum value for alpha scaling based on raw data only
  const maxValue = Math.max(...heatmapData.flat());

  return (
    <WidgetContainer>
      <WidgetTitle>
        Discovery vs Age
        <Switch
          onChange={() => setShowPercentage(!showPercentage)}
          checked={showPercentage}
          offColor="#888"
          onColor="#66ff66"
          uncheckedIcon={false}
          checkedIcon={false}
        />
      </WidgetTitle>
      <HeatmapContainer>
        <HeatMapGrid
          data={formattedData}
          xLabels={discoveryChannels}
          yLabels={locations}
          cellRender={(x, y, value) => (
            <div title={`Location: ${locations[y]}, Channel: ${discoveryChannels[x]} = ${value}`}>
              {value}{showPercentage ? '%' : ''}
            </div>
          )}
          xLabelsStyle={() => ({
            color: '#ffffff',
            fontSize: '1rem',
          })}
          yLabelsStyle={() => ({
            fontSize: '1rem',
            color: '#ffffff',
            whiteSpace: 'nowrap',
            marginRight: '15px',   
            marginLeft: '-20px', 

          
          })}
          cellStyle={(x, y) => {
            const rawValue = heatmapData[x][y]; // Always use raw data for alpha calculation
            const alpha = rawValue / maxValue; // Calculate alpha based on the maximum raw value
            console.log(`Cell [${x}, ${y}] - Raw Value: ${rawValue}, Alpha: ${alpha}`);
            return {
              background: `rgba(128, 0, 128, ${Math.min(Math.max(alpha, 0.1), 1)})`, // #007bff with alpha
              fontSize: '0.9rem',
              color: 'white',
              border: '1px solid #ffffff',
        
            };
          }}
          cellHeight="5.5rem"
          xLabelsPos="top"
          yLabelsPos="left"
          yLabelsRender={(label) => (
            <YLabelContainer>
              {label}
            </YLabelContainer>
          )}
          square
        />
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <span style={{ color: '#a5a5a5' }}>
            {showPercentage ? 'Showing Percentages' : 'Showing Actual Values'}
          </span>
        </div>
      </HeatmapContainer>
    </WidgetContainer>
  );
};

export default DiscoveryVsAge;