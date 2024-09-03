import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { supabase } from '../supabaseClient';
import dayjs from 'dayjs';

// Define filter options
const filterOptions = [
  { label: 'Location', value: 'location' },
  { label: 'Age', value: 'age' },
  { label: 'Gender', value: 'gender' },
  { label: 'Distance Traveled', value: 'distance' },
  { label: 'Discovery Channel', value: 'discoveryChannel' },
  { label: 'Day of the Week', value: 'dayOfWeek' },
  { label: 'Weekday/Weekend', value: 'weekdayWeekend' },
  { label: 'Type (Walkin/Appointment/Emergency)', value: 'type' },
];

// Styled components
const Container = styled.div`
  margin-top: 20px;
  color: #ffffff;
  display: flex;
  justify-content: space-between;
`;
const FieldsContainer = styled.div`
  flex: 1;
`;

const FieldContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
`;

const Dropdown = styled.select`
  padding: 5px;
  background-color: #333333;
  color: #ffffff;
  border: 1px solid #444444;
  border-radius: 5px;
`;

const Input = styled.input`
  padding: 5px;
  background-color: #333333;
  color: #ffffff;
  border: 1px solid #444444;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 5px 10px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #555555;
    cursor: not-allowed;
  }
`;

const ComparisonContainer = styled.div`
  flex: 0.3;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const CorrelationContainer = styled.div`
  flex: 0.3;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-left: 20px;
`;
// Define your CustomFields component
const CustomFields = ({ hospital_id, startDate, endDate }) => {
  const [fields, setFields] = useState([]);
  const [comparisonField, setComparisonField] = useState('none');
  const [correlationField, setCorrelationField] = useState('none');
  const [data, setData] = useState([]); // Data fetched from Supabase
  const [locations, setLocations] = useState(['All']); // State for unique locations

  // Function to fetch unique locations from the database
  const fetchUniqueLocations = async () => {
    const { data: locationsData, error } = await supabase
      .from('patients')
      .select('address', { distinct: true });

    if (error) {
      console.error('Error fetching locations:', error);
      return;
    }

    const uniqueLocations = locationsData.map((item) => item.address);
    setLocations(['All', ...uniqueLocations]);
  };

  // Fetch unique locations on component mount
  useEffect(() => {
    fetchUniqueLocations();
  }, []);

  // Function to fetch data from Supabase based on selected filters
  const fetchFilteredData = async () => {
    let { data: appointments, error } = await supabase
      .from('appointments')
      .select(`
        patient_id,
        appointment_time,
        reason_for_visit,
        patients:patient_id(name, address, date_of_birth, how_did_you_get_to_know_us)
      `)
      .eq('hospital_id', hospital_id)
      .gte('appointment_time', startDate.toISOString())
      .lte('appointment_time', endDate.toISOString());

    if (error) {
      console.error('Error fetching data:', error);
      setData([]);
      return;
    }

    // Map additional fields (age, day of the week, weekday/weekend)
    const mappedData = appointments.map((item) => ({
      ...item,
      age: calculateAge(item.patients.date_of_birth),
      day_of_week: getDayOfWeek(item.appointment_time),
      weekday_or_weekend: isWeekdayOrWeekend(item.appointment_time),
    }));

    // Apply filters from fields
    const filteredData = applyCustomFilters(mappedData);
    setData(filteredData);
  };

  // Helper functions (calculateAge, getDayOfWeek, isWeekdayOrWeekend)
  const calculateAge = (dateOfBirth) => dayjs().diff(dayjs(dateOfBirth), 'year');
  const getDayOfWeek = (appointmentTime) => dayjs(appointmentTime).format('dddd');
  const isWeekdayOrWeekend = (appointmentTime) => {
    const dayOfWeek = dayjs(appointmentTime).day();
    return dayOfWeek === 0 || dayOfWeek === 6 ? 'Weekend' : 'Weekday';
  };

  // Function to apply filters to the data
  const applyCustomFilters = (data) => {
    return data.filter((item) => {
      let match = true;

      fields.forEach((field) => {
        switch (field.name) {
          case 'location':
            if (field.value !== 'All') match = match && item.patients.address === field.value;
            break;
          case 'age':
            if (field.value === 'below') {
              match = match && item.age < field.rangeStart;
            } else if (field.value === 'above') {
              match = match && item.age > field.rangeStart;
            } else if (field.value === 'between') {
              match = match && item.age >= field.rangeStart && item.age <= field.rangeEnd;
            }
            break;
          case 'gender':
            match = match && item.patients.gender === field.value;
            break;
          case 'discoveryChannel':
            if (field.value !== 'All') match = match && item.patients.how_did_you_get_to_know_us === field.value;
            break;
          // Add more cases for other filters as needed
          default:
            break;
        }
      });

      return match;
    });
  };

  // Fetch data whenever hospital_id, startDate, endDate, or fields change
  useEffect(() => {
    fetchFilteredData();
  }, [hospital_id, startDate, endDate, fields]);

  const addField = () => {
    setFields([...fields, { id: fields.length, name: '', value: '', rangeStart: '', rangeEnd: '' }]);
  };

  const removeField = (id) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const handleFieldChange = (id, name, value) => {
    const newFields = fields.map((field) => {
      if (field.id === id) {
        return { ...field, name: name || field.name, value: value ?? field.value };
      }
      return field;
    });
    setFields(newFields);
  };

  const handleInputChange = (id, key, value) => {
    const newFields = fields.map((field) => {
      if (field.id === id) {
        return { ...field, [key]: value };
      }
      return field;
    });
    setFields(newFields);
  };

  const handleComparisonChange = (e) => {
    setComparisonField(e.target.value);
  };

  const handleCorrelationChange = (e) => {
    setCorrelationField(e.target.value);
  };

  const availableOptions = filterOptions.filter(
    (option) =>
      !fields.some((field) => field.name === option.value) &&
      option.value !== comparisonField &&
      option.value !== correlationField
  );

  const availableComparisonOptions = filterOptions.filter(
    (option) =>
      !fields.some((field) => field.name === option.value) &&
      option.value !== correlationField
  );

  const availableCorrelationOptions = filterOptions.filter(
    (option) =>
      !fields.some((field) => field.name === option.value) &&
      option.value !== comparisonField
  );

  const renderFieldValue = (field) => {
    switch (field.name) {
      case 'location':
        return (
          <Dropdown value={field.value} onChange={(e) => handleFieldChange(field.id, field.name, e.target.value)}>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </Dropdown>
        );
      case 'age':
        return (
          <>
            <Dropdown value={field.value} onChange={(e) => handleFieldChange(field.id, field.name, e.target.value)}>
              <option value="all">All</option>
              <option value="between">Between</option>
              <option value="below">Below</option>
              <option value="above">Above</option>
            </Dropdown>
            {(field.value === 'between' || field.value === 'below' || field.value === 'above') && (
              <Input
                type="number"
                placeholder="Enter age"
                value={field.rangeStart || ''}
                onChange={(e) => handleInputChange(field.id, 'rangeStart', e.target.value)}
              />
            )}
            {field.value === 'between' && (
              <Input
                type="number"
                placeholder="End age"
                value={field.rangeEnd || ''}
                onChange={(e) => handleInputChange(field.id, 'rangeEnd', e.target.value)}
              />
            )}
          </>
        );
      case 'gender':
        return (
          <Dropdown value={field.value} onChange={(e) => handleFieldChange(field.id, field.name, e.target.value)}>
            <option value="all">All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </Dropdown>
        );
      case 'distance':
        return (
          <>
            <Dropdown value={field.value} onChange={(e) => handleFieldChange(field.id, field.name, e.target.value)}>
              <option value="all">All</option>
              <option value="between">Between</option>
              <option value="below">Below</option>
              <option value="above">Above</option>
            </Dropdown>
            {(field.value === 'between' || field.value === 'below' || field.value === 'above') && (
              <Input
                type="number"
                placeholder="Enter distance"
                value={field.rangeStart || ''}
                onChange={(e) => handleInputChange(field.id, 'rangeStart', e.target.value)}
              />
            )}
            {field.value === 'between' && (
              <Input
                type="number"
                placeholder="End distance"
                value={field.rangeEnd || ''}
                onChange={(e) => handleInputChange(field.id, 'rangeEnd', e.target.value)}
              />
            )}
          </>
        );
      case 'discoveryChannel':
        return (
          <Dropdown value={field.value} onChange={(e) => handleFieldChange(field.id, field.name, e.target.value)}>
            <option value="all">All</option>
            <option value="friendsFamily">Friends and Family</option>
            <option value="google">Google</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="others">Others</option>
          </Dropdown>
        );
      case 'type':
        return (
          <Dropdown value={field.value} onChange={(e) => handleFieldChange(field.id, field.name, e.target.value)}>
            <option value="all">All</option>
            <option value="walkin">Walkin</option>
            <option value="appointment">Appointment</option>
            <option value="emergency">Emergency</option>
          </Dropdown>
        );
      case 'weekdayWeekend':
        return (
          <Dropdown value={field.value} onChange={(e) => handleFieldChange(field.id, field.name, e.target.value)}>
            <option value="all">All</option>
            <option value="weekday">Weekday</option>
            <option value="weekend">Weekend</option>
          </Dropdown>
        );
      case 'dayOfWeek':
        return (
          <Dropdown value={field.value} onChange={(e) => handleFieldChange(field.id, field.name, e.target.value)}>
            <option value="all">All</option>
            <option value="monday">Monday</option>
            <option value="tuesday">Tuesday</option>
            <option value="wednesday">Wednesday</option>
            <option value="thursday">Thursday</option>
            <option value="friday">Friday</option>
            <option value="saturday">Saturday</option>
            <option value="sunday">Sunday</option>
          </Dropdown>
        );
      default:
        return <Input type="text" value={field.value} onChange={(e) => handleFieldChange(field.id, field.name, e.target.value)} />;
    }
  };

  return (
    <Container>
      <FieldsContainer>
        <Button onClick={addField} disabled={availableOptions.length === 0}>
          Add Field
        </Button>
        {fields.map((field) => (
          <FieldContainer key={field.id}>
            <Dropdown
              value={field.name}
              onChange={(e) => handleFieldChange(field.id, e.target.value, '')} // Update the name and reset the value
            >
              <option value="">Select Field</option>
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Dropdown>

            {renderFieldValue(field)}

            <Button onClick={() => removeField(field.id)}>Remove</Button>
          </FieldContainer>
        ))}

        <h3>Fetched Data:</h3>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </FieldsContainer>

      <ComparisonContainer>
        <h3>Comparison</h3>
        <Dropdown value={comparisonField} onChange={handleComparisonChange}>
          <option value="none">None</option>
          {availableComparisonOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Dropdown>
      </ComparisonContainer>

      <CorrelationContainer>
        <h3>Correlation</h3>
        <Dropdown value={correlationField} onChange={handleCorrelationChange}>
          <option value="none">None</option>
          {availableCorrelationOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Dropdown>
      </CorrelationContainer>
    </Container>
  );
};

export default CustomFields;
