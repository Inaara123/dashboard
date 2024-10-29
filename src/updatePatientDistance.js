import { supabase } from './supabaseClient';

export async function updatePatientDistance(patientId, distance) {
  const { error } = await supabase
    .from('patients')
    .update({ distance_travelled: distance })
    .eq('id', patientId);

  if (error) {
    console.error(`Error updating distance for patient ${patientId}:`, error);
  } else {
    console.log(`Successfully updated distance for patient ${patientId}: ${distance} km`);
  }
}
