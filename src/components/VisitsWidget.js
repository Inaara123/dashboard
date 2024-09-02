import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { supabase } from '../supabaseClient';

// Styled components for the widget
const WidgetContainer = styled.div`
  background-color: #2c2f33;
  padding: 20px;
  border-radius: 15px;
  color: #fff;
  width: 250px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

async function fetchVisitsData(timeRange, customStartDate, customEndDate) {
  const hospitalId = '4rGAVPwMavcn6ZXQJSqynPoJKyE3';
  const doctorId = null;//'0c99dde8-1414-4867-9395-26ffe3355f3f';

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

  const { data, error } = await supabase.rpc('get_appointment_stats', {
    p_hospital_id: hospitalId,
    p_doctor_id: doctorId,
    p_date_range: timeRange,
    p_custom_start_date: customStartDate || null,
    p_custom_end_date: customEndDate || null,
  });

  if (error) {
    console.error('Error fetching appointment stats:', error);
    return { totalAppointments: 0, percentageChange: 0 };
  } else {
    console.log(data);
    return data.length > 0
      ? { totalAppointments: data[0].total_appointments, percentageChange: data[0].percentage_change }
      : { totalAppointments: 0, percentageChange: 0 };
  }
}

const VisitsWidget = ({ timeRange }) => {
  const [visits, setVisits] = useState(0);
  const [change, setChange] = useState(0);

  useEffect(() => {
    async function getVisits() {
      let timeComponent = timeRange.type;
      let customStartDate = null;
      let customEndDate = null;

      if (timeRange.type === 'Custom') {
        timeComponent = 'custom';
        customStartDate = timeRange.startDate;
        customEndDate = timeRange.endDate;
      }

      const { totalAppointments, percentageChange } = await fetchVisitsData(timeComponent, customStartDate, customEndDate);
      setVisits(totalAppointments);
      setChange(percentageChange);
    }

    getVisits();
  }, [timeRange]);

  return (
    <WidgetContainer>
      <WidgetTitle>
        Visits
        <InfoIcon>i</InfoIcon> {/* Replace with an actual icon if needed */}
      </WidgetTitle>
      <MainStat>
        {visits} <span style={{ fontSize: '20px', fontWeight: 'normal' }}>Today</span>
      </MainStat>
      <Subtext>
        <StatChange>{change}</StatChange> Than last month
      </Subtext>
    </WidgetContainer>
  );
};

export default VisitsWidget;
