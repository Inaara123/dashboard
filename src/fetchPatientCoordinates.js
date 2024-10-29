// patientService.js
import { supabase } from './supabaseClient'; // Ensure you import your initialized Supabase client here

export const fetchPatientCoordinates = async (hospitalId,selectedDoctorId,timeRange) => {
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
    console.log('timecomponents',timeComponent);
  try {
    const { data, error } = await supabase.rpc('get_patient_coordinates', {
      hospital_id_param: hospitalId, // The parameter name should match your SQL function
      p_time_range: timeComponent,
      p_doctor_id:selectedDoctorId
    });

    if (error) {
      throw new Error(`Error fetching patient coordinates: ${error.message}`);
    }
    return data; // Return the data if successful
  } catch (err) {
    console.error('Failed to fetch patient coordinates:', err.message);
    return []; // Return an empty array on error
  }
};
