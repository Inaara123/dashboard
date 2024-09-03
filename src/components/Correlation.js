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

const Correlation = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState('1day');
  const hospital_id = '4rGAVPwMavcn6ZXQJSqynPoJKyE3'; // Replace with your actual hospital_id

  const handleRangeSelect = (range) => {
    let now = new Date();
    setSelectedRange(range);

    switch (range) {
      case '1day':
        setStartDate(now);
        setEndDate(now);
        break;
      case '1week':
        setStartDate(new Date(now.setDate(now.getDate() - 7)));
        setEndDate(new Date());
        break;
      case '1month':
        setStartDate(new Date(now.setMonth(now.getMonth() - 1)));
        setEndDate(new Date());
        break;
      case '3months':
        setStartDate(new Date(now.setMonth(now.getMonth() - 3)));
        setEndDate(new Date());
        break;
      case 'custom':
      default:
        break;
    }
  };

  return (
    <Container>
      <Title>Deeper Insights</Title>
      <HeaderBar>
        <Button active={selectedRange === '1day'} onClick={() => handleRangeSelect('1day')}>
          1 Day
        </Button>
        <Button active={selectedRange === '1week'} onClick={() => handleRangeSelect('1week')}>
          1 Week
        </Button>
        <Button active={selectedRange === '1month'} onClick={() => handleRangeSelect('1month')}>
          1 Month
        </Button>
        <Button active={selectedRange === '3months'} onClick={() => handleRangeSelect('3months')}>
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

      <CustomFields hospital_id={hospital_id} startDate={startDate} endDate={endDate} />
    </Container>
  );
};

export default Correlation;
