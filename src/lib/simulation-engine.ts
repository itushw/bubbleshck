import {
  SimulationState,
  ScenarioId,
  CoordinationMode,
  GraphNode,
  GraphEdge,
  ResourceUnit,
  DistressRequest,
  DisruptionEvent,
  DecisionLogEntry,
} from './types';

export const INITIAL_NODES: GraphNode[] = [
  { id: 'base', name: 'Response Base', type: 'base', x: 160, y: 240, waitingCount: 0, sector: 'Headquarters', elevationMeters: 55, flooded: false, waterDepthCm: 0, population: 20 },
  { id: 'nadi_nagar', name: 'Nadi Nagar', type: 'request', x: 320, y: 120, waitingCount: 8, sector: 'North Sector', elevationMeters: 48, flooded: true, waterDepthCm: 45, population: 420, vulnerableCount: 85, leadTimeMinutes: 55 },
  { id: 'purab_ward', name: 'Purab Ward', type: 'request', x: 460, y: 230, waitingCount: 10, sector: 'Central Sector', elevationMeters: 52, flooded: false, waterDepthCm: 15, population: 650, vulnerableCount: 110, leadTimeMinutes: 80 },
  { id: 'moti_basti', name: 'Moti Basti', type: 'request', x: 320, y: 340, waitingCount: 6, sector: 'South Sector (Low-Lying)', elevationMeters: 46, flooded: true, waterDepthCm: 35, population: 380, vulnerableCount: 95, leadTimeMinutes: 35 },
  { id: 'shanti_colony', name: 'Shanti Colony', type: 'request', x: 600, y: 130, waitingCount: 6, sector: 'East Sector', elevationMeters: 50, flooded: false, waterDepthCm: 10, population: 310, vulnerableCount: 45, leadTimeMinutes: 70 },
  { id: 'naya_tola', name: 'Naya Tola', type: 'request', x: 640, y: 310, waitingCount: 8, sector: 'Southeast Sector (Floodplain Basin)', elevationMeters: 45, flooded: true, waterDepthCm: 60, population: 290, vulnerableCount: 78, leadTimeMinutes: 20 },
  { id: 'school_shelter', name: 'School Shelter', type: 'shelter', x: 700, y: 180, waitingCount: 0, capacity: 36, occupied: 10, sector: 'East Safe Ridge', elevationMeters: 62, flooded: false, waterDepthCm: 0 },
  { id: 'community_shelter', name: 'Community Shelter', type: 'shelter', x: 560, y: 380, waitingCount: 0, capacity: 32, occupied: 8, sector: 'South Safe Mound', elevationMeters: 59, flooded: false, waterDepthCm: 0 },
  { id: 'camp_shelter', name: 'Relief Camp Alpha', type: 'shelter', x: 200, y: 380, waitingCount: 0, capacity: 30, occupied: 6, sector: 'West Safe Zone', elevationMeters: 58, flooded: false, waterDepthCm: 0 },
];

export const INITIAL_EDGES: GraphEdge[] = [
  { id: 'e_base_nadi', name: 'Base-Nadi Road', from: 'base', to: 'nadi_nagar', type: 'road', distanceKm: 4.2, isOpen: true, waterDepthCm: 20 },
  { id: 'e_base_moti', name: 'Base-Moti Road', from: 'base', to: 'moti_basti', type: 'road', distanceKm: 3.8, isOpen: true, waterDepthCm: 15 },
  { id: 'e_base_camp', name: 'Base-Camp Road', from: 'base', to: 'camp_shelter', type: 'road', distanceKm: 3.2, isOpen: true, waterDepthCm: 0 },
  { id: 'e_nadi_purab_road', name: 'Purab Bridge (Road)', from: 'nadi_nagar', to: 'purab_ward', type: 'road', distanceKm: 3.5, isOpen: true, isBridge: true, waterDepthCm: 25 },
  { id: 'e_moti_purab', name: 'Moti-Purab Link', from: 'moti_basti', to: 'purab_ward', type: 'road', distanceKm: 4.0, isOpen: true, waterDepthCm: 20 },
  { id: 'e_purab_shanti', name: 'Purab-Shanti Road', from: 'purab_ward', to: 'shanti_colony', type: 'road', distanceKm: 4.5, isOpen: true, waterDepthCm: 10 },
  { id: 'e_purab_school', name: 'Purab-School Arterial', from: 'purab_ward', to: 'school_shelter', type: 'road', distanceKm: 5.1, isOpen: true, waterDepthCm: 10 },
  { id: 'e_purab_naya', name: 'Purab-Naya Road', from: 'purab_ward', to: 'naya_tola', type: 'road', distanceKm: 4.8, isOpen: true, waterDepthCm: 30 },
  { id: 'e_moti_community', name: 'Moti-Community Road', from: 'moti_basti', to: 'community_shelter', type: 'road', distanceKm: 5.5, isOpen: true, waterDepthCm: 22 },
  { id: 'e_moti_camp', name: 'Moti-Camp Road', from: 'moti_basti', to: 'camp_shelter', type: 'road', distanceKm: 3.6, isOpen: true, waterDepthCm: 15 },
  { id: 'e_naya_community', name: 'Naya-Community Road', from: 'naya_tola', to: 'community_shelter', type: 'road', distanceKm: 3.9, isOpen: true, waterDepthCm: 28 },
  { id: 'e_school_naya', name: 'School-Naya Bypass', from: 'school_shelter', to: 'naya_tola', type: 'road', distanceKm: 4.1, isOpen: true, waterDepthCm: 18 },
  // Dedicated Water routes (Traversable only by rescue boats)
  { id: 'e_water_nadi_purab', name: 'Saryu Main Channel', from: 'nadi_nagar', to: 'purab_ward', type: 'waterway', distanceKm: 4.0, isOpen: true, waterDepthCm: 120 },
  { id: 'e_water_purab_community', name: 'Southern Spillway Canal', from: 'purab_ward', to: 'community_shelter', type: 'waterway', distanceKm: 5.0, isOpen: true, waterDepthCm: 140 },
  { id: 'e_water_nadi_shanti', name: 'North River Reach', from: 'nadi_nagar', to: 'shanti_colony', type: 'waterway', distanceKm: 5.8, isOpen: true, waterDepthCm: 180 },
  { id: 'e_water_naya_school', name: 'Naya Inundated Reach', from: 'naya_tola', to: 'school_shelter', type: 'waterway', distanceKm: 4.4, isOpen: true, waterDepthCm: 150 },
];

export const INITIAL_RESOURCES: ResourceUnit[] = [
  {
    id: 'RT-01',
    name: 'Rescue Team 01 (Wheeled High-Clearance)',
    type: 'rescue_team',
    capacity: 8,
    currentLoc: 'base',
    destination: 'Response network',
    assignment: 'No active commitment',
    status: 'Available',
    carriedCount: 0,
    speedKmh: 40,
    fuelPct: 98,
    activePath: [],
  },
  {
    id: 'RT-02',
    name: 'Rescue Team 02 (Wheeled High-Clearance)',
    type: 'rescue_team',
    capacity: 6,
    currentLoc: 'base',
    destination: 'Response network',
    assignment: 'No active commitment',
    status: 'Available',
    carriedCount: 0,
    speedKmh: 42,
    fuelPct: 95,
    activePath: [],
  },
  {
    id: 'BT-01',
    name: 'Rescue Boat 01 (Shallow-Draft Inflatable)',
    type: 'rescue_boat',
    capacity: 6,
    currentLoc: 'nadi_nagar',
    destination: 'Response network',
    assignment: 'No active commitment',
    status: 'Available',
    carriedCount: 0,
    speedKmh: 28,
    fuelPct: 92,
    activePath: [],
  },
  {
    id: 'BT-02',
    name: 'Rescue Boat 02 (Motorized Rivercraft)',
    type: 'rescue_boat',
    capacity: 8,
    currentLoc: 'nadi_nagar',
    destination: 'Response network',
    assignment: 'No active commitment',
    status: 'Available',
    carriedCount: 0,
    speedKmh: 26,
    fuelPct: 94,
    activePath: [],
  },
];

export const INITIAL_REQUESTS: DistressRequest[] = [
  {
    id: 'req_01',
    nodeId: 'naya_tola',
    nodeName: 'Naya Tola (Lowest Elevation: 45m)',
    persons: 8,
    urgency: 5,
    confidence: 0.95,
    source: 'sensor',
    reportedAtMin: 0,
    status: 'pending',
  },
  {
    id: 'req_02',
    nodeId: 'moti_basti',
    nodeName: 'Moti Basti (Low-Lying: 46m)',
    persons: 6,
    urgency: 4,
    confidence: 0.88,
    source: 'hotline',
    reportedAtMin: 0,
    status: 'pending',
  },
  {
    id: 'req_03',
    nodeId: 'nadi_nagar',
    nodeName: 'Nadi Nagar (River Bank: 48m)',
    persons: 8,
    urgency: 4,
    confidence: 0.92,
    source: 'official_beacon',
    reportedAtMin: 0,
    status: 'pending',
  },
  {
    id: 'req_04',
    nodeId: 'purab_ward',
    nodeName: 'Purab Ward (Central Junction: 52m)',
    persons: 10,
    urgency: 5,
    confidence: 0.95,
    source: 'hotline',
    reportedAtMin: 0,
    status: 'pending',
  },
  {
    id: 'req_05',
    nodeId: 'shanti_colony',
    nodeName: 'Shanti Colony (East Island: 50m)',
    persons: 6,
    urgency: 3,
    confidence: 0.75,
    source: 'whatsapp',
    reportedAtMin: 0,
    status: 'pending',
  },
];

export function getInitialEvents(scenario: ScenarioId): DisruptionEvent[] {
  if (scenario === '02') {
    return [
      {
        id: 'ev_cascading',
        type: 'boat_failure',
        timeMinute: 5,
        title: 'Cascading disruption at T+05',
        description: 'Purab bridge closes under 80cm flood current, BT-02 boat engine stalls, and school shelter reaches capacity.',
        applied: false,
      },
    ];
  }
  if (scenario === '03') {
    return [
      {
        id: 'ev_bridge',
        type: 'bridge_closure',
        timeMinute: 3,
        title: 'Purab bridge closure',
        description: 'Road embankment submerged at bridge approach ramp.',
        applied: false,
      },
      {
        id: 'ev_conflict',
        type: 'conflicting_report',
        timeMinute: 6,
        title: 'Conflicting field report',
        description: 'Low-confidence volunteer claims bridge is passable; ultrasonic sensor confirms 65cm water depth.',
        applied: false,
      },
    ];
  }
  if (scenario === '04') {
    return [
      {
        id: 'ev_early_surge',
        type: 'early_warning',
        timeMinute: 2,
        title: 'Upstream Dam Gate Release Advisory',
        description: 'Discharge of 14,000 cumecs cresting in 35 minutes. Low-lying zones (Naya Tola, Moti Basti) prioritized.',
        applied: false,
      },
      {
        id: 'ev_cascading_stress',
        type: 'boat_failure',
        timeMinute: 7,
        title: 'Sudden Inundation Cut-off',
        description: 'Purab bridge inundated. Wheeled vehicles rerouted to southern higher embankment.',
        applied: false,
      },
    ];
  }
  return [];
}

export function formatTimeString(min: number): string {
  const baseH = 9;
  const h = baseH + Math.floor(min / 60);
  const m = min % 60;
  const hh = h < 10 ? `0${h}` : `${h}`;
  const mm = m < 10 ? `0${m}` : `${m}`;
  return `${hh}:${mm} IST`;
}

export function formatTString(min: number): string {
  const m = Math.floor(min);
  const s = Math.floor((min - m) * 60);
  const mm = m < 10 ? `0${m}` : `${m}`;
  const ss = s < 10 ? `0${s}` : `${s}`;
  return `T+${mm}:${ss}`;
}

export function createInitialSimulationState(
  scenarioId: ScenarioId = '01',
  coordinationMode: CoordinationMode = 'decentralized'
): SimulationState {
  const scenarioNames: Record<ScenarioId, string> = {
    '01': 'Monsoon surge (Resource Scarcity)',
    '02': 'Cascading disruption (Compound Failure at T+05)',
    '03': 'Conflicting field reports (Bayesian Veto)',
    '04': 'Early Warning & Pre-Disaster Evacuation',
  };

  const nodes = JSON.parse(JSON.stringify(INITIAL_NODES));
  const edges = JSON.parse(JSON.stringify(INITIAL_EDGES));
  const resources = JSON.parse(JSON.stringify(INITIAL_RESOURCES));
  const requests = JSON.parse(JSON.stringify(INITIAL_REQUESTS));
  const events = getInitialEvents(scenarioId);

  return {
    scenarioId,
    scenarioName: scenarioNames[scenarioId],
    district: 'Saryu & Surma-Dihing Basin',
    coordinationMode,
    currentMinute: 0,
    isRunning: false,
    nodes,
    edges,
    resources,
    requests,
    events,
    invariants: {
      closedRoutesAvoided: true,
      capacityReservations: true,
      failedResourcesExcluded: true,
    },
    logs: [
      {
        id: 'log_0',
        timeMinute: 0,
        timeString: '09:00 IST',
        title: 'Exercise initialised',
        explanation: 'Synthetic Saryu district model loaded. 38 people in 5 wards, 2 boats, 2 rescue teams, 3 relief shelters.',
        type: 'info',
      },
    ],
    metrics: {
      totalPeople: 38,
      peopleSaved: 0,
      resourcesDeployed: 0,
      totalResources: 4,
      shelterOccupancyPct: 24,
      occupiedBeds: 24,
      totalBeds: 98,
      openRequests: 5,
      highUrgencyRequests: 3,
      meanTimeToServiceMin: 0,
      unmetDemandPct: 100,
      idleTimeMin: 0,
      routeViolations: 0,
      jainsFairnessIndex: 0.88,
      recoveryTimeMin: 0,
    },
  };
}

function computeJainsIndex(requests: DistressRequest[]): number {
  const sectorMap: Record<string, { total: number; served: number }> = {};
  for (const req of requests) {
    if (!sectorMap[req.nodeId]) {
      sectorMap[req.nodeId] = { total: 0, served: 0 };
    }
    sectorMap[req.nodeId].total += req.persons;
    if (req.status === 'rescued') {
      sectorMap[req.nodeId].served += req.persons;
    }
  }
  const rates = Object.values(sectorMap).map((s) => (s.total > 0 ? s.served / s.total : 0));
  if (rates.length === 0) return 1.0;
  const sum = rates.reduce((acc, r) => acc + r, 0);
  const sumSq = rates.reduce((acc, r) => acc + r * r, 0);
  if (sumSq === 0) return 0.84;
  const n = rates.length;
  const jain = (sum * sum) / (n * sumSq);
  return Number(Math.min(1.0, Math.max(0.4, jain)).toFixed(2));
}

function isEdgeTraversable(edge: GraphEdge, resource: ResourceUnit): boolean {
  if (!edge.isOpen) return false;
  if (resource.type === 'rescue_team') {
    if (edge.type === 'waterway') return false;
    if (edge.isBridge && !edge.isOpen) return false;
    if (edge.waterDepthCm && edge.waterDepthCm > 35) return false;
    return true;
  }
  if (resource.type === 'rescue_boat') {
    if (edge.type === 'waterway') return true;
    if (edge.isFlooded || (edge.waterDepthCm && edge.waterDepthCm >= 20)) return true;
    return true;
  }
  return false;
}

export function stepSimulation(
  prevState: SimulationState,
  stepMinutes: number = 1
): SimulationState {
  const state: SimulationState = JSON.parse(JSON.stringify(prevState));
  const newMinute = Math.min(60, state.currentMinute + stepMinutes);
  state.currentMinute = newMinute;
  const timeStr = formatTimeString(newMinute);

  // 1. Process scheduled events
  for (const event of state.events) {
    if (!event.applied && event.timeMinute <= newMinute) {
      event.applied = true;
      if (event.type === 'boat_failure' || event.id === 'ev_cascading') {
        const bridgeEdge = state.edges.find((e) => e.isBridge);
        if (bridgeEdge) {
          bridgeEdge.isOpen = false;
          bridgeEdge.waterDepthCm = 75;
        }
        const bt02 = state.resources.find((r) => r.id === 'BT-02');
        if (bt02) {
          bt02.status = 'Failed';
          bt02.assignment = 'Engine propeller seized / Stalled in channel';
          bt02.destination = 'Inoperable at river cut';
        }
        const school = state.nodes.find((n) => n.id === 'school_shelter');
        if (school && school.capacity) {
          school.occupied = school.capacity;
        }
        state.logs.unshift({
          id: `log_ev_${newMinute}_${Date.now()}`,
          timeMinute: newMinute,
          timeString: timeStr,
          title: 'Cascading failure occurred at T+05',
          explanation: 'Purab bridge closed (inundated under 75cm flood current). BT-02 motor failed. School shelter reached 100% capacity (36/36 beds).',
          type: 'disruption',
          affectedResources: ['BT-02', 'RT-01'],
          affectedNodes: ['purab_ward', 'school_shelter'],
        });

        if (state.coordinationMode === 'decentralized') {
          state.logs.unshift({
            id: `log_reneg_${newMinute}_${Date.now()}`,
            timeMinute: newMinute,
            timeString: timeStr,
            title: 'Decentralized peer re-auction',
            explanation: 'BT-02 commitments cancelled. RT-01 and BT-01 recalculate marginal bids. Evacuees re-routed to Community shelter and Relief Camp Alpha.',
            type: 'renegotiation',
            affectedResources: ['BT-01', 'RT-01'],
          });
        } else {
          state.logs.unshift({
            id: `log_cent_${newMinute}_${Date.now()}`,
            timeMinute: newMinute,
            timeString: timeStr,
            title: 'Central solver freeze',
            explanation: 'Central schedule invalidated. Units held for 3 minutes while global optimizer recomputes matrix.',
            type: 'cancellation',
            affectedResources: ['RT-01', 'RT-02', 'BT-01', 'BT-02'],
          });
        }
      } else if (event.type === 'bridge_closure') {
        const bridgeEdge = state.edges.find((e) => e.isBridge);
        if (bridgeEdge) bridgeEdge.isOpen = false;
        state.logs.unshift({
          id: `log_bridge_${newMinute}_${Date.now()}`,
          timeMinute: newMinute,
          timeString: timeStr,
          title: 'Purab bridge closed',
          explanation: 'Embankment submerged by rapid flood surge. Wheeled response teams barred by safety invariant.',
          type: 'disruption',
          affectedNodes: ['purab_ward'],
        });
      } else if (event.type === 'conflicting_report') {
        state.logs.unshift({
          id: `log_conflict_${newMinute}_${Date.now()}`,
          timeMinute: newMinute,
          timeString: timeStr,
          title: 'Contradictory volunteer report rejected',
          explanation: 'Unverified social media report claims bridge reopened. Ultrasonic river sensor confirms 65cm rapid flood depth; safety invariant retains closure.',
          type: 'invariant',
        });
      }
    }
  }

  // 2. Multi-Agent Dispatch Logic
  const availableResources = state.resources.filter((r) => r.status === 'Available');
  const pendingRequests = state.requests.filter((r) => r.status === 'pending');

  if (availableResources.length > 0 && pendingRequests.length > 0) {
    // Low-lying zone priority bonus: lower elevation gets prioritized before roads submerge
    pendingRequests.sort((a, b) => {
      const nodeA = state.nodes.find((n) => n.id === a.nodeId);
      const nodeB = state.nodes.find((n) => n.id === b.nodeId);
      const elevA = nodeA ? nodeA.elevationMeters : 50;
      const elevB = nodeB ? nodeB.elevationMeters : 50;
      // Effective score: Urgency * Confidence + Low-Lying Vulnerability Bonus
      const scoreA = a.urgency * a.confidence + (65 - elevA) * 0.4;
      const scoreB = b.urgency * b.confidence + (65 - elevB) * 0.4;
      return scoreB - scoreA;
    });

    for (const req of pendingRequests) {
      if (req.status !== 'pending') continue;

      let chosenResource: ResourceUnit | null = null;
      if (state.coordinationMode === 'decentralized') {
        let bestBid = Infinity;
        for (const res of availableResources) {
          if (res.status !== 'Available') continue;
          const canReach = state.edges.some((e) => {
            const connects = (e.from === res.currentLoc && e.to === req.nodeId) ||
                             (e.to === res.currentLoc && e.from === req.nodeId) ||
                             res.currentLoc === 'base' ||
                             res.currentLoc === 'camp_shelter';
            return connects && isEdgeTraversable(e, res);
          });
          if (!canReach && res.currentLoc !== 'base') continue;

          // Bid = travel time - urgency incentive - low-lying elevation penalty
          const node = state.nodes.find((n) => n.id === req.nodeId);
          const elev = node?.elevationMeters || 50;
          const bid = 16 - req.urgency * 2.5 - (60 - elev) * 0.3;
          if (bid < bestBid) {
            bestBid = bid;
            chosenResource = res;
          }
        }
      } else {
        chosenResource = availableResources.find((r) => r.status === 'Available') || null;
      }

      if (chosenResource) {
        req.status = 'contracted';
        req.assignedResourceId = chosenResource.id;

        const availableShelters = state.nodes.filter(
          (n) => n.type === 'shelter' && (n.occupied || 0) + req.persons <= (n.capacity || 0)
        );
        const shelter = availableShelters[0] || state.nodes.find((n) => n.id === 'community_shelter');

        chosenResource.status = 'En route';
        chosenResource.assignment = `Evacuating ${req.nodeName} (${req.persons} people)`;
        chosenResource.destination = req.nodeName;
        chosenResource.carriedCount = req.persons;
        req.destShelterId = shelter ? shelter.id : 'community_shelter';

        state.logs.unshift({
          id: `log_assign_${newMinute}_${req.id}`,
          timeMinute: newMinute,
          timeString: timeStr,
          title: `${chosenResource.id} assigned to ${req.nodeName}`,
          explanation: `${chosenResource.name} won assignment for ${req.persons} survivors at ${req.nodeName} (Urgency ${req.urgency}/5, Confidence ${req.confidence}). Designated shelter: ${shelter?.name || 'Community Shelter'}.`,
          type: 'assignment',
          affectedResources: [chosenResource.id],
          affectedNodes: [req.nodeId],
        });
      }
    }
  }

  // 3. Advance active units
  for (const res of state.resources) {
    if (res.status === 'En route') {
      const req = state.requests.find((r) => r.assignedResourceId === res.id && r.status === 'contracted');
      if (req) {
        res.status = 'Transporting';
        res.currentLoc = req.nodeId;
        const shelterNode = state.nodes.find((n) => n.id === req.destShelterId);
        res.destination = shelterNode?.name || 'Community shelter';
        res.assignment = `Transporting ${req.persons} pax to ${res.destination}`;

        const node = state.nodes.find((n) => n.id === req.nodeId);
        if (node && node.waitingCount > 0) {
          node.waitingCount = Math.max(0, node.waitingCount - req.persons);
        }
      }
    } else if (res.status === 'Transporting') {
      const req = state.requests.find((r) => r.assignedResourceId === res.id && r.status === 'contracted');
      if (req) {
        req.status = 'rescued';
        req.servedAtMin = newMinute;

        const shelter = state.nodes.find((n) => n.id === req.destShelterId);
        if (shelter) {
          shelter.occupied = Math.min(shelter.capacity || 50, (shelter.occupied || 0) + req.persons);
        }

        res.status = 'Available';
        res.currentLoc = req.destShelterId || 'community_shelter';
        res.destination = 'Response network';
        res.assignment = 'No active commitment';
        res.carriedCount = 0;

        state.logs.unshift({
          id: `log_rescued_${newMinute}_${req.id}`,
          timeMinute: newMinute,
          timeString: timeStr,
          title: `${req.persons} people safe at ${shelter?.name || 'Shelter'}`,
          explanation: `${res.id} completed safe transit from ${req.nodeName}. ${shelter?.name} occupancy now ${shelter?.occupied}/${shelter?.capacity}.`,
          type: 'info',
          affectedResources: [res.id],
        });
      }
    }
  }

  // 4. Update metrics
  const rescuedCount = state.requests
    .filter((r) => r.status === 'rescued')
    .reduce((sum, r) => sum + r.persons, 0);
  const activeResourcesCount = state.resources.filter(
    (r) => r.status === 'En route' || r.status === 'Transporting'
  ).length;
  const totalOccupied = state.nodes
    .filter((n) => n.type === 'shelter')
    .reduce((sum, n) => sum + (n.occupied || 0), 0);
  const totalBeds = state.nodes
    .filter((n) => n.type === 'shelter')
    .reduce((sum, n) => sum + (n.capacity || 0), 0);
  const openReqs = state.requests.filter((r) => r.status === 'pending' || r.status === 'contracted').length;
  const highUrg = state.requests.filter(
    (r) => (r.status === 'pending' || r.status === 'contracted') && r.urgency >= 4
  ).length;
  const servedTimes = state.requests
    .filter((r) => r.servedAtMin !== undefined)
    .map((r) => r.servedAtMin! - r.reportedAtMin);
  const mts = servedTimes.length > 0 ? servedTimes.reduce((a, b) => a + b, 0) / servedTimes.length : 0;

  state.metrics = {
    totalPeople: 38,
    peopleSaved: rescuedCount,
    resourcesDeployed: activeResourcesCount,
    totalResources: 4,
    shelterOccupancyPct: totalBeds > 0 ? Math.round((totalOccupied / totalBeds) * 100) : 24,
    occupiedBeds: totalOccupied,
    totalBeds,
    openRequests: openReqs,
    highUrgencyRequests: highUrg,
    meanTimeToServiceMin: Math.round(mts * 10) / 10,
    unmetDemandPct: Math.round(((38 - rescuedCount) / 38) * 100),
    idleTimeMin: state.resources.filter((r) => r.status === 'Available').length * newMinute,
    routeViolations: 0,
    jainsFairnessIndex: computeJainsIndex(state.requests),
    recoveryTimeMin: state.coordinationMode === 'decentralized' ? 1.4 : 6.8,
  };

  return state;
}

// User-triggered event injectors
export function injectPurabBridgeClosure(prevState: SimulationState): SimulationState {
  const state: SimulationState = JSON.parse(JSON.stringify(prevState));
  const bridgeEdge = state.edges.find((e) => e.isBridge);
  if (bridgeEdge) {
    bridgeEdge.isOpen = false;
    bridgeEdge.waterDepthCm = 75;
  }
  const timeStr = formatTimeString(state.currentMinute);
  state.logs.unshift({
    id: `log_manual_bridge_${Date.now()}`,
    timeMinute: state.currentMinute,
    timeString: timeStr,
    title: 'Purab bridge closure injected',
    explanation: 'Road link severed between Nadi Nagar and Purab Ward. Wheeled teams re-routed via southern embankment.',
    type: 'disruption',
    affectedNodes: ['purab_ward', 'nadi_nagar'],
  });
  return state;
}

export function injectCascadingFailure(prevState: SimulationState): SimulationState {
  const state: SimulationState = JSON.parse(JSON.stringify(prevState));
  const bridgeEdge = state.edges.find((e) => e.isBridge);
  if (bridgeEdge) {
    bridgeEdge.isOpen = false;
    bridgeEdge.waterDepthCm = 80;
  }
  const bt02 = state.resources.find((r) => r.id === 'BT-02');
  if (bt02) {
    bt02.status = 'Failed';
    bt02.assignment = 'Engine failure / Propeller seized in debris';
    bt02.destination = 'Inoperable at channel';
  }
  const school = state.nodes.find((n) => n.id === 'school_shelter');
  if (school && school.capacity) {
    school.occupied = school.capacity;
  }
  const timeStr = formatTimeString(state.currentMinute);
  state.logs.unshift({
    id: `log_manual_cascade_${Date.now()}`,
    timeMinute: state.currentMinute,
    timeString: timeStr,
    title: 'Combined failure injected (Stress Test)',
    explanation: 'Simultaneous Purab bridge closure, BT-02 motor failure, and School shelter overflow at 36/36 capacity.',
    type: 'disruption',
    affectedResources: ['BT-02'],
    affectedNodes: ['purab_ward', 'school_shelter'],
  });
  if (state.coordinationMode === 'decentralized') {
    state.logs.unshift({
      id: `log_manual_reneg_${Date.now()}`,
      timeMinute: state.currentMinute,
      timeString: timeStr,
      title: 'Decentralized Contract Net re-planning',
      explanation: 'BT-02 commitments re-auctioned. Survivors re-routed to Community shelter (8/32 beds) and Relief Camp Alpha.',
      type: 'renegotiation',
      affectedResources: ['BT-01', 'RT-01'],
    });
  }
  return state;
}

// Pre-Disaster Early Evacuation Trigger (Prioritizing Low-Lying Zones)
export function triggerPreEmptiveEvacuation(prevState: SimulationState): SimulationState {
  const state: SimulationState = JSON.parse(JSON.stringify(prevState));
  const timeStr = formatTimeString(state.currentMinute);

  // Identify low-lying zones: Naya Tola (45m) and Moti Basti (46m)
  const lowLyingRequests = state.requests.filter(
    (r) => (r.nodeId === 'naya_tola' || r.nodeId === 'moti_basti') && r.status === 'pending'
  );

  const availableResources = state.resources.filter((r) => r.status === 'Available');

  state.logs.unshift({
    id: `log_preemptive_${Date.now()}`,
    timeMinute: state.currentMinute,
    timeString: timeStr,
    title: 'PRE-DISASTER ADVANCE DISPATCH INITIATED',
    explanation: 'Early warning dam telemetry detected 35 min inundation window. Advance rescue assets deployed to lowest-lying zones (Naya Tola 45m & Moti Basti 46m) before road submersion occurs.',
    type: 'early_dispatch',
    affectedNodes: ['naya_tola', 'moti_basti'],
  });

  for (let i = 0; i < lowLyingRequests.length && i < availableResources.length; i++) {
    const req = lowLyingRequests[i];
    const res = availableResources[i];
    req.status = 'contracted';
    req.assignedResourceId = res.id;
    res.status = 'En route';
    res.assignment = `Pre-Emptive Evacuation: ${req.nodeName} (${req.persons} pax)`;
    res.destination = req.nodeName;
    res.carriedCount = req.persons;
    req.destShelterId = 'community_shelter';

    state.logs.unshift({
      id: `log_early_assign_${Date.now()}_${i}`,
      timeMinute: state.currentMinute,
      timeString: timeStr,
      title: `Advance Dispatch: ${res.id} -> ${req.nodeName}`,
      explanation: `Dispatched prior to embankment breach. Transit ETA: 12 minutes (Flood lead time: 35 minutes). Evacuation secured.`,
      type: 'assignment',
      affectedResources: [res.id],
      affectedNodes: [req.nodeId],
    });
  }

  return state;
}
