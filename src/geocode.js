import axios from 'axios';

export async function geocodeAddress(address) {
  const googleMapsApiKey = 'lENUe2TJxyAmieOUa8z7GCiV6HiNcr4fkDA0ZeCK';
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1`;

  try {
    const response = await axios.get(url);
    if (response.data && response.data.length > 0) {
      const location = response.data[0];
      
      return {
        lat: location.lat,
        lng: location.lon
      }; // { lat: xx.xxxx, lng: xx.xxxx }
    } else {
      console.error('Error geocoding address:', response.data.status);
      return null;
    }
  } catch (error) {
    console.error('Error fetching geocode from API:', error);
    return null;
  }
}
