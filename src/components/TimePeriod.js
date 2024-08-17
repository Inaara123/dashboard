import React, { useState } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Styled component for the header container
const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background-color: #333;
  color: #fff;
`;

// Container for date pickers and submit button when Custom is selected
const DatePickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
`;

// Styled component for each button
const OptionButton = styled.button`
  background-color: ${({ selected }) => (selected ? '#ffffff' : '#444')}; 
  color: ${({ selected }) => (selected ? '#000' : '#fff')};
  border: none;
  border-radius: 5px;
  margin: 0 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #66ff66;
    color: #000;
  }
`;

// Styled component for the submit button
const SubmitButton = styled.button`
  background-color: #66ff66;
  color: #000;
  border: none;
  border-radius: 5px;
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #44cc44;
  }
`;

const Header = ({ timeRange, setTimeRange }) => {
  const options = ['1 Day', '1 Week', '1 Month', '3 Months', 'Custom'];
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);

  const handleSubmit = () => {
    setTimeRange({ type: 'Custom', startDate: customStartDate, endDate: customEndDate });
  };

  return (
    <HeaderContainer>
      <div>
        {options.map((option) => (
          <OptionButton
            key={option}
            selected={timeRange.type === option}
            onClick={() => setTimeRange({ type: option })}
          >
            {option}
          </OptionButton>
        ))}
      </div>
      {timeRange.type === 'Custom' && (
        <DatePickerContainer>
          <DatePicker
            selected={customStartDate}
            onChange={(date) => setCustomStartDate(date)}
            selectsStart
            startDate={customStartDate}
            endDate={customEndDate}
            placeholderText="Start Date"
            dateFormat="yyyy-MM-dd"
          />
          <DatePicker
            selected={customEndDate}
            onChange={(date) => setCustomEndDate(date)}
            selectsEnd
            startDate={customStartDate}
            endDate={customEndDate}
            minDate={customStartDate}
            placeholderText="End Date"
            dateFormat="yyyy-MM-dd"
            style={{ marginLeft: '10px' }}
          />
          <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
        </DatePickerContainer>
      )}
    </HeaderContainer>
  );
};

export default Header;
