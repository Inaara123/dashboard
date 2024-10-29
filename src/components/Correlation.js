import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
import CustomFields from './CustomFields'; // Import the CustomFields component

const Container = styled.div`
  padding: 20px;
  color: #ffffff;
  background-color: #1e1e1e;
  height: 100vh;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #ffffff;
`;

const HeaderBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: ${(props) => (props.active ? '#ffffff' : '#333333')};
  color: ${(props) => (props.active ? '#000000' : '#ffffff')};
  border: none;
  padding: 10px 20px;
  margin: 0 5px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: ${(props) => (props.active ? '#ffffff' : '#444444')};
  }
`;

const DateContainer = styled.div`
  display: ${(props) => (props.show ? 'flex' : 'none')};
  align-items: center;
  gap: 10px;
`;

const DatePickerStyled = styled(DatePicker)`
  background-color: #333333;
  color: #ffffff;
  border: none;
  padding: 10px;
  border-radius: 5px;
`;

const Correlation = ({selectedDoctorId,hospitalId}) => {
  
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState('single_day');

  const handleRangeSelect = (range) => {
    
    setSelectedRange(range);
  };

  return (
    <Container>
      <Title>Deeper Insights</Title>
      <HeaderBar>
        <Button active={selectedRange === 'single_day'} onClick={() => handleRangeSelect('single_day')}>
          1 Day
        </Button>
        <Button active={selectedRange === '1_week'} onClick={() => handleRangeSelect('1_week')}>
          1 Week
        </Button>
        <Button active={selectedRange === '1_month'} onClick={() => handleRangeSelect('1_month')}>
          1 Month
        </Button>
        <Button active={selectedRange === '3_months'} onClick={() => handleRangeSelect('3_months')}>
          3 Months
        </Button>
        <Button active={selectedRange === 'custom'} onClick={() => handleRangeSelect('custom')}>
          Custom
        </Button>

        <DateContainer show={selectedRange === 'custom'}>
          <label>Start Date:</label>
          <DatePickerStyled
            selected={startDate}
            onChange={(date) => setStartDate(date)}
          />
          <label>End Date:</label>
          <DatePickerStyled
            selected={endDate}
            onChange={(date) => setEndDate(date)}
          />
        </DateContainer>
      </HeaderBar>

      <CustomFields hospitalId={hospitalId}  selectedDoctorId= {selectedDoctorId} startDate={startDate} endDate={endDate} selectedRange={selectedRange} setSelectedRange={setSelectedRange}  />
    </Container>
  );
};

export default Correlation;
