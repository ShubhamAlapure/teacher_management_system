// MIT Art, Design and Technology University (MIT-ADT) Pune
// Centralized Campus Geofence Configuration & Geospatial Engine

/**
 * Verified University Campus Center:
 * Location: World Peace Dome & Central Academic Quadrangle,
 * Rajbaug Educational Complex, Loni Kalbhor, Pune, Maharashtra 412201
 * 
 * Coordinates: 18.49259° N, 74.02548° E
 * Campus Acreage: ~125–150 acres along the Mula-Mutha river.
 * Default Geofence Radius: 850 meters (covers all academic blocks, hostels, and sports complex).
 */
export const DEFAULT_CAMPUS_GEOFENCE_CONFIG = {
  campusName: 'MIT-ADT University, Rajbaug Campus',
  campusPremises: 'Rajbaug Educational Complex, Loni Kalbhor, Pune - 412201',
  latitude: 18.492590,
  longitude: 74.025480,
  altitudeASL: 564.0, // meters above sea level
  radiusMeters: 850,  // 850m radius covers the 125-acre campus
  maxAccuracyMeters: 80, // Accuracy worse than 80m flagged as uncertain
  boundaryBufferMeters: 30, // Margin of error buffer
  strictVerification: true
};

/**
 * Get active campus geofence configuration.
 * Reads administrator overrides from localStorage if configured, else defaults to verified coordinates.
 */
export function getActiveCampusGeofenceConfig() {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('mit_campus_geofence_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.latitude === 'number' && typeof parsed.longitude === 'number') {
          return { ...DEFAULT_CAMPUS_GEOFENCE_CONFIG, ...parsed };
        }
      }
    } catch (e) {
      console.warn('Geofence config load fallback:', e);
    }
  }
  return DEFAULT_CAMPUS_GEOFENCE_CONFIG;
}

/**
 * Save administrator geofence configuration override.
 */
export function saveCampusGeofenceConfig(config) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mit_campus_geofence_config', JSON.stringify(config));
  }
}

/**
 * Calculate distance between two coordinates in meters using the Haversine formula.
 */
export function calculateHaversineDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const toRad = (deg) => (deg * Math.PI) / 180;

  const phi1 = toRad(lat1);
  const phi2 = toRad(lat2);
  const deltaPhi = toRad(lat2 - lat1);
  const deltaLambda = toRad(lon2 - lon1);

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Validate a live GPS reading against the university campus geofence.
 * 
 * Returns a comprehensive, non-fabricated validation object:
 * - isInsideCampus: boolean
 * - isValid: boolean (only true when inside AND accuracy is acceptable)
 * - status: 'CAMPUS_VERIFIED' | 'OUTSIDE_CAMPUS' | 'UNCERTAIN_ACCURACY' | 'BOUNDARY_UNCERTAIN' | 'INVALID_GPS'
 * - badgeText: Short display label
 * - badgeColor: Tailwind semantic theme
 * - distanceMeters: Distance from campus center in meters
 * - accuracyMeters: Device GPS accuracy in meters
 * - message: Clear human explanation
 */
export function validateCoordinatesAgainstGeofence(
  latitude,
  longitude,
  accuracyMeters = null,
  customConfig = null
) {
  const config = customConfig || getActiveCampusGeofenceConfig();

  // 1. Invalid or missing coordinates check
  if (
    typeof latitude !== 'number' ||
    typeof longitude !== 'number' ||
    isNaN(latitude) ||
    isNaN(longitude) ||
    (latitude === 0 && longitude === 0)
  ) {
    return {
      isValid: false,
      isInsideCampus: false,
      status: 'INVALID_GPS',
      badgeText: 'GPS Coordinates Missing',
      badgeColor: 'rose',
      distanceMeters: null,
      accuracyMeters: null,
      campusName: config.campusName,
      radiusMeters: config.radiusMeters,
      message: 'No live GPS coordinates were captured. Location verification failed.'
    };
  }

  // 2. Compute accurate Haversine distance
  const distanceMeters = Math.round(
    calculateHaversineDistanceMeters(latitude, longitude, config.latitude, config.longitude)
  );

  const accuracy = typeof accuracyMeters === 'number' && !isNaN(accuracyMeters)
    ? Math.round(accuracyMeters)
    : null;

  const maxRadius = config.radiusMeters;
  const maxAccuracy = config.maxAccuracyMeters;

  // 3. Poor Accuracy / Low Precision Check
  if (accuracy !== null && accuracy > maxAccuracy) {
    return {
      isValid: false,
      isInsideCampus: distanceMeters <= maxRadius,
      status: 'UNCERTAIN_ACCURACY',
      badgeText: `Location Uncertain (±${accuracy}m)`,
      badgeColor: 'amber',
      distanceMeters,
      accuracyMeters: accuracy,
      campusName: config.campusName,
      radiusMeters: maxRadius,
      message: `GPS accuracy is ±${accuracy}m (exceeds allowable tolerance of ±${maxAccuracy}m). Please move closer to an open window or sky and retry.`
    };
  }

  // 4. Clearly INSIDE Campus
  if (distanceMeters <= maxRadius) {
    return {
      isValid: true,
      isInsideCampus: true,
      status: 'CAMPUS_VERIFIED',
      badgeText: 'Campus Perimeter Verified',
      badgeColor: 'emerald',
      distanceMeters,
      accuracyMeters: accuracy,
      campusName: config.campusName,
      radiusMeters: maxRadius,
      message: `Verified inside ${config.campusName} (${distanceMeters}m from campus center; max radius: ${maxRadius}m).`
    };
  }

  // 5. Boundary Ambiguity Check (within accuracy overlap distance)
  const accuracyOverlap = accuracy || config.boundaryBufferMeters;
  if (distanceMeters - accuracyOverlap <= maxRadius) {
    return {
      isValid: false,
      isInsideCampus: false,
      status: 'BOUNDARY_UNCERTAIN',
      badgeText: 'Campus Boundary Uncertain',
      badgeColor: 'amber',
      distanceMeters,
      accuracyMeters: accuracy,
      campusName: config.campusName,
      radiusMeters: maxRadius,
      message: `Located near perimeter (${distanceMeters}m from center; boundary is ${maxRadius}m). With ±${accuracy || 0}m GPS tolerance, campus presence cannot be certified.`
    };
  }

  // 6. Clearly OUTSIDE Campus
  const distanceFormatted = distanceMeters >= 1000
    ? `${(distanceMeters / 1000).toFixed(2)} km`
    : `${distanceMeters} meters`;

  return {
    isValid: false,
    isInsideCampus: false,
    status: 'OUTSIDE_CAMPUS',
    badgeText: 'Outside Campus Boundary',
    badgeColor: 'rose',
    distanceMeters,
    accuracyMeters: accuracy,
    campusName: config.campusName,
    radiusMeters: maxRadius,
    message: `Location is ${distanceFormatted} away from campus center (Allowed radius: ${maxRadius}m). Location verification failed.`
  };
}
