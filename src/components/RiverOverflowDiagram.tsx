import React, { useState } from 'react';
import { calculateHydraulics, getSettlementVulnerability, FLOODPLAIN_SETTLEMENTS } from '../lib/hydrology';
import { AlertTriangle, Droplets, Waves, ArrowRight, ShieldCheck, Info, Clock } from 'lucide-react';

interface RiverOverflowDiagramProps {
  currentStage: number;
  onStageChange: (stage: number) => void;
  onTriggerEarlyEvac?: () => void;
}

export default function RiverOverflowDiagram({
  currentStage,
  onStageChange,
  onTriggerEarlyEvac,
}: RiverOverflowDiagramProps) {
  const [activeTab, setActiveTab] = useState<'cross_section' | 'hydraulic_metrics' | 'settlement_vulnerability'>('cross_section');

  const hydraulics = calculateHydraulics(currentStage);
  const settlements = getSettlementVulnerability(currentStage);

  // Scaled coordinates for SVG cross section
  // River Bed: 40m elevation -> Y = 320
  // Normal Water: 48m -> Y = 260
  // Warning: 51.5m -> Y = 220
  // Danger: 53.0m -> Y = 200
  // Embankment Crest: 54.5m -> Y = 180
  // Water Y calculated from stage (between 47m and 56m)
  const calcWaterY = (stage: number) => {
    // 47m = 270, 56m = 160
    const pct = (stage - 47) / (56.5 - 47);
    return 270 - pct * 115;
  };

  const waterY = calcWaterY(currentStage);
  const isOvertopping = currentStage >= hydraulics.embankmentCrestMeters;
  const isDanger = currentStage >= hydraulics.dangerLevelMeters;
  const isWarning = currentStage >= hydraulics.warningLevelMeters;

  return (
    <div className="bg-white border border-neutral-300 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-semibold mb-1 flex items-center gap-1.5">
            <Waves className="w-3.5 h-3.5" />
            <span>Hydrological Embankment & Inundation Physics</span>
          </div>
          <h2 className="text-2xl font-serif text-neutral-900 tracking-tight">
            River Overflow & Low-Lying Floodplain Mechanics
          </h2>
          <p className="text-xs text-neutral-600 mt-1 max-w-2xl leading-relaxed">
            Examine how upstream discharge, bank saturation, and crest overtopping cause catastrophic inundation in low-lying settlements (Naya Tola 45m & Moti Basti 46m) before higher zones are impacted.
          </p>
        </div>

        {/* River Stage Slider Control */}
        <div className="p-3 bg-neutral-50 border border-neutral-300 min-w-[280px]">
          <div className="flex justify-between items-center text-xs font-mono mb-1">
            <span className="text-neutral-600">Simulate River Stage:</span>
            <span className={`font-bold text-sm ${
              isOvertopping ? 'text-red-700' : isDanger ? 'text-amber-700' : 'text-neutral-900'
            }`}>
              {currentStage.toFixed(1)} m MSL
            </span>
          </div>
          <input
            type="range"
            min="48.0"
            max="56.5"
            step="0.1"
            value={currentStage}
            onChange={(e) => onStageChange(parseFloat(e.target.value))}
            className="w-full accent-neutral-900 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1">
            <span>Normal (48m)</span>
            <span>Warning (51.5m)</span>
            <span>Danger (53m)</span>
            <span>Crest (54.5m)</span>
          </div>
        </div>
      </div>

      {/* Hydraulic Status Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-neutral-50 border border-neutral-200 text-xs font-mono">
        <div>
          <span className="text-neutral-500 block text-[10px]">CURRENT DISCHARGE</span>
          <span className="text-lg font-bold text-neutral-900 tabular-nums">
            {hydraulics.dischargeCumecs.toLocaleString()} <span className="text-xs font-normal text-neutral-600">m³/s</span>
          </span>
          <span className="text-[10px] text-neutral-500 block mt-0.5">Dam outflow: +{hydraulics.damReleaseDischargeCumecs} m³/s</span>
        </div>
        <div>
          <span className="text-neutral-500 block text-[10px]">CREST FREEBOARD BUFFER</span>
          <span className={`text-lg font-bold tabular-nums ${
            isOvertopping ? 'text-red-700' : (hydraulics.embankmentCrestMeters - currentStage) < 1.5 ? 'text-amber-700' : 'text-emerald-700'
          }`}>
            {isOvertopping ? 'BREACHED (-' + (currentStage - hydraulics.embankmentCrestMeters).toFixed(1) + 'm)' : '+' + (hydraulics.embankmentCrestMeters - currentStage).toFixed(1) + ' m'}
          </span>
          <span className="text-[10px] text-neutral-500 block mt-0.5">Embankment height: 54.5m</span>
        </div>
        <div>
          <span className="text-neutral-500 block text-[10px]">INUNDATION SPREAD SPEED</span>
          <span className="text-lg font-bold text-neutral-900 tabular-nums">
            {hydraulics.inundationVelocityMs} <span className="text-xs font-normal text-neutral-600">m/s</span>
          </span>
          <span className="text-[10px] text-neutral-500 block mt-0.5">Wave speed: {(hydraulics.inundationVelocityMs * 3.6).toFixed(1)} km/h</span>
        </div>
        <div>
          <span className="text-neutral-500 block text-[10px]">LOWEST ZONE LEAD TIME</span>
          <span className="text-lg font-bold text-red-700 tabular-nums flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-red-600 inline" />
            <span>{isOvertopping ? '0 MIN (Submerged)' : `${hydraulics.estimatedLeadTimeMinutes} MIN`}</span>
          </span>
          <span className="text-[10px] text-neutral-500 block mt-0.5">Target: Naya Tola (45m)</span>
        </div>
      </div>

      {/* Cross Section SVG Diagram */}
      <div className="border border-neutral-300 bg-[#1A2530] text-neutral-100 p-4 relative overflow-hidden">
        <div className="text-xs font-mono text-neutral-400 mb-2 flex justify-between items-center">
          <span>RIVER SARYU CROSS-SECTIONAL ELEVATION PROFILE</span>
          <span className="text-amber-400">Vertical Exaggeration: 8x</span>
        </div>

        <svg viewBox="0 0 900 380" className="w-full h-auto max-h-[380px]">
          <defs>
            {/* Water gradient */}
            <linearGradient id="riverWater" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0369A1" stopOpacity="0.95" />
            </linearGradient>
            {/* Floodplain flood gradient */}
            <linearGradient id="floodWater" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F87171" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#991B1B" stopOpacity="0.8" />
            </linearGradient>
            {/* Soil / Earth gradient */}
            <linearGradient id="earthSoil" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
          </defs>

          {/* Geological Sub-stratum (Ground) */}
          {/* River channel (left: 0-300), Embankment (300-480), Floodplain basin (480-900) */}
          <path
            d="
              M 0 300
              L 120 330
              L 260 330
              L 330 200
              L 380 180
              L 430 180
              L 500 280
              L 600 320
              L 740 310
              L 830 230
              L 900 200
              L 900 380
              L 0 380
              Z
            "
            fill="url(#earthSoil)"
            stroke="#64748B"
            strokeWidth="2"
          />

          {/* River Channel Water Body */}
          <path
            d={`
              M 0 ${waterY}
              L 330 ${waterY}
              L 330 330
              L 120 330
              L 0 300
              Z
            `}
            fill="url(#riverWater)"
          />

          {/* Water Surface Line with wave ripple */}
          <line
            x1="0"
            y1={waterY}
            x2="330"
            y2={waterY}
            stroke="#7DD3FC"
            strokeWidth="3"
            strokeDasharray="8,4"
          />

          {/* Embankment Crest Structure (Crest at Y=180, 54.5m) */}
          <rect x="375" y="176" width="60" height="8" fill="#F59E0B" opacity="0.8" />
          <text x="405" y="165" fill="#FBBF24" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            EMBANKMENT CREST (54.5m)
          </text>

          {/* If overtopping: show water cascade over the embankment into floodplain */}
          {isOvertopping && (
            <>
              {/* Cascade waterfall over crest */}
              <path
                d={`
                  M 375 ${waterY}
                  L 435 ${waterY}
                  Q 480 200 500 280
                  L 600 320
                  L 740 310
                  L 800 300
                  L 500 300
                  Z
                `}
                fill="url(#floodWater)"
              />
              <path
                d="M 430 180 Q 470 210 500 280"
                fill="none"
                stroke="#EF4444"
                strokeWidth="4"
                strokeDasharray="4,4"
              />
              <text x="470" y="235" fill="#FCA5A5" fontSize="10" fontFamily="monospace" fontWeight="bold">
                ⚠️ OVERTOPPING CASCADE!
              </text>
            </>
          )}

          {/* Flood water pooling in low-lying floodplain (Naya Tola & Moti Basti) */}
          {isDanger && (
            <path
              d={`
                M 480 290
                L 760 290
                L 740 310
                L 600 320
                L 500 280
                Z
              `}
              fill="#DC2626"
              fillOpacity={isOvertopping ? "0.6" : "0.3"}
            />
          )}

          {/* Phreatic Seepage Line through porous embankment body */}
          {currentStage >= 51.0 && (
            <g>
              <path
                d={`M 330 ${waterY + 15} Q 400 230 460 270`}
                fill="none"
                stroke="#38BDF8"
                strokeWidth="2"
                strokeDasharray="4,4"
                opacity="0.8"
              />
              <text x="430" y="260" fill="#7DD3FC" fontSize="9" fontFamily="monospace">
                Seepage Line
              </text>
            </g>
          )}

          {/* Water Stage Gauge Marks (Left Side) */}
          <g transform="translate(40, 60)">
            <line x1="0" y1="0" x2="0" y2="240" stroke="#94A3B8" strokeWidth="2" />
            {/* Danger mark 53.0m */}
            <line x1="-5" y1="140" x2="15" y2="140" stroke="#EF4444" strokeWidth="2" />
            <text x="20" y="143" fill="#EF4444" fontSize="9" fontFamily="monospace">
              53.0m Danger Mark
            </text>
            {/* Warning mark 51.5m */}
            <line x1="-5" y1="160" x2="15" y2="160" stroke="#F59E0B" strokeWidth="2" />
            <text x="20" y="163" fill="#F59E0B" fontSize="9" fontFamily="monospace">
              51.5m Warning Level
            </text>
            {/* Normal flow 48.0m */}
            <line x1="-5" y1="210" x2="15" y2="210" stroke="#38BDF8" strokeWidth="2" />
            <text x="20" y="213" fill="#38BDF8" fontSize="9" fontFamily="monospace">
              48.0m Normal Flow
            </text>
          </g>

          {/* Settlements positioned along topographic elevation */}
          {/* Naya Tola: X=600, Y=320 (Elev: 45m - lowest!) */}
          <g transform="translate(600, 310)">
            <circle cx="0" cy="0" r="8" fill="#DC2626" stroke="#FFF" strokeWidth="1.5" />
            <text x="0" y="-14" fill="#F8FAFC" fontSize="11" fontWeight="bold" textAnchor="middle">
              Naya Tola
            </text>
            <text x="0" y="18" fill="#FCA5A5" fontSize="9" fontFamily="monospace" textAnchor="middle">
              [Elev: 45m Basin Bottom]
            </text>
            {isDanger && (
              <text x="0" y="30" fill="#EF4444" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                ⚠️ FLOODS FIRST!
              </text>
            )}
          </g>

          {/* Moti Basti: X=700, Y=305 (Elev: 46.2m) */}
          <g transform="translate(700, 300)">
            <circle cx="0" cy="0" r="7" fill="#EA580C" stroke="#FFF" strokeWidth="1.5" />
            <text x="0" y="-12" fill="#F8FAFC" fontSize="10" fontWeight="bold" textAnchor="middle">
              Moti Basti
            </text>
            <text x="0" y="16" fill="#FED7AA" fontSize="9" fontFamily="monospace" textAnchor="middle">
              [Elev: 46.2m Low Belt]
            </text>
          </g>

          {/* High Ground Safe Shelter: X=860, Y=190 (Elev: 62m) */}
          <g transform="translate(860, 190)">
            <rect x="-10" y="-10" width="20" height="20" fill="#1E293B" stroke="#10B981" strokeWidth="2" />
            <path d="M 0 -5 L 0 5 M -5 0 L 5 0" stroke="#10B981" strokeWidth="2" />
            <text x="0" y="-16" fill="#34D399" fontSize="11" fontWeight="bold" textAnchor="middle">
              School Shelter
            </text>
            <text x="0" y="24" fill="#6EE7B7" fontSize="9" fontFamily="monospace" textAnchor="middle">
              [Elev: 62m Safe Ridge]
            </text>
          </g>
        </svg>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-neutral-400 border-t border-neutral-700/60 pt-2 mt-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-sky-500 inline-block"></span> River Water Body
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-amber-500 inline-block"></span> Earthen Bund Embankment
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-red-600 inline-block"></span> Low-Lying Vulnerable Zones
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 border border-emerald-400 bg-neutral-900 inline-block"></span> Safe High-Ground Shelter
            </span>
          </div>
          <span className="text-neutral-500">Physics: Inundation spreads via lowest hydraulic gradient</span>
        </div>
      </div>

      {/* Floodplain Settlements Vulnerability Table */}
      <div className="border border-neutral-300 p-5 bg-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <div>
            <h3 className="text-base font-serif font-bold text-neutral-900">
              Low-Lying Zone Inundation Lead Time & Evacuation Priority
            </h3>
            <p className="text-xs text-neutral-600">
              Calculated based on digital elevation model (DEM), distance from river breach point, and upstream crest velocity.
            </p>
          </div>
          {onTriggerEarlyEvac && (
            <button
              onClick={onTriggerEarlyEvac}
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-mono font-medium flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>Deploy Pre-Disaster Advance Evacuation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left font-mono">
            <thead className="bg-neutral-100 border-b border-neutral-200 text-neutral-700">
              <tr>
                <th className="p-3">Evac Rank</th>
                <th className="p-3">Settlement / Ward</th>
                <th className="p-3">Elevation</th>
                <th className="p-3">Breach Lead Time</th>
                <th className="p-3">Water Depth</th>
                <th className="p-3">Vulnerable Pax</th>
                <th className="p-3">Action Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {settlements.map((s, idx) => (
                <tr key={s.id} className={idx === 0 ? 'bg-red-50/60 font-semibold' : 'hover:bg-neutral-50'}>
                  <td className="p-3 text-neutral-900">
                    <span className={`px-2 py-0.5 text-[10px] ${
                      idx === 0 ? 'bg-red-600 text-white' : idx === 1 ? 'bg-amber-600 text-white' : 'bg-neutral-200 text-neutral-800'
                    }`}>
                      #{idx + 1}
                    </span>
                  </td>
                  <td className="p-3 font-sans font-medium text-neutral-900">
                    {s.name}
                  </td>
                  <td className="p-3 tabular-nums text-neutral-800">
                    {s.elevationMeters} m MSL
                  </td>
                  <td className="p-3 tabular-nums">
                    {s.isSubmerged ? (
                      <span className="text-red-700 font-bold">SUBMERGED</span>
                    ) : (
                      <span className="text-amber-800">{s.leadTimeMin} min remaining</span>
                    )}
                  </td>
                  <td className="p-3 tabular-nums text-neutral-700">
                    {s.waterDepthCm > 0 ? `${s.waterDepthCm} cm` : 'Dry (Imminent)'}
                  </td>
                  <td className="p-3 text-neutral-700">
                    {s.vulnerableGroupsCount} elders/infants ({s.population} total)
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                      s.riskLabel === 'Critical Evacuation'
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : s.riskLabel === 'Severe Threat'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-neutral-100 text-neutral-700'
                    }`}>
                      {s.riskLabel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
