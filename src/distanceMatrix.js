import axios from 'axios';

export async function calculateDistance(origin, destination) {
    const olaApiKey = 'lENUe2TJxyAmieOUa8z7GCiV6HiNcr4fkDA0ZeCK'; // Use your Ola API key
    const url = `https://api.ola.com/v1/distance?origin_lat=${origin.lat}&origin_lng=${origin.lng}&destination_lat=${destination.lat}&destination_lng=${destination.lng}`;

    try {
       
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${olaApiKey}`, // Include API key in headers
            }
        });
        console.log('Response Status:', response.status); // Debugging info
        console.log('Response Data:', response.data);
        const result = response.data;
        
        if (result && result.distance) {
            const distanceInMeters = result.distance; // Assuming the API returns distance in meters
            return distanceInMeters / 1000; // Convert to kilometers
        } else {
            console.error('Error calculating distance:', result.message || 'Unknown error');
            return null;
        }
    } catch (error) {
        console.error('Error fetching distance from API:', error.response || error.message || error);
        return null;
    }
}
