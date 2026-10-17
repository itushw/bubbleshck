import { SafeShelter, EmergencyAlert, UserGeoLocation } from './types';

// Reference anchor point: Saryu Basin coordination zone
export const REGIONAL_CENTER = {
  lat: 26.7922,
  lng: 82.1998,
};

// Known safe shelters located on elevated ridges and multi-story concrete structures
export const SAFE_SHELTERS: SafeShelter[] = [
  {
    id: 'school_shelter',
    name: 'Government Model Higher Secondary School Shelter',
    type: 'school',
    address: 'East Ridge Road, Sector 4, High Ground',
    elevationMeters: 62.0,
    capacity: 36,
    occupied: 10,
    availableBeds: 26,
    hasMedicalPost: true,
    hasDrinkingWater: true,
    hasBackupPower: true,
    vhfRadioChannel: 'Channel 16 (156.800 MHz)',
    phoneContact: '+91 1800-180-5321 / +91 94150-12890',
    coordinates: { lat: 26.8050, lng: 82.2280, x: 700, y: 180 },
  },
  {
    id: 'community_shelter',
    name: 'South Sector Municipal Community Shelter',
    type: 'community',
    address: 'South Bund Highland, Near PWD Rest House',
    elevationMeters: 59.0,
    capacity: 32,
    occupied: 8,
    availableBeds: 24,
    hasMedicalPost: true,
    hasDrinkingWater: true,
    hasBackupPower: true,
    vhfRadioChannel: 'Channel 06 (156.300 MHz)',
    phoneContact: '+91 1800-180-5322 / +91 94150-23451',
    coordinates: { lat: 26.7720, lng: 82.2150, x: 560, y: 380 },
  },
  {
    id: 'camp_shelter',
    name: 'Relief Camp Alpha (West Defense Enclave)',
    type: 'stadium',
    address: 'National Highway 27 Bypass, High Embankment Zone',
    elevationMeters: 58.0,
    capacity: 30,
    occupied: 6,
    availableBeds: 24,
    hasMedicalPost: true,
    hasDrinkingWater: true,
    hasBackupPower: true,
    vhfRadioChannel: 'Channel 08 (156.400 MHz)',
    phoneContact: '+91 1800-180-5323 / +91 94150-34567',
    coordinates: { lat: 26.7750, lng: 82.1750, x: 200, y: 380 },
  },
  {
    id: 'hospital_shelter',
    name: 'District Civil Hospital Elevated Wing',
    type: 'hospital',
    address: 'Medical College Road, North Safe Highland',
    elevationMeters: 64.5,
    capacity: 50,
    occupied: 18,
    availableBeds: 32,
    hasMedicalPost: true,
    hasDrinkingWater: true,
    hasBackupPower: true,
    vhfRadioChannel: 'Channel 12 (156.600 MHz - Medical)',
    phoneContact: '+91 1800-180-5324 / 108 Emergency',
    coordinates: { lat: 26.8180, lng: 82.1950, x: 420, y: 80 },
  },
];

// Synthetic Wards coordinates for local position snapping
export const WARD_COORDINATES: Record<string, { lat: number; lng: number; name: string; elevation: number; isLowLying: boolean }> = {
  naya_tola: { lat: 26.7820, lng: 82.2220, name: 'Naya Tola (Floodplain Basin)', elevation: 45.0, isLowLying: true },
  moti_basti: { lat: 26.7760, lng: 82.1900, name: 'Moti Basti (Low-Lying Belt)', elevation: 46.2, isLowLying: true },
  nadi_nagar: { lat: 26.8020, lng: 82.1910, name: 'Nadi Nagar (Riverbank)', elevation: 48.0, isLowLying: true },
  shanti_colony: { lat: 26.8090, lng: 82.2180, name: 'Shanti Colony', elevation: 50.0, isLowLying: false },
  purab_ward: { lat: 26.7910, lng: 82.2050, name: 'Purab Ward (Central Junction)', elevation: 52.0, isLowLying: false },
};

/**
 * Haversine distance formula between two lat/lng pairs in kilometers.
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

/**
 * Returns safe shelters sorted by distance to the user's coordinates with walking and vehicle ETAs.
 */
export function getNearbyShelters(userLat: number, userLng: number): SafeShelter[] {
  return SAFE_SHELTERS.map((s) => {
    const dist = calculateDistanceKm(userLat, userLng, s.coordinates.lat, s.coordinates.lng);
    // Walking speed: 4 km/h under difficult weather = 15 min per km
    const etaWalking = Math.round(dist * 15);
    // Vehicle/boat speed: 25 km/h = 2.4 min per km + 3 min staging
    const etaVehicle = Math.round(dist * 2.4 + 3);

    return {
      ...s,
      distanceKm: dist,
      etaWalkingMin: Math.max(2, etaWalking),
      etaVehicleMin: Math.max(3, etaVehicle),
    };
  }).sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
}

/**
 * Generates emergency alerts based on proximity to flood crest and local elevation.
 */
export function generateEmergencyAlerts(
  userLat: number,
  userLng: number,
  riverStageMeters: number
): EmergencyAlert[] {
  const alerts: EmergencyAlert[] = [];

  // Check if river is above danger mark
  if (riverStageMeters >= 53.0) {
    alerts.push({
      id: 'alert_critical_crest',
      level: 'CRITICAL_RED',
      title: 'MANDATORY EVACUATION: River Saryu Danger Level Exceeded',
      timestamp: 'Active Now - Immediate Action Required',
      affectedZones: ['Naya Tola (45m)', 'Moti Basti (46m)', 'Nadi Nagar (48m)'],
      actionRequired:
        'All ground floor residents in low-lying zones must evacuate immediately to School Shelter (62m) or Community Shelter (59m). Avoid crossing Purab Bridge.',
      source: 'Central Water Commission (CWC) & State Disaster Management Authority',
      evacuationMandatory: true,
    });
  } else if (riverStageMeters >= 51.5) {
    alerts.push({
      id: 'alert_warning_surge',
      level: 'WARNING_ORANGE',
      title: 'EARLY WARNING: River Flow Exceeds Warning Mark (51.5m)',
      timestamp: 'Issued 15 mins ago',
      affectedZones: ['Floodplain lowlands', 'River embankment approaches'],
      actionRequired:
        'Secure livestock, vital identification documents, and medical supplies in waterproof bags. Prepare for advance transport before bridge closures.',
      source: 'District Flood Control Room',
      evacuationMandatory: false,
    });
  }

  // Pre-disaster low-lying zone advance advisory
  alerts.push({
    id: 'alert_low_lying_advisory',
    level: 'ADVISORY_YELLOW',
    title: 'Pre-Disaster Advance Dispatch Protocol Active',
    timestamp: 'Continuous Telemetry',
    affectedZones: ['Naya Tola', 'Moti Basti', 'Nadi Nagar Lower Reach'],
    actionRequired:
      'Rescue boats BT-01 and wheeled teams RT-01 are pre-positioned on high ground. Evacuation priority is strictly enforced for infants, elders, and expectant mothers.',
    source: 'BUBBLES Automated Early Warning Engine',
    evacuationMandatory: false,
  });

  return alerts;
}
