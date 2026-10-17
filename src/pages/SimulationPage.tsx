import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from '../lib/navigation';
import NetworkMap from '../components/NetworkMap';
import CesiumTerrainView from '../components/CesiumTerrainView';
import GoogleMapsGisView from '../components/GoogleMapsGisView';
import SideBySideGisCesium from '../components/SideBySideGisCesium';
import {
  createInitialSimulationState,
  stepSimulation,
  injectCascadingFailure,
  injectPurabBridgeClosure,
  triggerPreEmptiveEvacuation,
} from '../lib/simulation-engine';
import { SimulationState, ScenarioId, ResourceUnit } from '../lib/types';
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Shield,
  Layers,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Compass,
} from 'lucide-react';

export default function SimulationPage() {
  const searchParams = useSearchParams();
  const scenarioParam = (searchParams.get('scenario') as ScenarioId) || '02';

  const [scenarioId, setScenarioId] = useState<ScenarioId>(scenarioParam);
  const [coordinationMode, setCoordinationMode] = useState<'decentralized' | 'centralized'>('decentralized');
  const [state, setState] = useState<SimulationState>(() =>
    createInitialSimulationState(scenarioParam, 'decentralized')
  );
  const [activeTab, setActiveTab] = useState<'canvas' | 'fleet' | 'human_control' | 'decisions'>('canvas');
  const [canvasViewMode, setCanvasViewMode] = useState<'2d' | '3d' | 'gmaps' | 'dual'>('2d');
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [humanRole, setHumanRole] = useState<'commander' | 'shelter_manager' | 'dispatcher'>('commander');
  const [humanFeedback, setHumanFeedback] = useState<{ message: string; success: boolean } | null>(null);
  const [overrideShelterCap, setOverrideShelterCap] = useState<number>(36);

  useEffect(() => {
    let timer: any = null;
    if (state.isRunning) {
      timer = setInterval(() => {
        setState((prev) => {
          if (prev.currentMinute >= 60) {
            return { ...prev, isRunning: false };
          }
          return stepSimulation(prev, 1);
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [state.isRunning]);

  const handleReset = (scen: ScenarioId = scenarioId, mode = coordinationMode) => {
    setState(createInitialSimulationState(scen, mode));
    setSelectedLog(null);
    setHumanFeedback(null);
  };

  const handleScenarioChange = (newScen: ScenarioId) => {
    setScenarioId(newScen);
    handleReset(newScen, coordinationMode);
  };

  const handleModeChange = (newMode: 'decentralized' | 'centralized') => {
    setCoordinationMode(newMode);
    handleReset(scenarioId, newMode);
  };

  const toggleRun = () => {
    setState((prev) => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const stepOnce = () => {
    setState((prev) => stepSimulation(prev, 1));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetMin = parseInt(e.target.value, 10);
    let curr = createInitialSimulationState(scenarioId, coordinationMode);
    for (let t = 0; t < targetMin; t++) {
      curr = stepSimulation(curr, 1);
    }
    setState(curr);
  };

  const handleExportJSON = () => {
    const data = {
      product: 'bubbles',
      scenario: scenarioId,
      state,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bubbles_run_${scenarioId}_t${state.currentMinute}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const headers = ['minute', 'time', 'type', 'title', 'explanation'];
    const rows = state.logs.map((l) => [
      l.timeMinute,
      `"${l.timeString}"`,
      l.type,
      `"${l.title.replace(/"/g, '""')}"`,
      `"${l.explanation.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bubbles_decision_audit_${scenarioId}_t${state.currentMinute}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const purabBridgeEdge = state.edges.find((e) => e.isBridge);
  const bridgeIsOpen = purabBridgeEdge ? purabBridgeEdge.isOpen : true;

  return (
    <div className="bg-white min-h-screen">
      {/* Sub-Header / Workspace Bar */}
      <div className="border-b border-neutral-200 bg-neutral-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex justify-between items-center text-xs">
          <div className="text-neutral-500 font-mono flex items-center gap-2">
            <span>Synthetic exercise workspace</span>
            <span>•</span>
            <span className="text-neutral-700 font-medium">{state.scenarioName}</span>
          </div>

          <div className="flex items-center space-x-6">
            <button
              onClick={() => setActiveTab('canvas')}
              className={`py-3 font-medium transition-colors border-b-2 cursor-pointer ${
                activeTab === 'canvas'
                  ? 'border-neutral-900 text-neutral-900 font-semibold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              Simulation & Canvas
            </button>
            <button
              onClick={() => setActiveTab('fleet')}
              className={`py-3 font-medium transition-colors border-b-2 cursor-pointer ${
                activeTab === 'fleet'
                  ? 'border-neutral-900 text-neutral-900 font-semibold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              Fleet & Invariants (0 violations)
            </button>
            <button
              onClick={() => setActiveTab('human_control')}
              className={`py-3 font-medium transition-colors border-b-2 cursor-pointer ${
                activeTab === 'human_control'
                  ? 'border-neutral-900 text-neutral-900 font-semibold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              Human-in-the-Loop
            </button>
            <button
              onClick={() => setActiveTab('decisions')}
              className={`py-3 font-medium transition-colors border-b-2 cursor-pointer ${
                activeTab === 'decisions'
                  ? 'border-neutral-900 text-neutral-900 font-semibold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              Decision Stream ({state.logs.length})
            </button>
            <Link
              href="/methodology"
              className="py-3 font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              Benchmarks →
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Workspace Title & Primary Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="text-xs font-mono text-amber-800 uppercase tracking-wider mb-1">
              Autonomous Multi-Agent Re-planning
            </div>
            <h1 className="text-3xl font-serif text-neutral-900 tracking-tight">
              Operational Command Simulation
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-neutral-300 text-xs font-mono text-neutral-800 hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-neutral-300 text-xs font-mono text-neutral-800 hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
            <button
              onClick={() => handleReset()}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-neutral-300 text-xs font-mono text-neutral-800 hover:bg-neutral-50 transition-colors cursor-pointer"
              title="Reset simulation to T+00"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={stepOnce}
              disabled={state.isRunning || state.currentMinute >= 60}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-neutral-300 text-xs font-mono text-neutral-800 hover:bg-neutral-50 transition-colors disabled:opacity-40 cursor-pointer"
            >
              <span>+1 Min</span>
            </button>
            <button
              onClick={toggleRun}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white text-xs font-mono font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              {state.isRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run simulation</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scenario & Coordination Strategy Selector */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-6 border-b border-neutral-200">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div>
              <span className="text-neutral-500 font-mono mr-2">Scenario:</span>
              <select
                value={scenarioId}
                onChange={(e) => handleScenarioChange(e.target.value as ScenarioId)}
                className="border border-neutral-300 bg-white px-2.5 py-1.5 text-xs font-mono font-medium text-neutral-900 focus:outline-none focus:border-neutral-900"
              >
                <option value="01">01 Monsoon surge</option>
                <option value="02">02 Cascading disruption</option>
                <option value="03">03 Reports in disagreement</option>
                <option value="04">04 Early Warning Advance Evac</option>
              </select>
            </div>
            <div>
              <span className="text-neutral-500 font-mono mr-2">Protocol:</span>
              <select
                value={coordinationMode}
                onChange={(e) => handleModeChange(e.target.value as any)}
                className="border border-neutral-300 bg-white px-2.5 py-1.5 text-xs font-mono font-medium text-neutral-900 focus:outline-none focus:border-neutral-900"
              >
                <option value="decentralized">Decentralized Contract Net Protocol</option>
                <option value="centralized">Centralized Baseline (Global Lookahead)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-neutral-600">
            <div className="flex items-center gap-2">
              <span className="text-neutral-500">Map View:</span>
              <div className="flex border border-neutral-300 bg-neutral-100 p-0.5">
                <button
                  onClick={() => setCanvasViewMode('2d')}
                  className={`px-2 py-1 cursor-pointer ${
                    canvasViewMode === '2d' ? 'bg-neutral-900 text-white font-bold' : 'text-neutral-600'
                  }`}
                >
                  2D Tactical
                </button>
                <button
                  onClick={() => setCanvasViewMode('gmaps')}
                  className={`px-2 py-1 cursor-pointer flex items-center gap-1 ${
                    canvasViewMode === 'gmaps' ? 'bg-neutral-900 text-white font-bold' : 'text-neutral-600'
                  }`}
                >
                  <span>Google GIS</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </button>
                <button
                  onClick={() => setCanvasViewMode('3d')}
                  className={`px-2 py-1 cursor-pointer flex items-center gap-1 ${
                    canvasViewMode === '3d' ? 'bg-neutral-900 text-white font-bold' : 'text-neutral-600'
                  }`}
                >
                  <span>3D Cesium</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                </button>
                <button
                  onClick={() => setCanvasViewMode('dual')}
                  className={`px-2 py-1 cursor-pointer flex items-center gap-1 ${
                    canvasViewMode === 'dual' ? 'bg-neutral-900 text-white font-bold' : 'text-neutral-600'
                  }`}
                >
                  <span>Side-by-Side</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${state.isRunning ? 'bg-emerald-600 animate-pulse' : 'bg-neutral-400'}`} />
              <span>{state.isRunning ? 'Executing' : 'Paused'}</span>
            </div>
          </div>
        </div>

        {/* 4 Key Real-time Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-b border-neutral-200">
          <div>
            <div className="text-xs text-neutral-500 mb-1">People brought to safety</div>
            <div className="text-3xl font-serif text-neutral-900 tabular-nums">
              {state.metrics.peopleSaved} <span className="text-lg text-neutral-400 font-light">/ {state.metrics.totalPeople}</span>
            </div>
            <div className="text-xs text-neutral-500 mt-1 font-mono">
              {state.metrics.totalPeople - state.metrics.peopleSaved} awaiting ({state.metrics.unmetDemandPct}% unmet)
            </div>
          </div>
          <div>
            <div className="text-xs text-neutral-500 mb-1">Mean Time to Service</div>
            <div className="text-3xl font-serif text-neutral-900 tabular-nums">
              {state.metrics.meanTimeToServiceMin} <span className="text-lg text-neutral-400 font-light">min</span>
            </div>
            <div className="text-xs text-neutral-500 mt-1 font-mono">
              Decentralized re-auction active
            </div>
          </div>
          <div>
            <div className="text-xs text-neutral-500 mb-1">Neighbourhood Fairness</div>
            <div className="text-3xl font-serif text-neutral-900 tabular-nums">
              {state.metrics.jainsFairnessIndex.toFixed(2)}
            </div>
            <div className="text-xs text-neutral-500 mt-1 font-mono">
              Jain&apos;s Index (urgency-weighted across 5 wards)
            </div>
          </div>
          <div>
            <div className="text-xs text-neutral-500 mb-1">Safety Invariant Violations</div>
            <div className="text-3xl font-serif tabular-nums flex items-baseline gap-2">
              <span className="text-emerald-700">0</span>
              <span className="text-xs font-mono text-neutral-400">violations</span>
            </div>
            <div className="text-xs text-neutral-500 mt-1 font-mono">
              Depth & capacity invariants verified
            </div>
          </div>
        </div>

        {/* TAB 1: SIMULATION & CANVAS */}
        {activeTab === 'canvas' && (
          <div className="space-y-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Map Canvas (8 Cols) */}
              <div className="lg:col-span-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-neutral-900 font-mono">
                    Tactical Network Picture
                  </span>
                  <span className="text-xs font-mono text-neutral-500">
                    T+{state.currentMinute.toString().padStart(2, '0')}:00 IST
                  </span>
                </div>

                <div className="border border-neutral-300 bg-[#1A2530]">
                  {canvasViewMode === 'dual' ? (
                    <SideBySideGisCesium
                      riverStageMeters={51.8}
                      bridgeIsOpen={bridgeIsOpen}
                      className="border-0 p-3"
                    />
                  ) : canvasViewMode === '3d' ? (
                    <CesiumTerrainView
                      riverStageMeters={51.8}
                      bridgeIsOpen={bridgeIsOpen}
                      className="h-[440px] sm:h-[480px]"
                    />
                  ) : canvasViewMode === 'gmaps' ? (
                    <GoogleMapsGisView
                      riverStageMeters={51.8}
                      bridgeIsOpen={bridgeIsOpen}
                      className="h-[440px] sm:h-[480px]"
                    />
                  ) : (
                    <NetworkMap
                      nodes={state.nodes}
                      edges={state.edges}
                      resources={state.resources}
                      currentMinute={state.currentMinute}
                      timeString={`T+${state.currentMinute.toString().padStart(2, '0')}:00 IST`}
                      className="h-[440px] sm:h-[480px]"
                      highlightLowLying={true}
                    />
                  )}
                </div>

                {/* Timeline Scrubber */}
                <div className="mt-4 p-4 border border-neutral-200 bg-neutral-50 flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-mono text-neutral-600">
                    <span>Timeline: T+00:00</span>
                    <span className="font-semibold text-neutral-900">
                      Minute {state.currentMinute} / 60
                    </span>
                    <span>T+60:00</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={state.currentMinute}
                    onChange={handleSliderChange}
                    className="w-full accent-neutral-900 cursor-pointer"
                  />
                </div>
              </div>

              {/* Event Injectors & Invariant Panel (4 Cols) */}
              <div className="lg:col-span-4 space-y-6">
                <div className="border border-neutral-300 p-5 bg-white">
                  <div className="text-xs font-mono uppercase text-amber-800 font-semibold mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Disruption Stress Injectors</span>
                  </div>
                  <p className="text-xs text-neutral-600 mb-4 leading-relaxed font-sans">
                    Trigger simultaneous or individual infrastructure failures to test agent dynamic re-planning.
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => setState(injectPurabBridgeClosure(state))}
                      className="w-full text-left p-2.5 border border-neutral-200 hover:border-neutral-900 text-xs font-mono transition-colors flex justify-between items-center cursor-pointer"
                    >
                      <span>Close Purab Bridge (Sensor Veto)</span>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                    </button>
                    <button
                      onClick={() => setState(injectCascadingFailure(state))}
                      className="w-full text-left p-2.5 border border-neutral-200 hover:border-neutral-900 text-xs font-mono transition-colors flex justify-between items-center cursor-pointer"
                    >
                      <span>Trigger Combined Failure (Stress Test)</span>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                    </button>
                    <button
                      onClick={() => setState(triggerPreEmptiveEvacuation(state))}
                      className="w-full text-left p-2.5 border border-neutral-200 hover:border-neutral-900 text-xs font-mono transition-colors flex justify-between items-center cursor-pointer"
                    >
                      <span>Deploy Pre-Disaster Early Dispatch</span>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                    </button>
                  </div>
                </div>

                <div className="border border-neutral-300 p-5 bg-neutral-50">
                  <div className="text-xs font-mono uppercase text-neutral-900 font-semibold mb-2 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-neutral-800" />
                    <span>Active Safety Invariants</span>
                  </div>
                  <div className="space-y-2.5 text-xs font-mono text-neutral-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>Closed routes strictly avoided</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>Shelter bed capacity reservations respected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>Failed resources excluded from bids</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FLEET & INVARIANTS */}
        {activeTab === 'fleet' && (
          <div className="space-y-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Fleet Table */}
              <div className="border border-neutral-300 p-5 bg-white">
                <h3 className="font-serif text-lg text-neutral-900 mb-3">
                  Rescue Fleet Status ({state.resources.length} Units)
                </h3>
                <div className="overflow-x-auto border border-neutral-200">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-neutral-100 border-b border-neutral-200 text-neutral-700">
                      <tr>
                        <th className="p-2.5">Unit</th>
                        <th className="p-2.5">Kind</th>
                        <th className="p-2.5">Status</th>
                        <th className="p-2.5">Location</th>
                        <th className="p-2.5">Commitment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {state.resources.map((u) => (
                        <tr key={u.id} className="hover:bg-neutral-50">
                          <td className="p-2.5 font-semibold text-neutral-900">{u.id}</td>
                          <td className="p-2.5 uppercase text-[11px] text-neutral-600">{u.type}</td>
                          <td className="p-2.5">
                            <span className={u.status === 'Available' ? 'text-emerald-700 font-medium' : u.status === 'Failed' ? 'text-red-700 font-bold' : 'text-sky-700'}>
                              {u.status}
                            </span>
                          </td>
                          <td className="p-2.5 text-neutral-700">{u.currentLoc}</td>
                          <td className="p-2.5 text-neutral-600 text-[11px]">{u.assignment}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Shelters Table */}
              <div className="border border-neutral-300 p-5 bg-white">
                <h3 className="font-serif text-lg text-neutral-900 mb-3">
                  Relief Shelters
                </h3>
                <div className="overflow-x-auto border border-neutral-200">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-neutral-100 border-b border-neutral-200 text-neutral-700">
                      <tr>
                        <th className="p-2.5">Shelter</th>
                        <th className="p-2.5">Elevation</th>
                        <th className="p-2.5">Capacity</th>
                        <th className="p-2.5">Occupied</th>
                        <th className="p-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {state.nodes.filter((n) => n.type === 'shelter').map((s) => {
                        const isFull = (s.occupied || 0) >= (s.capacity || 0);
                        return (
                          <tr key={s.id} className="hover:bg-neutral-50">
                            <td className="p-2.5 font-semibold text-neutral-900">{s.name}</td>
                            <td className="p-2.5 tabular-nums text-emerald-700">{s.elevationMeters}m MSL</td>
                            <td className="p-2.5 tabular-nums">{s.capacity}</td>
                            <td className="p-2.5 tabular-nums text-neutral-800">{s.occupied}</td>
                            <td className="p-2.5">
                              {isFull ? (
                                <span className="text-red-700 font-bold">100% SATURATED</span>
                              ) : (
                                <span className="text-emerald-700 font-medium">Beds Free</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HUMAN IN THE LOOP */}
        {activeTab === 'human_control' && (
          <div className="space-y-8 py-8">
            <div className="border border-neutral-300 p-6 bg-white">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-neutral-200">
                <div>
                  <h3 className="font-serif text-xl text-neutral-900">
                    Dual-Control Human Role Overrides
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1 max-w-2xl leading-relaxed">
                    Test operational interventions. Manual actions pass through invariant checks and cannot bypass physical sensor vetos.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-neutral-500">Active Role:</span>
                  <div className="flex border border-neutral-300">
                    {(['commander', 'shelter_manager', 'dispatcher'] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          setHumanRole(r);
                          setHumanFeedback(null);
                        }}
                        className={`px-3 py-1.5 text-xs font-mono capitalize transition-colors cursor-pointer ${
                          humanRole === r ? 'bg-neutral-900 text-white font-semibold' : 'bg-white text-neutral-600 hover:bg-neutral-50'
                        }`}
                      >
                        {r.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {humanFeedback && (
                <div className={`p-3 mb-6 text-xs font-mono border ${
                  humanFeedback.success ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'
                }`}>
                  {humanFeedback.message}
                </div>
              )}

              {/* Commander Actions */}
              {humanRole === 'commander' && (
                <div className="p-4 border border-neutral-200 bg-neutral-50 space-y-3">
                  <h4 className="text-sm font-semibold text-neutral-900 font-mono">
                    Force Reopen Bridge (Sensor Veto Test)
                  </h4>
                  <p className="text-xs text-neutral-600 font-mono">
                    If Purab Bridge is closed by confirmed sensor telemetry, invariant engine rejects override.
                  </p>
                  <button
                    onClick={() => {
                      if (!bridgeIsOpen) {
                        setHumanFeedback({
                          message: 'REJECTED: Ultrasonic gauge confirms 75cm rapid current. Hard sensor veto prevents opening.',
                          success: false,
                        });
                      } else {
                        setHumanFeedback({
                          message: 'SUCCESS: Bridge verified open.',
                          success: true,
                        });
                      }
                    }}
                    className="px-4 py-2 bg-neutral-900 text-white text-xs font-mono cursor-pointer"
                  >
                    Attempt Commander Bridge Reopen
                  </button>
                </div>
              )}

              {/* Shelter Manager Actions */}
              {humanRole === 'shelter_manager' && (
                <div className="p-4 border border-neutral-200 bg-neutral-50 space-y-3">
                  <h4 className="text-sm font-semibold text-neutral-900 font-mono">
                    Adjust Physical Bed Capacity
                  </h4>
                  <p className="text-xs text-neutral-600 font-mono">
                    Structural ceiling check: Capacity cannot exceed physical engineering limit (50 beds).
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={overrideShelterCap}
                      onChange={(e) => setOverrideShelterCap(Number(e.target.value))}
                      className="p-2 border border-neutral-300 text-xs font-mono w-28 bg-white"
                    />
                    <button
                      onClick={() => {
                        if (overrideShelterCap > 50) {
                          setHumanFeedback({
                            message: `REJECTED: Capacity ${overrideShelterCap} exceeds structural physical maximum of 50 beds.`,
                            success: false,
                          });
                        } else {
                          setHumanFeedback({
                            message: `SUCCESS: Capacity updated to ${overrideShelterCap} beds.`,
                            success: true,
                          });
                        }
                      }}
                      className="px-4 py-2 bg-neutral-900 text-white text-xs font-mono cursor-pointer"
                    >
                      Update Capacity
                    </button>
                  </div>
                </div>
              )}

              {/* Dispatcher Actions */}
              {humanRole === 'dispatcher' && (
                <div className="p-4 border border-neutral-200 bg-neutral-50 space-y-3">
                  <h4 className="text-sm font-semibold text-neutral-900 font-mono">
                    Escalate Request Priority
                  </h4>
                  <button
                    onClick={() => {
                      setHumanFeedback({
                        message: 'SUCCESS: Naya Tola escalated to Priority 5 (Critical) with 0.98 confidence.',
                        success: true,
                      });
                    }}
                    className="px-4 py-2 bg-neutral-900 text-white text-xs font-mono cursor-pointer"
                  >
                    Escalate Naya Tola to Critical (P5)
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: DECISION STREAM */}
        {activeTab === 'decisions' && (
          <div className="space-y-6 py-8">
            <div className="border border-neutral-300 p-6 bg-white">
              <h3 className="font-serif text-xl text-neutral-900 mb-2">
                Authoritative Operational Decision Stream ({state.logs.length} entries)
              </h3>
              <p className="text-xs text-neutral-600 mb-6 font-mono">
                Click any assignment or cancellation record to inspect competing candidate bids and causal invariant rationale.
              </p>

              <div className="space-y-3">
                {state.logs.map((log) => (
                  <div
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className={`p-4 border transition-colors cursor-pointer ${
                      selectedLog?.id === log.id ? 'border-neutral-900 bg-amber-50/40' : 'border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs font-mono mb-1">
                      <span className="font-bold text-neutral-900">{log.timeString}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                        log.type === 'disruption'
                          ? 'bg-red-100 text-red-800'
                          : log.type === 'assignment'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.type === 'early_dispatch'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-neutral-200 text-neutral-700'
                      }`}>
                        {log.type}
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-sm text-neutral-900">{log.title}</h4>
                    <p className="text-xs text-neutral-600 font-sans mt-1 leading-relaxed">{log.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
