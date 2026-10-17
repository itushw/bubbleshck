import React, { useState, useEffect } from 'react';
import { Link, useRouter, useSearchParams } from '../lib/navigation';
import { Play, ArrowRight, Sparkles, Waves, Layers, Clock, MapPin, ShieldCheck, AlertTriangle, Search, Bot, ExternalLink, HelpCircle } from 'lucide-react';
import NetworkMap from '../components/NetworkMap';
import CesiumTerrainView from '../components/CesiumTerrainView';
import AIChatBot from '../components/AIChatBot';
import RiverOverflowDiagram from '../components/RiverOverflowDiagram';
import DynamicRiskMapOverlay from '../components/DynamicRiskMapOverlay';
import PreDisasterEvacuationPlanner from '../components/PreDisasterEvacuationPlanner';
import GeolocationShelters from '../components/GeolocationShelters';
import OfflineSafetyHub from '../components/OfflineSafetyHub';
import SideBySideGisCesium from '../components/SideBySideGisCesium';
import GoogleMapsGisView from '../components/GoogleMapsGisView';
import {
  createInitialSimulationState,
  injectCascadingFailure,
  triggerPreEmptiveEvacuation,
} from '../lib/simulation-engine';

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [previewState, setPreviewState] = useState(() =>
    createInitialSimulationState('01', 'decentralized')
  );
  const [previewMode2d3d, setPreviewMode2d3d] = useState<'2d' | '3d' | 'gmaps'>('2d');
  const [triggeredNotice, setTriggeredNotice] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<'ai_chat' | 'side_by_side' | 'river_diagram' | 'risk_map' | 'early_evac' | 'shelters' | 'offline_hub'>('ai_chat');
  const [riverStageMeters, setRiverStageMeters] = useState<number>(51.8);
  const [homeSearchQuery, setHomeSearchQuery] = useState<string>('');

  useEffect(() => {
    const mod = searchParams.get('module');
    if (mod && ['ai_chat', 'side_by_side', 'river_diagram', 'risk_map', 'early_evac', 'shelters', 'offline_hub'].includes(mod)) {
      setActiveModule(mod as any);
    }
  }, [searchParams]);

  const handleTriggerFailure = () => {
    const updated = injectCascadingFailure(previewState);
    setPreviewState(updated);
    setTriggeredNotice('Purab bridge closed, BT-02 failed, school shelter saturated!');
    setTimeout(() => setTriggeredNotice(null), 5000);
  };

  const handleEarlyEvac = () => {
    const updated = triggerPreEmptiveEvacuation(previewState);
    setPreviewState(updated);
    setTriggeredNotice('Pre-Disaster Advance Dispatch Deployed! Priority given to lowest elevations (Naya Tola 45m & Moti Basti 46m).');
    setTimeout(() => setTriggeredNotice(null), 6000);
  };

  const purabBridgeEdge = previewState.edges.find((e) => e.isBridge);
  const bridgeIsOpen = purabBridgeEdge ? purabBridgeEdge.isOpen : true;

  return (
    <div className="bg-white">
      {/* Hero Section (Exact match to original) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <h1 className="text-5xl sm:text-6xl font-serif text-neutral-900 tracking-tight leading-[1.08] mb-6">
                Flood response.
                <br />
                Under changing
                <br />
                <span className="italic text-amber-800">conditions.</span>
              </h1>
              <p className="text-lg text-neutral-600 leading-relaxed max-w-md mb-8">
                Roads close. Shelters fill. Reports disagree. Explore how rescue teams
                can coordinate when the plan can no longer hold.
              </p>
              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-6 mb-12">
                <Link
                  href="/simulation"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
                >
                  <span>Enter the simulation</span>
                  <Play className="w-3.5 h-3.5 fill-current" />
                </Link>
                <Link
                  href="/methodology"
                  className="text-sm font-medium text-neutral-900 hover:text-amber-800 transition-colors border-b border-neutral-900 pb-0.5"
                >
                  Read the methodology
                </Link>
              </div>
            </div>
            <div className="text-xs text-neutral-500 font-mono pt-4 border-t border-neutral-200">
              A synthetic coordination study
              <br />
              for India&apos;s disaster-response context.
            </div>
          </div>

          {/* Right Column: Live Operational Map Preview with 2D / 3D Cesium Toggle */}
          <div className="lg:col-span-7">
            <div className="border border-neutral-300 relative bg-[#1A2530]">
              {/* 2D / 3D Cesium / Google Maps Toggle */}
              <div className="absolute top-3 right-16 z-20 flex border border-neutral-700 bg-neutral-900/90 text-[10px] font-mono">
                <button
                  onClick={() => setPreviewMode2d3d('2d')}
                  className={`px-2.5 py-1 cursor-pointer ${
                    previewMode2d3d === '2d' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  2D Tactical
                </button>
                <button
                  onClick={() => setPreviewMode2d3d('gmaps')}
                  className={`px-2.5 py-1 cursor-pointer flex items-center gap-1 ${
                    previewMode2d3d === 'gmaps' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <span>Google GIS</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </button>
                <button
                  onClick={() => setPreviewMode2d3d('3d')}
                  className={`px-2.5 py-1 cursor-pointer flex items-center gap-1 ${
                    previewMode2d3d === '3d' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <span>3D Cesium</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                </button>
              </div>

              {previewMode2d3d === '3d' ? (
                <CesiumTerrainView
                  riverStageMeters={riverStageMeters}
                  bridgeIsOpen={bridgeIsOpen}
                  className="h-[380px] sm:h-[420px]"
                />
              ) : previewMode2d3d === 'gmaps' ? (
                <GoogleMapsGisView
                  riverStageMeters={riverStageMeters}
                  bridgeIsOpen={bridgeIsOpen}
                  className="h-[380px] sm:h-[420px]"
                />
              ) : (
                <NetworkMap
                  nodes={previewState.nodes}
                  edges={previewState.edges}
                  resources={previewState.resources}
                  currentMinute={previewState.currentMinute}
                  timeString="T+04 min"
                  className="h-[380px] sm:h-[420px]"
                />
              )}
            </div>

            <div className="flex justify-between items-center text-xs text-neutral-500 font-mono mt-2 px-1">
              <span>Exercise extract • Monsoon surge</span>
              <span>Road and water graph (Saryu Basin)</span>
            </div>
          </div>
        </div>

        {/* Live Interaction Strip (Exact match to original) */}
        <div className="mt-12 p-6 border border-neutral-300 bg-neutral-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="font-medium text-sm text-neutral-900">
              The current plan, at minute 04.
            </div>
            <div className="text-xs text-neutral-600 mt-0.5">
              Three resources are committed. One disruption will change their options.
            </div>
            {triggeredNotice && (
              <div className="text-xs font-mono text-red-700 mt-1 font-semibold">
                {triggeredNotice}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleEarlyEvac}
              className="px-4 py-2 bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-800 transition-colors whitespace-nowrap cursor-pointer"
            >
              Deploy advance evac
            </button>
            <button
              onClick={handleTriggerFailure}
              className="px-4 py-2 border border-neutral-900 text-xs font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors whitespace-nowrap cursor-pointer"
            >
              Trigger combined failure
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================
          BUBBLES AI SEARCH & EXPLORER BANNER
          "make the home page have an extra ai page so anyone can look anything on the website"
         ============================================================ */}
      <section className="border-t border-neutral-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-2 border-neutral-900 bg-neutral-900 text-white p-6 sm:p-8 relative overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="max-w-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-400 text-neutral-950 text-xs font-mono font-bold uppercase tracking-wide">
                    <Sparkles className="w-3.5 h-3.5" />
                    BUBBLES AI Explorer
                  </span>
                  <span className="text-xs font-mono text-neutral-400">
                    Comprehensive Site Intelligence
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                  Look Up <span className="text-amber-400 italic">Anything</span> on the Website
                </h2>
                <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
                  Have a question about flood simulation scenarios, 3D Cesium topography, Google GIS layers, river overflow physics, safe high-ground shelters, or coordination algorithms? The BUBBLES AI Page provides instant answers with direct page navigation.
                </p>
              </div>

              {/* Action Button */}
              <div className="shrink-0">
                <Link
                  href="/ai"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-sm font-semibold transition-colors shadow-sm cursor-pointer whitespace-nowrap"
                >
                  <Bot className="w-4 h-4" />
                  <span>Launch BUBBLES AI Page</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Quick Search Bar right on Home Page */}
            <div className="relative z-10 mt-6 pt-5 border-t border-neutral-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (homeSearchQuery.trim()) {
                    router.push(`/ai`);
                  } else {
                    router.push('/ai');
                  }
                }}
                className="flex flex-col sm:flex-row gap-2"
              >
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={homeSearchQuery}
                    onChange={(e) => setHomeSearchQuery(e.target.value)}
                    placeholder="Search anything (e.g. 'How do I run Scenario 02?', '3D Cesium GIS', 'Naya Tola elevation', 'Helpline numbers')..."
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-800 border border-neutral-700 text-white text-sm placeholder:text-neutral-400 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-neutral-100 hover:bg-white text-neutral-900 text-xs font-mono font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search Full Site</span>
                </button>
              </form>

              {/* Quick Prompt Chips */}
              <div className="flex flex-wrap items-center gap-2 mt-3 text-xs font-mono">
                <span className="text-neutral-400 text-[11px]">Popular searches:</span>
                {[
                  'Side-by-Side 3D Cesium GIS',
                  'Scenario 02 Bridge Collapse',
                  'Naya Tola Elevation 45m',
                  'River Overflow Hydraulics',
                  'Safe Shelters & Beds',
                  'Bilingual Civil Defense Siren',
                  'Offline Safety Dossier',
                ].map((item, idx) => (
                  <Link
                    key={idx}
                    href="/ai"
                    className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 text-[11px] transition-colors"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          DASHBOARD AI CHATBOT & REAL-LIFE DISASTER MODULES SECTION
         ============================================================ */}
      <section className="border-t border-neutral-200 py-12 bg-neutral-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-neutral-300 pb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-amber-800 font-bold block mb-1">
                Real-Time Decision Support Dashboard
              </span>
              <h2 className="text-3xl font-serif text-neutral-900 tracking-tight">
                Operational AI Assistant & Basin Intelligence
              </h2>
            </div>
            {/* Dashboard Feature Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <Link
                href="/ai"
                className="px-3 py-1.5 border border-amber-800 bg-amber-800 hover:bg-amber-900 text-white font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                title="Open comprehensive BUBBLES AI page"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>BUBBLES AI Page</span>
              </Link>
              <button
                onClick={() => setActiveModule('ai_chat')}
                className={`px-3 py-1.5 border transition-colors cursor-pointer ${
                  activeModule === 'ai_chat' ? 'bg-neutral-900 text-white border-neutral-900 font-bold' : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                }`}
              >
                AI Chatbot
              </button>
              <button
                onClick={() => setActiveModule('side_by_side')}
                className={`px-3 py-1.5 border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeModule === 'side_by_side' ? 'bg-neutral-900 text-white border-neutral-900 font-bold' : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                }`}
              >
                <span>Side-by-Side GIS & Cesium</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </button>
              <button
                onClick={() => setActiveModule('river_diagram')}
                className={`px-3 py-1.5 border transition-colors cursor-pointer ${
                  activeModule === 'river_diagram' ? 'bg-neutral-900 text-white border-neutral-900 font-bold' : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                }`}
              >
                River Overflow Diagram
              </button>
              <button
                onClick={() => setActiveModule('risk_map')}
                className={`px-3 py-1.5 border transition-colors cursor-pointer ${
                  activeModule === 'risk_map' ? 'bg-neutral-900 text-white border-neutral-900 font-bold' : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                }`}
              >
                Dynamic 3D Risk Map
              </button>
              <button
                onClick={() => setActiveModule('early_evac')}
                className={`px-3 py-1.5 border transition-colors cursor-pointer ${
                  activeModule === 'early_evac' ? 'bg-neutral-900 text-white border-neutral-900 font-bold' : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                }`}
              >
                Early Evacuation
              </button>
              <button
                onClick={() => setActiveModule('shelters')}
                className={`px-3 py-1.5 border transition-colors cursor-pointer ${
                  activeModule === 'shelters' ? 'bg-neutral-900 text-white border-neutral-900 font-bold' : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                }`}
              >
                Shelters & Alerts
              </button>
              <button
                onClick={() => setActiveModule('offline_hub')}
                className={`px-3 py-1.5 border transition-colors cursor-pointer ${
                  activeModule === 'offline_hub' ? 'bg-neutral-900 text-white border-neutral-900 font-bold' : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                }`}
              >
                Offline Safety Pack
              </button>
            </div>
          </div>

          {/* Module 1: AI Chatbot (Default) */}
          {activeModule === 'ai_chat' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-4 space-y-4">
                <div className="p-5 border border-neutral-300 bg-white space-y-3">
                  <h3 className="font-serif font-bold text-lg text-neutral-900">
                    Ask Questions Directly from the Dashboard
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                    Interrogate the multi-agent coordination state, check whether roads or bridges are flooded, inspect safe shelters, and receive authoritative flood guidance.
                  </p>
                  <div className="border-t border-neutral-200 pt-3 text-xs font-mono space-y-1.5 text-neutral-600">
                    <div>• Grounded in Saryu River Basin model</div>
                    <div>• Considers current stage ({riverStageMeters.toFixed(1)}m)</div>
                    <div>• Prioritizes lowest-elevation zones</div>
                    <div>• Voice synthesis available for rain storms</div>
                  </div>
                </div>

                <div className="p-4 border border-neutral-300 bg-amber-50/70 text-amber-950 text-xs">
                  <span className="font-bold font-mono block mb-1">REAL-LIFE EARLY ACTION:</span>
                  <p className="leading-relaxed font-sans">
                    Low-lying settlements (Naya Tola at 45m & Moti Basti at 46.2m) flood 35 minutes before higher wards. Ask the AI: <em>&ldquo;Which low-lying areas need evacuation first?&rdquo;</em>
                  </p>
                </div>
              </div>

              <div className="lg:col-span-8">
                <AIChatBot
                  simulationState={previewState}
                  riverStageMeters={riverStageMeters}
                  bridgeIsOpen={bridgeIsOpen}
                  onNavigateToTab={(tab) => {
                    if (tab === 'river_diagram') setActiveModule('river_diagram');
                    else if (tab === 'risk_map') setActiveModule('risk_map');
                    else if (tab === 'early_evac') setActiveModule('early_evac');
                    else if (tab === 'shelters') setActiveModule('shelters');
                    else if (tab === 'offline_hub') setActiveModule('offline_hub');
                    else router.push('/simulation');
                  }}
                />
              </div>
            </div>
          )}

          {/* Module: Side-by-Side GIS & Cesium */}
          {activeModule === 'side_by_side' && (
            <SideBySideGisCesium
              riverStageMeters={riverStageMeters}
              bridgeIsOpen={bridgeIsOpen}
            />
          )}

          {/* Module 2: River Overflow Diagram */}
          {activeModule === 'river_diagram' && (
            <RiverOverflowDiagram
              currentStage={riverStageMeters}
              onStageChange={(s) => setRiverStageMeters(s)}
              onTriggerEarlyEvac={handleEarlyEvac}
            />
          )}

          {/* Module 3: Dynamic 3D Risk Map */}
          {activeModule === 'risk_map' && (
            <DynamicRiskMapOverlay riverStageMeters={riverStageMeters} />
          )}

          {/* Module 4: Early Evacuation */}
          {activeModule === 'early_evac' && (
            <PreDisasterEvacuationPlanner
              simulationState={previewState}
              onUpdateState={(st) => setPreviewState(st)}
              riverStageMeters={riverStageMeters}
            />
          )}

          {/* Module 5: Shelters & Alerts */}
          {activeModule === 'shelters' && (
            <GeolocationShelters riverStageMeters={riverStageMeters} />
          )}

          {/* Module 6: Offline Hub */}
          {activeModule === 'offline_hub' && (
            <OfflineSafetyHub />
          )}
        </div>
      </section>

      {/* Section 2: "The difficulty is in the coordination." (Exact match to original) */}
      <section className="border-t border-neutral-200 py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-5">
              <h2 className="text-3xl sm:text-4xl font-serif text-neutral-900 mb-6 tracking-tight">
                The difficulty is
                <br />
                in the coordination.
              </h2>
              <p className="text-base text-neutral-600 leading-relaxed max-w-md">
                A boat, a rescue team and a shelter see different parts of the same
                emergency. They need to agree on who goes where, with limited capacity
                and incomplete information.
              </p>
            </div>
            <div className="lg:col-span-7 flex flex-col justify-between">
              <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                BUBBLES makes that problem visible. Run a fictional district through
                changing conditions. Inspect what each resource commits to, which
                commitments break, and the reasons behind each reassignment.
              </p>
              <div className="divide-y divide-neutral-200 border-t border-b border-neutral-200">
                <div className="py-3.5 grid grid-cols-1 sm:grid-cols-12 gap-2 text-sm">
                  <span className="sm:col-span-4 font-medium text-neutral-900">
                    Partial information
                  </span>
                  <span className="sm:col-span-8 text-neutral-600">
                    Confidence travels with each incident report.
                  </span>
                </div>
                <div className="py-3.5 grid grid-cols-1 sm:grid-cols-12 gap-2 text-sm">
                  <span className="sm:col-span-4 font-medium text-neutral-900">
                    Shared capacity
                  </span>
                  <span className="sm:col-span-8 text-neutral-600">
                    Every accepted trip reserves its shelter places.
                  </span>
                </div>
                <div className="py-3.5 grid grid-cols-1 sm:grid-cols-12 gap-2 text-sm">
                  <span className="sm:col-span-4 font-medium text-neutral-900">
                    Unequal urgency
                  </span>
                  <span className="sm:col-span-8 text-neutral-600">
                    Priority and waiting time influence assignments.
                  </span>
                </div>
                <div className="py-3.5 grid grid-cols-1 sm:grid-cols-12 gap-2 text-sm">
                  <span className="sm:col-span-4 font-medium text-neutral-900">
                    Explicit constraints
                  </span>
                  <span className="sm:col-span-8 text-neutral-600">
                    Closed routes and failed resources are excluded.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: "Put the plan under pressure." (Exercises List) */}
      <section className="border-t border-neutral-200 py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-baseline mb-8">
            <h2 className="text-3xl sm:text-4xl font-serif text-neutral-900 tracking-tight">
              Put the plan under pressure.
            </h2>
            <Link
              href="/exercises"
              className="text-xs text-neutral-600 hover:text-neutral-900 underline font-mono"
            >
              Explore the exercises
            </Link>
          </div>
          <div className="divide-y divide-neutral-200 border-t border-b border-neutral-200">
            {/* Exercise 01 */}
            <div className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-2 text-xs font-mono text-neutral-500">
                Capacity & urgency
              </div>
              <div className="lg:col-span-3">
                <h3 className="text-2xl font-serif text-neutral-900">Monsoon surge</h3>
              </div>
              <div className="lg:col-span-5 text-sm text-neutral-600">
                Thirty-eight people. Four rescue resources. Two shelters. Decide how to
                serve competing requests.
              </div>
              <div className="lg:col-span-2 text-right">
                <Link
                  href="/simulation?scenario=01"
                  className="text-xs font-medium text-neutral-900 hover:text-amber-800 underline"
                >
                  View exercise
                </Link>
              </div>
            </div>
            {/* Exercise 02 */}
            <div className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-2 text-xs font-mono text-neutral-500">
                Simultaneous disruption
              </div>
              <div className="lg:col-span-3">
                <h3 className="text-2xl font-serif text-neutral-900">Cascading failure</h3>
              </div>
              <div className="lg:col-span-5 text-sm text-neutral-600">
                A bridge closes, a boat fails and a shelter fills at minute five. Follow
                the consequences.
              </div>
              <div className="lg:col-span-2 text-right">
                <Link
                  href="/simulation?scenario=02"
                  className="text-xs font-medium text-neutral-900 hover:text-amber-800 underline"
                >
                  View exercise
                </Link>
              </div>
            </div>
            {/* Exercise 03 */}
            <div className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-2 text-xs font-mono text-neutral-500">
                Conflicting information
              </div>
              <div className="lg:col-span-3">
                <h3 className="text-2xl font-serif text-neutral-900">Reports in disagreement</h3>
              </div>
              <div className="lg:col-span-5 text-sm text-neutral-600">
                A reported reopening contradicts a confirmed closure. Test the model&apos;s
                conservative response.
              </div>
              <div className="lg:col-span-2 text-right">
                <Link
                  href="/simulation?scenario=03"
                  className="text-xs font-medium text-neutral-900 hover:text-amber-800 underline"
                >
                  View exercise
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: "Make the decisions explainable." */}
      <section className="bg-neutral-900 text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <h2 className="text-3xl sm:text-5xl font-serif tracking-tight leading-tight mb-4">
                Make the decisions
                <br />
                <span className="italic text-amber-500">explainable.</span>
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="text-neutral-300 text-sm leading-relaxed mb-6">
                Compare decentralised negotiation with a central dispatcher using the same
                starting conditions. Then replay the run, minute by minute.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-neutral-400 font-mono mb-8">
                <span>Time to service</span>
                <span>Unmet demand</span>
                <span>Idle time</span>
                <span>Route violations</span>
                <span>Neighbourhood fairness</span>
                <span>Recovery time</span>
              </div>
              <Link
                href="/methodology"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-neutral-900 text-xs font-medium hover:bg-neutral-100 transition-colors"
              >
                <span>Open replay & comparison</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Scope & Assumptions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <h2 className="text-2xl sm:text-3xl font-serif text-neutral-900">
                An exercise environment,
                <br />
                with its assumptions in view.
              </h2>
            </div>
            <div className="lg:col-span-7 text-sm text-neutral-600 leading-relaxed space-y-4 font-sans">
              <p>
                Designed for disaster-management research, emergency-service training
                discussions and student projects in India. Every location, request and
                resource is synthetic.
              </p>
              <p>
                The prototype models coordination heuristics. It does not dispatch crews
                or provide routes for real emergencies.
              </p>
              <div className="pt-2">
                <Link
                  href="/terms"
                  className="text-neutral-900 underline hover:text-amber-800 text-xs font-mono"
                >
                  Read the model&apos;s scope and limitations
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
