import { RiverHydrologyState } from './types';

export const INITIAL_HYDROLOGY: RiverHydrologyState = {
  riverStageMeters: 51.8,
  normalLevelMeters: 48.0,
  warningLevelMeters: 51.5,
  dangerLevelMeters: 53.0,
  embankmentCrestMeters: 54.5,
  dischargeCumecs: 11200,
  breachStatus: 'intact',
  breachWidthMeters: 0,
  inundationVelocityMs: 0.8,
  upstreamRainfallMm24h: 185,
  damReleaseDischargeCumecs: 4800,
  estimatedLeadTimeMinutes: 45,
};

// Settlements with distance along river corridor and ground elevation
export interface FloodplainSettlement {
  id: string;
  name: string;
  elevationMeters: number;
  distanceFromEmbankmentKm: number;
  population: number;
  vulnerableGroupsCount: number;
  criticalFloodStageMeters: number; // river stage at which backwater/overtopping begins
}

export const FLOODPLAIN_SETTLEMENTS: FloodplainSettlement[] = [
  {
    id: 'naya_tola',
    name: 'Naya Tola (Basin Bottom)',
    elevationMeters: 45.0,
    distanceFromEmbankmentKm: 1.8,
    population: 290,
    vulnerableGroupsCount: 78,
    criticalFloodStageMeters: 52.2, // Floods first!
  },
  {
    id: 'moti_basti',
    name: 'Moti Basti (Southern Slum Belt)',
    elevationMeters: 46.2,
    distanceFromEmbankmentKm: 2.4,
    population: 380,
    vulnerableGroupsCount: 95,
    criticalFloodStageMeters: 53.0,
  },
  {
    id: 'nadi_nagar',
    name: 'Nadi Nagar (Riverbank Settlement)',
    elevationMeters: 48.0,
    distanceFromEmbankmentKm: 0.6,
    population: 420,
    vulnerableGroupsCount: 85,
    criticalFloodStageMeters: 53.8,
  },
  {
    id: 'shanti_colony',
    name: 'Shanti Colony (East Island)',
    elevationMeters: 50.0,
    distanceFromEmbankmentKm: 3.5,
    population: 310,
    vulnerableGroupsCount: 45,
    criticalFloodStageMeters: 54.5,
  },
  {
    id: 'purab_ward',
    name: 'Purab Ward (Central Junction)',
    elevationMeters: 52.0,
    distanceFromEmbankmentKm: 4.2,
    population: 650,
    vulnerableGroupsCount: 110,
    criticalFloodStageMeters: 55.2,
  },
];

/**
 * Calculates hydraulic dynamics based on river gauge height.
 */
export function calculateHydraulics(stageMeters: number): RiverHydrologyState {
  const normal = 48.0;
  const warning = 51.5;
  const danger = 53.0;
  const crest = 54.5;

  // Discharge Q in cumecs scales non-linearly with river stage
  const baseDischarge = 7000;
  const head = Math.max(0, stageMeters - normal);
  const discharge = Math.round(baseDischarge + Math.pow(head, 2.1) * 950);

  let breachStatus: 'intact' | 'overtopping' | 'breached' = 'intact';
  let breachWidth = 0;
  let velocity = 0.8;

  if (stageMeters >= crest) {
    breachStatus = 'breached';
    const overtopHead = stageMeters - crest;
    breachWidth = Math.min(120, Math.round(15 + overtopHead * 40));
    velocity = Number((1.8 + overtopHead * 0.9).toFixed(1));
  } else if (stageMeters >= danger) {
    breachStatus = 'overtopping';
    velocity = 1.4;
  }

  // Calculate estimated lead time to lowest settlement (Naya Tola at 1.8km, 45m elevation)
  // Wave travel speed = velocity (m/s) converted to km/h, plus slope acceleration
  const waveSpeedKmh = Math.max(3.0, velocity * 3.6);
  const travelTimeMinutes = Math.max(5, Math.round((1.8 / waveSpeedKmh) * 60));

  // Time remaining before water exceeds crest if rising at 0.15m / 10 min
  const metersUntilCrest = Math.max(0, crest - stageMeters);
  const riseRateMetersPerHour = 0.6; // monsoon rapid crest
  const hoursToCrest = metersUntilCrest / riseRateMetersPerHour;
  const estimatedLeadTimeMinutes = Math.round(hoursToCrest * 60 + travelTimeMinutes);

  return {
    riverStageMeters: Number(stageMeters.toFixed(1)),
    normalLevelMeters: normal,
    warningLevelMeters: warning,
    dangerLevelMeters: danger,
    embankmentCrestMeters: crest,
    dischargeCumecs: discharge,
    breachStatus,
    breachWidthMeters: breachWidth,
    inundationVelocityMs: velocity,
    upstreamRainfallMm24h: Math.round(140 + head * 25),
    damReleaseDischargeCumecs: Math.round(3500 + head * 800),
    estimatedLeadTimeMinutes: Math.min(120, Math.max(10, estimatedLeadTimeMinutes)),
  };
}

/**
 * Calculates flood arrival ETA and vulnerability priority for each settlement.
 */
export function getSettlementVulnerability(currentStage: number) {
  return FLOODPLAIN_SETTLEMENTS.map((settlement, index) => {
    const stageDelta = currentStage - settlement.criticalFloodStageMeters;
    const isSubmerged = stageDelta >= 0;
    const depthCm = isSubmerged ? Math.round(stageDelta * 100) : 0;

    // Remaining lead time before this settlement is breached
    let leadTimeMin = 0;
    if (stageDelta < 0) {
      const riseNeeded = Math.abs(stageDelta);
      leadTimeMin = Math.round((riseNeeded / 0.6) * 60 + settlement.distanceFromEmbankmentKm * 8);
    } else {
      leadTimeMin = 0;
    }

    // Vulnerability score: based on low elevation, high vulnerable count, and small lead time
    const elevPenalty = (55 - settlement.elevationMeters) * 3;
    const vulnPopFactor = settlement.vulnerableGroupsCount * 0.4;
    const leadTimeUrgency = Math.max(0, 100 - leadTimeMin);
    const priorityScore = Math.round(elevPenalty + vulnPopFactor + leadTimeUrgency);

    let riskLabel: 'Critical Evacuation' | 'Severe Threat' | 'Warning' | 'Low Risk' = 'Low Risk';
    if (isSubmerged || leadTimeMin <= 30) {
      riskLabel = 'Critical Evacuation';
    } else if (leadTimeMin <= 60) {
      riskLabel = 'Severe Threat';
    } else if (leadTimeMin <= 120) {
      riskLabel = 'Warning';
    }

    return {
      ...settlement,
      priorityRank: index + 1,
      isSubmerged,
      waterDepthCm: depthCm,
      leadTimeMin,
      priorityScore,
      riskLabel,
    };
  }).sort((a, b) => b.priorityScore - a.priorityScore);
}
