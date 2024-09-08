import siteMetadata from "./siteMetadata";

export default async function getLatLon(city: string, region: string, country: string) {
    const username = siteMetadata.geoNameUsername;
    const url = `http://api.geonames.org/searchJSON?q=${encodeURIComponent(`${city}, ${region}`)}&country=${country}&featureClass=P&maxRows=1&username=${username}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.geonames && data.geonames.length > 0) {
        const { lat, lng } = data.geonames[0];
        return { lat: parseFloat(lat || '0') || 0.0, lon: parseFloat(lng || '0') || 0.0 };
      } else {
        console.error(`No coordinates found for ${city}, ${region}, ${country}`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching coordinates for ${city}, ${region}, ${country}:`, error);
      return null;
    }
  }