import React, { useState } from 'react';
import { Clock, ShieldAlert, ArrowRight, CheckCircle2, AlertTriangle, Users, Navigation, Sparkles } from 'lucide-react';
import { SimulationState } from '../lib/types';
import { triggerPreEmptiveEvacuation } from '../lib/simulation-engine';

interface PreDisasterEvacuationPlannerProps {
  simulationState: SimulationState;
  onUpdateState: (newState: SimulationState) => void;
  riverStageMeters: number;
}

export default function PreDisasterEvacuationPlanner({
  simulationState,
  onUpdateState,
  riverStageMeters,
}: PreDisasterEvacuationPlannerProps) {
  const [deployedSuccess, setDeployedSuccess] = useState<string | null>(null);

  const lowLyingPriorities = [
    {
      id: 'naya_tola',
      name: 'Naya Tola Basin',
      elevation: 45.0,
      vulnerabilityRank: '#1 Highest Critical Priority',
      leadTimeMinutes: 20,
      populationAtRisk: 290,
      vulnerableCount: 78,
      status: 'High Submersion Threat',
      assignedUnit: 'BT-01 (Rescue Boat)',
      evacTarget: 'School Shelter (62m)',
      cutOffRoad: 'Naya-Purab Road (floods at 30cm water)',
    },
    {
      id: 'moti_basti',
      name: 'Moti Basti Lowlands',
      elevation: 46.2,
      vulnerabilityRank: '#2 Severe Priority',
      leadTimeMinutes: 35,
      populationAtRisk: 380,
      vulnerableCount: 95,
      status: 'Advance Warning',
      assignedUnit: 'RT-01 (Wheeled Team)',
      evacTarget: 'Community Shelter (59m)',
      cutOffRoad: 'Moti-Purab Link (embankment washaway risk)',
    },
    {
      id: 'nadi_nagar',
      name: 'Nadi Nagar Riverline',
      elevation: 48.0,
      vulnerabilityRank: '#3 Moderate Priority',
      leadTimeMinutes: 55,
      populationAtRisk: 420,
      vulnerableCount: 85,
      status: 'Warning Active',
      assignedUnit: 'BT-02 (Rescue Boat)',
      evacTarget: 'School Shelter (62m)',
      cutOffRoad: 'Purab Bridge (riverbank crossing)',
    },
  ];

  const handleDeployAdvanceDispatch = () => {
    const updated = triggerPreEmptiveEvacuation(simulationState);
    onUpdateState(updated);
    setDeployedSuccess('Pre-disaster advance dispatch executed. Boats & teams mobilized before embankment cresting.');
    setTimeout(() => setDeployedSuccess(null), 6000);
  };

  return (
    <div className="bg-white border border-neutral-300 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-semibold mb-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>Early Warning & Pre-Disaster Advance Dispatch</span>
          </div>
          <h2 className="text-2xl font-serif text-neutral-900 tracking-tight">
            Arrive Before the Disaster Strikes: Low-Lying Zone Prioritization
          </h2>
          <p className="text-xs text-neutral-600 mt-1 max-w-3xl leading-relaxed">
            In severe river floods, dispatching rescue <em>after</em> water crests leaves wheeled vehicles immobilized and cuts off roads. This engine uses upstream dam release telemetry to calculate the arrival window, dispatching help into low-lying zones (Naya Tola 45m & Moti Basti 46m) ahead of time.
          </p>
        </div>

        <button
          onClick={handleDeployAdvanceDispatch}
          className="px-5 py-3 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-mono font-medium flex items-center gap-2 transition-colors cursor-pointer shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Execute Pre-Disaster Advance Dispatch</span>
        </button>
      </div>

      {deployedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-xs font-mono text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{deployedSuccess}</span>
        </div>
      )}

      {/* Real-Life Operational Philosophy Box */}
      <div className="p-5 bg-neutral-50 border border-neutral-300">
        <h3 className="text-sm font-serif font-bold text-neutral-900 mb-2 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-800" />
          <span>The Operational Golden Window (T-45 Minutes)</span>
        </h3>
        <p className="text-xs text-neutral-700 leading-relaxed max-w-4xl font-sans">
          Hydrological analysis shows upstream dam discharge from Saryu Barrage takes <strong>35 to 55 minutes</strong> to reach floodplain settlements. During this &ldquo;Golden Window&rdquo;, roads remain passable with water depth under 20cm. If wheeled teams deploy now, they can evacuate <strong>100% of infants and elderly residents</strong> via dry roads to high shelters. If dispatch waits until waters overtop the embankment, wheeled vehicles become trapped and only slow river boats can operate.
        </p>
      </div>

      {/* Low-Lying Priority Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {lowLyingPriorities.map((item) => (
          <div
            key={item.id}
            className="border border-neutral-300 p-5 bg-white flex flex-col justify-between hover:border-neutral-900 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="font-bold text-red-700">{item.vulnerabilityRank}</span>
                <span className="px-2 py-0.5 bg-neutral-100 text-neutral-800 font-bold">
                  {item.elevation} m MSL
                </span>
              </div>

              <h4 className="text-lg font-serif font-bold text-neutral-900 mb-1">
                {item.name}
              </h4>

              <div className="text-xs font-mono text-neutral-500 mb-4">
                Lead Time to Inundation: <strong className="text-red-700">{item.leadTimeMinutes} min</strong>
              </div>

              <div className="space-y-2 text-xs font-mono border-t border-neutral-200 pt-3">
                <div className="flex justify-between text-neutral-600">
                  <span>Vulnerable Population:</span>
                  <span className="font-bold text-neutral-900">{item.vulnerableCount} / {item.populationAtRisk}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Pre-Assigned Asset:</span>
                  <span className="font-bold text-neutral-900">{item.assignedUnit}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Target Safe Refuge:</span>
                  <span className="font-bold text-emerald-700">{item.evacTarget}</span>
                </div>
                <div className="text-[11px] text-amber-800 mt-2 pt-1 border-t border-neutral-100">
                  Hazard: {item.cutOffRoad}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-neutral-200">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                Protocol: Evacuate Before Water &gt; 25cm
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Step-by-Step Pre-Disaster Early Action Workflow */}
      <div className="border border-neutral-300 p-5 bg-white">
        <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider font-mono mb-3">
          Chronological Early Action Timeline (NDMA / CWC Standard)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 bg-neutral-50 border border-neutral-200">
            <span className="text-amber-800 font-bold block mb-1">T-60 MIN (Telemetry)</span>
            <p className="text-neutral-600 text-[11px] leading-relaxed">
              Dam releases 11,200 m³/s. Early flood sensor alerts Central Command. Automated notification to low-lying ward heads.
            </p>
          </div>
          <div className="p-3 bg-neutral-50 border border-neutral-200">
            <span className="text-amber-800 font-bold block mb-1">T-45 MIN (Advance Dispatch)</span>
            <p className="text-neutral-600 text-[11px] leading-relaxed">
              Wheeled teams RT-01 & RT-02 pre-position at Naya Tola and Moti Basti. Boats BT-01 deployed to staging dock.
            </p>
          </div>
          <div className="p-3 bg-neutral-50 border border-neutral-200">
            <span className="text-amber-800 font-bold block mb-1">T-20 MIN (High-Priority Evac)</span>
            <p className="text-neutral-600 text-[11px] leading-relaxed">
              Hospital patients, expectant mothers, and infants boarded onto high-clearance trucks while roads remain dry.
            </p>
          </div>
          <div className="p-3 bg-neutral-50 border border-neutral-200">
            <span className="text-emerald-700 font-bold block mb-1">T-00 MIN (Zero Casualties)</span>
            <p className="text-neutral-600 text-[11px] leading-relaxed">
              Embankment crests at 54.5m. Low-lying zones submerged; all vulnerable citizens already secure at School Shelter (62m).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
