export type NodeType = 'request' | 'shelter' | 'base';
export type EdgeType = 'road' | 'waterway';
export type ResourceType = 'rescue_team' | 'rescue_boat';
export type ResourceStatus = 'Available' | 'En route' | 'Transporting' | 'Failed';
export type CoordinationMode = 'decentralized' | 'centralized';
export type ScenarioId = '01' | '02' | '03' | '04';

export interface GraphNode {
  id: string;
  name: string;
  type: NodeType;
  x: number;
  y: number;
  waitingCount: number;
  capacity?: number;
  occupied?: number;
  elevationMeters: number;
  flooded?: boolean;
  waterDepthCm?: number;
  sector?: string;
  population?: number;
  vulnerableCount?: number; // elders, children, patients
  leadTimeMinutes?: number; // estimated minutes until complete flood inundation
}

export interface GraphEdge {
  id: string;
  name?: string;
  from: string;
  to: string;
  type: EdgeType;
  distanceKm: number;
  isOpen: boolean;
  isBridge?: boolean;
  isFlooded?: boolean;
  waterDepthCm?: number;
}

export interface ResourceUnit {
  id: string;
  name: string;
  type: ResourceType;
  capacity: number;
  currentLoc: string;
  destination: string;
  assignment: string;
  status: ResourceStatus;
  carriedCount: number;
  speedKmh: number;
  fuelPct: number;
  activePath: string[];
}

export interface DistressRequest {
  id: string;
  nodeId: string;
  nodeName: string;
  persons: number;
  urgency: number; // 1 (low) to 5 (critical)
  confidence: number; // 0.1 to 1.0
  source: 'hotline' | 'satellite' | 'whatsapp' | 'official_beacon' | 'sensor';
  reportedAtMin: number;
  servedAtMin?: number;
  status: 'pending' | 'contracted' | 'rescued' | 'rerouted';
  assignedResourceId?: string;
  destShelterId?: string;
  contradicted?: boolean;
}

export interface DisruptionEvent {
  id: string;
  type: 'bridge_closure' | 'boat_failure' | 'shelter_overflow' | 'conflicting_report' | 'early_warning';
  timeMinute: number;
  title: string;
  description: string;
  applied: boolean;
}

export interface DecisionLogEntry {
  id: string;
  timeMinute: number;
  timeString: string; // e.g. "09:04 IST"
  title: string;
  explanation: string;
  type: 'assignment' | 'renegotiation' | 'cancellation' | 'disruption' | 'invariant' | 'info' | 'early_dispatch';
  affectedResources?: string[];
  affectedNodes?: string[];
}

export interface SafetyInvariants {
  closedRoutesAvoided: boolean;
  capacityReservations: boolean;
  failedResourcesExcluded: boolean;
}

export interface SimulationState {
  scenarioId: ScenarioId;
  scenarioName: string;
  district: string;
  coordinationMode: CoordinationMode;
  currentMinute: number; // 0 to 60
  isRunning: boolean;
  nodes: GraphNode[];
  edges: GraphEdge[];
  resources: ResourceUnit[];
  requests: DistressRequest[];
  events: DisruptionEvent[];
  logs: DecisionLogEntry[];
  invariants: SafetyInvariants;
  metrics: {
    totalPeople: number;
    peopleSaved: number;
    resourcesDeployed: number;
    totalResources: number;
    shelterOccupancyPct: number;
    occupiedBeds: number;
    totalBeds: number;
    openRequests: number;
    highUrgencyRequests: number;
    meanTimeToServiceMin: number;
    unmetDemandPct: number;
    idleTimeMin: number;
    routeViolations: number;
    jainsFairnessIndex: number;
    recoveryTimeMin: number;
  };
}

// Hydrological River Overflow State
export interface RiverHydrologyState {
  riverStageMeters: number; // e.g. 48.0m to 56.5m
  normalLevelMeters: number; // 48.0m
  warningLevelMeters: number; // 51.5m
  dangerLevelMeters: number; // 53.0m
  embankmentCrestMeters: number; // 54.5m
  dischargeCumecs: number; // m^3/sec
  breachStatus: 'intact' | 'overtopping' | 'breached';
  breachWidthMeters: number;
  inundationVelocityMs: number; // water spreading speed in m/s
  upstreamRainfallMm24h: number;
  damReleaseDischargeCumecs: number;
  estimatedLeadTimeMinutes: number; // Time until low-lying floodplain inundates
}

// Regional Risk Map Overlay Types
export interface RiskZone {
  id: string;
  name: string;
  elevation: number;
  riskLevel: 'Extreme' | 'High' | 'Moderate' | 'Safe';
  projectedDepthCm: number;
  populationAtRisk: number;
  evacuationPriority: number; // 1 (Highest) to 5
  timeToFloodingMinutes: number;
  coordinates: { x: number; y: number; lat: number; lng: number };
}

// Shelter & Geolocation Types
export interface SafeShelter {
  id: string;
  name: string;
  type: 'school' | 'community' | 'hospital' | 'stadium';
  address: string;
  elevationMeters: number;
  capacity: number;
  occupied: number;
  availableBeds: number;
  hasMedicalPost: boolean;
  hasDrinkingWater: boolean;
  hasBackupPower: boolean;
  vhfRadioChannel: string;
  phoneContact: string;
  coordinates: { lat: number; lng: number; x: number; y: number };
  distanceKm?: number;
  etaWalkingMin?: number;
  etaVehicleMin?: number;
}

export interface UserGeoLocation {
  lat: number;
  lng: number;
  nearestWard: string;
  accuracyMeters?: number;
  isSimulated: boolean;
}

export interface EmergencyAlert {
  id: string;
  level: 'CRITICAL_RED' | 'WARNING_ORANGE' | 'ADVISORY_YELLOW';
  title: string;
  timestamp: string;
  affectedZones: string[];
  actionRequired: string;
  source: string;
  evacuationMandatory: boolean;
}

// Offline Safety Pack
export interface OfflineSafetyPack {
  lastUpdated: string;
  evacuationChecklist: Array<{ id: string; category: string; item: string; checked: boolean }>;
  emergencyContacts: Array<{ agency: string; phone: string; frequency: string; operationalRole: string }>;
  offlineShelters: SafeShelter[];
  firstAidGuide: Array<{ title: string; steps: string[] }>;
}

// AI Chatbot Types
export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedActions?: Array<{ label: string; action: string; targetId?: string }>;
}
