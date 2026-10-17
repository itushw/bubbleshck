import React, { useState } from 'react';
import { Layers, Eye, Shield, AlertTriangle, Waves, Compass, Activity, Navigation } from 'lucide-react';
import { RiskZone } from '../lib/types';
import CesiumTerrainView from './CesiumTerrainView';

interface DynamicRiskMapOverlayProps {
  riverStageMeters: number;
  onSelectZone?: (zone: RiskZone) => void;
}

const REGIONAL_ZONES: RiskZone[] = [
  {
    id: 'z_naya_tola',
    name: 'Naya Tola Basin',
    elevation: 45.0,
    riskLevel: 'Extreme',
    projectedDepthCm: 65,
    populationAtRisk: 290,
    evacuationPriority: 1,
    timeToFloodingMinutes: 20,
    coordinates: { x: 580, y: 310, lat: 26.782, lng: 82.222 },
  },
  {
    id: 'z_moti_basti',
    name: 'Moti Basti Lowlands',
    elevation: 46.2,
    riskLevel: 'High',
    projectedDepthCm: 45,
    populationAtRisk: 380,
    evacuationPriority: 2,
    timeToFloodingMinutes: 35,
    coordinates: { x: 280, y: 340, lat: 26.776, lng: 82.19 },
  },
  {
    id: 'z_nadi_nagar',
    name: 'Nadi Nagar Embankment',
    elevation: 48.0,
    riskLevel: 'High',
    projectedDepthCm: 40,
    populationAtRisk: 420,
    evacuationPriority: 3,
    timeToFloodingMinutes: 55,
    coordinates: { x: 280, y: 120, lat: 26.802, lng: 82.191 },
  },
  {
    id: 'z_shanti_colony',
    name: 'Shanti Colony Char',
    elevation: 50.0,
    riskLevel: 'Moderate',
    projectedDepthCm: 15,
    populationAtRisk: 310,
    evacuationPriority: 4,
    timeToFloodingMinutes: 75,
    coordinates: { x: 680, y: 130, lat: 26.809, lng: 82.218 },
  },
  {
    id: 'z_purab_ward',
    name: 'Purab Ward Central',
    elevation: 52.0,
    riskLevel: 'Moderate',
    projectedDepthCm: 10,
    populationAtRisk: 650,
    evacuationPriority: 5,
    timeToFloodingMinutes: 110,
    coordinates: { x: 440, y: 220, lat: 26.791, lng: 82.205 },
  },
  {
    id: 'z_school_ridge',
    name: 'School Shelter Highland Ridge',
    elevation: 62.0,
    riskLevel: 'Safe',
    projectedDepthCm: 0,
    populationAtRisk: 0,
    evacuationPriority: 0,
    timeToFloodingMinutes: 999,
    coordinates: { x: 740, y: 170, lat: 26.805, lng: 82.228 },
  },
  {
    id: 'z_community_mound',
    name: 'Community Shelter Mound',
    elevation: 59.0,
    riskLevel: 'Safe',
    projectedDepthCm: 0,
    populationAtRisk: 0,
    evacuationPriority: 0,
    timeToFloodingMinutes: 999,
    coordinates: { x: 540, y: 390, lat: 26.772, lng: 82.215 },
  },
];

export default function DynamicRiskMapOverlay({
  riverStageMeters,
  onSelectZone,
}: DynamicRiskMapOverlayProps) {
  // 2D vs 3D Mode
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  // Layer toggles
  const [showInundationHeatmap, setShowInundationHeatmap] = useState(true);
  const [showFlowVectors, setShowFlowVectors] = useState(true);
  const [showElevationContours, setShowElevationContours] = useState(true);
  const [showSensors, setShowSensors] = useState(true);
  const [selectedZone, setSelectedZone] = useState<RiskZone>(REGIONAL_ZONES[0]);

  const handleZoneClick = (z: RiskZone) => {
    setSelectedZone(z);
    if (onSelectZone) onSelectZone(z);
  };

  return (
    <div className="bg-white border border-neutral-300 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-semibold mb-1 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Multi-Spectral Spatial Telemetry</span>
          </div>
          <h2 className="text-2xl font-serif text-neutral-900 tracking-tight">
            Dynamic Regional Flood Risk Map Overlay
          </h2>
          <p className="text-xs text-neutral-600 mt-1 max-w-2xl leading-relaxed">
            Multi-spectral topographical overlay showing live inundation depth contours, river overflow flow vectors, and vulnerable low-lying depressions around the Saryu basin in 2D and 3D CesiumJS satellite terrain.
          </p>
        </div>

        {/* 2D vs 3D Mode Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex border border-neutral-300 bg-neutral-100 p-0.5 text-xs font-mono">
            <button
              onClick={() => setViewMode('2d')}
              className={`px-3 py-1.5 cursor-pointer transition-colors ${
                viewMode === '2d'
                  ? 'bg-neutral-900 text-white font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              2D Tactical Overlay
            </button>
            <button
              onClick={() => setViewMode('3d')}
              className={`px-3 py-1.5 cursor-pointer transition-colors flex items-center gap-1.5 ${
                viewMode === '3d'
                  ? 'bg-neutral-900 text-white font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <span>3D Cesium Satellite</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            </button>
          </div>
        </div>
      </div>

      {viewMode === '3d' ? (
        <div className="border border-neutral-800 bg-[#0F172A]">
          <CesiumTerrainView
            riverStageMeters={riverStageMeters}
            className="h-[520px]"
            focusTarget={selectedZone.id}
          />
        </div>
      ) : (
        /* Main 2D Map Canvas + Inspector Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Vector Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-[#151D26] border border-neutral-800 p-4 relative overflow-hidden select-none">
          <div className="absolute top-3 left-4 text-xs font-mono text-neutral-400 z-10 flex items-center gap-3">
            <span className="text-neutral-200 font-bold">REGIONAL TOPOGRAPHIC RISK OVERLAY</span>
            <span>•</span>
            <span className="text-amber-400">Stage: {riverStageMeters.toFixed(1)}m</span>
          </div>

          <div className="absolute top-3 right-4 text-[11px] font-mono text-neutral-400 z-10">
            Scale: 1:25,000 High-Res DEM
          </div>

          <svg viewBox="0 0 860 480" className="w-full h-auto max-h-[480px]">
            <defs>
              {/* Extreme Flood Zone Gradient */}
              <radialGradient id="extremeFloodZone" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#DC2626" stopOpacity="0.55" />
                <stop offset="70%" stopColor="#DC2626" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
              </radialGradient>
              {/* Moderate Flood Zone Gradient */}
              <radialGradient id="moderateFloodZone" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#EA580C" stopOpacity="0.45" />
                <stop offset="80%" stopColor="#EA580C" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
              </radialGradient>
              {/* Safe High Ground Gradient */}
              <radialGradient id="safeHighGround" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Background Map Grid */}
            <pattern id="gridLarge" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
            </pattern>
            <rect width="860" height="480" fill="url(#gridLarge)" />

            {/* River Main Channel */}
            <path
              d="M 380 0 Q 320 100 370 200 T 450 320 Q 500 400 480 480 L 410 480 Q 430 400 390 320 T 300 200 Q 250 100 310 0 Z"
              fill="#1E3A5F"
              opacity="0.9"
            />

            {/* Elevation Contours Layer */}
            {showElevationContours && (
              <g opacity="0.6">
                {/* 45m Contour Line (Lowest Depression around Naya Tola) */}
                <ellipse cx="580" cy="310" rx="90" ry="60" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4,3" />
                <text x="500" y="315" fill="#EF4444" fontSize="9" fontFamily="monospace">45m Contour</text>

                {/* 46.2m Contour Line (Moti Basti) */}
                <ellipse cx="280" cy="340" rx="80" ry="50" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="4,3" />
                <text x="210" y="345" fill="#F59E0B" fontSize="9" fontFamily="monospace">46m Contour</text>

                {/* 50m Contour Line (Central Purab) */}
                <path d="M 150 180 Q 380 260 700 200" fill="none" stroke="#94A3B8" strokeWidth="1" strokeDasharray="6,4" />
                <text x="710" y="200" fill="#94A3B8" fontSize="9" fontFamily="monospace">50m Ridge</text>

                {/* 60m High Safe Ridge (School Shelter) */}
                <ellipse cx="740" cy="170" rx="75" ry="45" fill="none" stroke="#10B981" strokeWidth="1.5" />
                <text x="750" y="140" fill="#10B981" fontSize="9" fontFamily="monospace">60m High Ground</text>
              </g>
            )}

            {/* Inundation Depth Heatmap Layer */}
            {showInundationHeatmap && (
              <g>
                {/* Naya Tola Basin (Extreme Flood: 65cm) */}
                <circle cx="580" cy="310" r="95" fill="url(#extremeFloodZone)" />
                {/* Moti Basti Lowlands (Severe Flood: 45cm) */}
                <circle cx="280" cy="340" r="85" fill="url(#extremeFloodZone)" />
                {/* Nadi Nagar Riverbank (Severe Flood: 40cm) */}
                <circle cx="280" cy="120" r="75" fill="url(#moderateFloodZone)" />
                {/* Safe High Grounds */}
                <circle cx="740" cy="170" r="80" fill="url(#safeHighGround)" />
                <circle cx="540" cy="390" r="65" fill="url(#safeHighGround)" />
              </g>
            )}

            {/* River Overflow Discharge Vectors */}
            {showFlowVectors && (
              <g stroke="#38BDF8" strokeWidth="2" opacity="0.85">
                {/* Flow arrows along main river */}
                <path d="M 345 50 L 350 90 M 345 80 L 350 90 L 355 80" fill="none" />
                <path d="M 370 180 L 390 230 M 383 222 L 390 230 L 395 220" fill="none" />
                <path d="M 430 330 L 460 390 M 452 382 L 460 390 L 465 380" fill="none" />
                {/* Breach spill vectors into Naya Tola low basin */}
                <path d="M 440 280 Q 500 290 560 305 M 550 300 L 560 305 L 552 312" stroke="#EF4444" strokeWidth="2.5" fill="none" />
                <text x="475" y="275" fill="#FCA5A5" fontSize="9" fontFamily="monospace">Spill Vector: 1.4 m/s</text>
                {/* Embankment breach vector into Moti Basti */}
                <path d="M 320 270 Q 290 295 270 330 M 274 320 L 270 330 L 279 328" stroke="#EF4444" strokeWidth="2.5" fill="none" />
              </g>
            )}

            {/* Ultrasonic Sensor Stations */}
            {showSensors && (
              <g>
                {/* Sensor 1: Purab Bridge Gauge */}
                <g transform="translate(360, 210)">
                  <circle cx="0" cy="0" r="7" fill="#1E293B" stroke="#F59E0B" strokeWidth="2" />
                  <circle cx="0" cy="0" r="3" fill="#F59E0B" className="animate-pulse" />
                  <text x="12" y="4" fill="#FDE68A" fontSize="9" fontFamily="monospace">
                    GAUGE-01: {riverStageMeters.toFixed(1)}m (RISING)
                  </text>
                </g>
                {/* Sensor 2: Naya Tola Lowland Flood Sensor */}
                <g transform="translate(630, 270)">
                  <circle cx="0" cy="0" r="7" fill="#1E293B" stroke="#EF4444" strokeWidth="2" />
                  <circle cx="0" cy="0" r="3" fill="#EF4444" className="animate-ping" />
                  <text x="12" y="4" fill="#FCA5A5" fontSize="9" fontFamily="monospace">
                    GAUGE-02: 60cm DEPTH (CRITICAL)
                  </text>
                </g>
              </g>
            )}

            {/* Zone Clickable Markers */}
            {REGIONAL_ZONES.map((zone) => {
              const isSelected = selectedZone.id === zone.id;
              const isSafe = zone.riskLevel === 'Safe';
              const isExtreme = zone.riskLevel === 'Extreme';

              return (
                <g
                  key={zone.id}
                  transform={`translate(${zone.coordinates.x}, ${zone.coordinates.y})`}
                  className="cursor-pointer transition-transform hover:scale-110"
                  onClick={() => handleZoneClick(zone)}
                >
                  <circle
                    cx="0"
                    cy="0"
                    r={isSelected ? "14" : "10"}
                    fill={isSafe ? '#065F46' : isExtreme ? '#991B1B' : '#9A3412'}
                    stroke={isSelected ? '#FFFFFF' : isSafe ? '#34D399' : '#F87171'}
                    strokeWidth={isSelected ? '2.5' : '1.5'}
                  />
                  <text
                    x="0"
                    y="4"
                    fill="#FFF"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {isSafe ? 'S' : zone.evacuationPriority}
                  </text>
                  <text
                    x="0"
                    y="-16"
                    fill="#F8FAFC"
                    fontSize="11"
                    fontWeight="600"
                    textAnchor="middle"
                    fontFamily="sans-serif"
                  >
                    {zone.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Bottom Map Legend */}
          <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-neutral-400 border-t border-neutral-800 pt-2.5 mt-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block"></span>
                <span>Extreme Risk (&gt;60cm Depth)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block"></span>
                <span>Moderate Risk (15-60cm)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
                <span>Safe High Ground</span>
              </span>
            </div>
            <span className="text-neutral-500">Click any sector marker to inspect</span>
          </div>
        </div>

        {/* Zone Telemetry Inspector Panel (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between border border-neutral-300 p-5 bg-neutral-50">
          <div>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">
                  Sector Telemetry Inspector
                </span>
                <h3 className="font-serif font-bold text-lg text-neutral-900">
                  {selectedZone.name}
                </h3>
              </div>
              <span className={`px-2.5 py-1 text-xs font-mono font-bold uppercase ${
                selectedZone.riskLevel === 'Extreme'
                  ? 'bg-red-600 text-white'
                  : selectedZone.riskLevel === 'High'
                  ? 'bg-amber-600 text-white'
                  : selectedZone.riskLevel === 'Safe'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-neutral-200 text-neutral-800'
              }`}>
                {selectedZone.riskLevel}
              </span>
            </div>

            <div className="space-y-3.5 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-neutral-200">
                <span className="text-neutral-600">Terrain Elevation:</span>
                <span className="font-bold text-neutral-900">{selectedZone.elevation} m MSL</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-200">
                <span className="text-neutral-600">Projected Flood Depth:</span>
                <span className="font-bold text-red-700">{selectedZone.projectedDepthCm} cm</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-200">
                <span className="text-neutral-600">Population at Risk:</span>
                <span className="font-bold text-neutral-900">{selectedZone.populationAtRisk} persons</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-200">
                <span className="text-neutral-600">Lead Time to Flooding:</span>
                <span className="font-bold text-amber-800">
                  {selectedZone.timeToFloodingMinutes > 200 ? 'Safe / Non-Flood' : `${selectedZone.timeToFloodingMinutes} minutes`}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-200">
                <span className="text-neutral-600">Evacuation Priority:</span>
                <span className="font-bold text-neutral-900">
                  {selectedZone.evacuationPriority === 0 ? 'Designated Refuge' : `Priority #${selectedZone.evacuationPriority}`}
                </span>
              </div>
            </div>

            {/* Tactical Assessment Box */}
            <div className="mt-5 p-3.5 bg-white border border-neutral-300 text-xs">
              <span className="font-semibold text-neutral-900 block mb-1 font-mono text-[11px] uppercase">
                Tactical Evacuation Advisory:
              </span>
              <p className="text-neutral-700 leading-relaxed font-sans">
                {selectedZone.elevation <= 46 ? (
                  <>
                    <strong className="text-red-700">Urgent Early Evacuation Required:</strong> This basin sits below 46.5m elevation. When Saryu river exceeds 52m, backwater collects here rapidly. Deploy shallow-draft boats (BT-01) immediately.
                  </>
                ) : selectedZone.riskLevel === 'Safe' ? (
                  <>
                    <strong className="text-emerald-700">Refuge Point:</strong> High-ground elevation ensures zero water inundation. Stocked with medical triage post, potable water, and VHF wireless communications.
                  </>
                ) : (
                  <>
                    <strong className="text-amber-800">Alert Staging:</strong> Prepare residents for vehicular evacuation along elevated ridge roads. Avoid low-lying river approaches.
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-200 mt-4 text-[11px] font-mono text-neutral-500">
            Coordinates: {selectedZone.coordinates.lat}°N, {selectedZone.coordinates.lng}°E
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
