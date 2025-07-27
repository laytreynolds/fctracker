// Utility function to convert UK postcodes to coordinates
// Using the free postcodes.io API for UK postcodes

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export async function postcodeToCoordinates(postcode: string): Promise<Coordinates | null> {
  try {
    // Clean the postcode (remove spaces and convert to uppercase)
    const cleanPostcode = postcode.replace(/\s+/g, '').toUpperCase();
    
    // Use the free postcodes.io API for UK postcodes
    const response = await fetch(`https://api.postcodes.io/postcodes/${cleanPostcode}`);
    
    if (!response.ok) {
      console.error('Failed to geocode postcode:', postcode);
      return null;
    }
    
    const data = await response.json();
    
    if (data.result) {
      return {
        latitude: data.result.latitude,
        longitude: data.result.longitude
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error geocoding postcode:', error);
    return null;
  }
}