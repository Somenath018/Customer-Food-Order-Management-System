// Smooth interpolation and distance calculation helpers for GPS Navigation

export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Generate intermediate step coordinates between start and target points
export const generateWaypoints = (start, end, steps = 25) => {
  const waypoints = [];
  const startLat = Number(start.lat || start[0]);
  const startLng = Number(start.lng || start[1]);
  const endLat = Number(end.lat || end[0]);
  const endLng = Number(end.lng || end[1]);

  for (let i = 0; i <= steps; i++) {
    const fraction = i / steps;
    // Add a tiny sinusoidal jitter to simulate realistic city grid roads
    const jitter = Math.sin(fraction * Math.PI) * 0.0012;
    const lat = startLat + (endLat - startLat) * fraction + jitter * 0.4;
    const lng = startLng + (endLng - startLng) * fraction + jitter * 0.8;
    waypoints.push({ lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) });
  }
  return waypoints;
};

// Default center coordinates (New York City area matching backend seed data)
export const DEFAULT_NYC_COORDS = {
  driver: { lat: 40.7185, lng: -73.9960 },
  restaurant: { lat: 40.7192, lng: -73.9972 },
  customer: { lat: 40.7280, lng: -73.9850 }
};
