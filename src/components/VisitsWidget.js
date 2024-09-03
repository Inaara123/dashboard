import React,{ useState, useEffect }  from 'react';
import styled from 'styled-components';
import { supabase } from '../supabaseClient';

// Styled components for the widget
const WidgetContainer = styled.div`
  background-color: #2c2f33;
  padding: 20px;
  border-radius: 15px;
  color: #fff;
  width: 100%; /* Ensure it fits within its container */
  max-width: 250px; /* Or set this to the desired width */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  box-sizing: border-box; /* Include padding and border in width calculation */
  overflow: hidden; /* Ensure no overflow */
  margin: 0 auto; /* Center within its container if needed */
  border: 1px solid transparent; /* Adjust this as needed */
`;


const WidgetTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
`;

const MainStat = styled.div`
  font-size: 40px;
  font-weight: bold;
`;

const Subtext = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: #a5a5a5;
`;

const StatChange = styled.span`
  color: #00c48c;
  font-weight: bold;
  font-size: 14px;
`;

const InfoIcon = styled.span`
  font-size: 12px;
  color: #a5a5a5;
  margin-left: 5px;
  cursor: pointer;
`;

const VisitsWidget = () => {
  const [visits, setVisits] = useState(0);
  const [change, setChange] = useState(0);

  useEffect(() => {
    const fetchVisitsData = async () => {
      const hospitalId = '4rGAVPwMavcn6ZXQJSqynPoJKyE3';
      const doctorId = '0c99dde8-1414-4867-9395-26ffe3355f3f';
      const dateRange = 'custom';
      const customStartDate = '2024-01-01';
      const customEndDate = '2024-01-31';

      const { data, error } = await supabase.rpc('get_appointment_stats', {
        p_hospital_id: hospitalId,
        p_doctor_id: doctorId,
        p_date_range: dateRange,
        p_custom_start_date: customStartDate,
        p_custom_end_date: customEndDate,
      });

      if (error) {
        console.error('Error fetching appointment stats:', error);
      } else if (data && data.length > 0) {
        setVisits(data[0].total_visits); // Adjust the field name based on your data structure
        setChange(data[0].change_percentage); // Adjust the field name based on your data structure
      }
    };

    fetchVisitsData();
  }, []); 
  return (
    <WidgetContainer>
      <WidgetTitle>
        Visits 
        <InfoIcon>i</InfoIcon> {/* Replace with an actual icon if needed */}
      </WidgetTitle>
      <MainStat>
        400 <span style={{ fontSize: '20px', fontWeight: 'normal' }}>Today</span>
      </MainStat>
      <Subtext>
        <StatChange>+12.5%</StatChange> Than last month
      </Subtext>
    </WidgetContainer>
  );
};

export default VisitsWidget;
