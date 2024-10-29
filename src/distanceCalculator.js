import { fetchPatients } from './fetchPatientCoordinates';
import { geocodeAddress } from './geocode';
import { calculateDistance } from './distanceMatrix';
import { updatePatientDistance } from './updatePatientDistance';
import {supabase} from './supabaseClient';
export async function updateAllPatientsDistances() {
  // Coordinates of Divi Hospital
  const diviHospitalLocation = { lat: 17.4948103673986, lng: 78.32890959901766 };
  
  // Fetch all patients
  const patients = await fetchPatients();
  
  // Loop through each patient
  for (const patient of patients) {
    const patientAddress = patient.address;
    
    // Step 1: Geocode the patient's address to get lat/lng
    const patientLocation = await geocodeAddress(patientAddress);
    if (!patientLocation) {
      console.error(`Failed to geocode address for patient ${patient.id}`);
      continue;
    }

    const { lat, lng } = patientLocation;
    const { data, error } = await supabase
    .from('patients')
    .update({ latitude: lat, longitude: lng })
    .eq('address', patientAddress);  // Match based on the address

  if (error) {
    console.error(`Failed to update patient at ${patientAddress}:`, error);
  } else {
    console.log(`Updated lat/lng for patient at ${patientAddress}`);
  }
    // Step 2: Calculate the distance from the hospital to the patient's location
    const distance = await calculateDistance(diviHospitalLocation, patientLocation);
    if (distance !== null) {
      // Step 3: Update distance_travelled column for each patient
      await updatePatientDistance(patient.id, distance);
    }
  }
}
