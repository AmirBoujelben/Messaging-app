import * as Location from "expo-location";

// Function to get current location and send it
export default async function handleSendLocation() {
  try {
    // Request permission to access location
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    // Get the user's current position
    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    // Create the Google Maps link
    const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    return mapUrl;
  } catch (error) {
    console.error("Error sending location:", error);
  }
}
