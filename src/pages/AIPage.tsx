import React, { useState, useEffect, useRef } from 'react';
import { Link, useRouter } from '../lib/navigation';
import {
  Sparkles,
  Search,
  Bot,
  User,
  ArrowRight,
  ExternalLink,
  Layers,
  MapPin,
  Waves,
  ShieldCheck,
  Compass,
  Radio,
  FileText,
  Volume2,
  VolumeX,
  Clock,
  Send,
  HelpCircle,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
} from 'lucide-react';

interface SiteFeature {
  id: string;
  title: string;
  category: 'Simulation' | 'Mapping & GIS' | 'Shelters & Alerts' | 'Hydrology' | 'Methodology' | 'Emergency Comms' | 'Statutory';
  description: string;
  path: string;
  isHomeModule?: boolean;
  moduleKey?: string;
  tags: string[];
  suggestedPrompt: string;
}

export const SITE_INDEX: SiteFeature[] = [
  {
    id: 'feat_home_dash',
    title: 'Operational Decision Dashboard',
    category: 'Simulation',
    description: 'Central real-time monitoring center with live telemetry, minute ticker (T+04 min), and cascading failure triggers.',
    path: '/',
    tags: ['dashboard', 'home', 'telemetry', 'real-time', 'minute', 'overview'],
    suggestedPrompt: 'What live telemetry and controls are displayed on the main dashboard?',
  },
  {
    id: 'feat_ai_chat',
    title: 'BUBBLES Operational AI Commander',
    category: 'Emergency Comms',
    description: 'Embedded AI assistant providing live advice on bridge passability, evacuation priorities, and safe shelter vacancies.',
    path: '/',
    isHomeModule: true,
    moduleKey: 'ai_chat',
    tags: ['ai', 'chat', 'assistant', 'bot', 'gemini', 'advisor', 'questions'],
    suggestedPrompt: 'How does the BUBBLES Operational AI Commander assist flood rescue teams?',
  },
  {
    id: 'feat_side_by_side',
    title: 'Side-by-Side Google GIS & 3D Cesium Terrain',
    category: 'Mapping & GIS',
    description: 'Simultaneous synchronized dual-viewport displaying Google Maps Road/Satellite/Terrain alongside CesiumJS 3D topography.',
    path: '/',
    isHomeModule: true,
    moduleKey: 'side_by_side',
    tags: ['gis', 'google maps', 'cesium', '3d', 'satellite', 'terrain', 'side by side', 'dual'],
    suggestedPrompt: 'How do I use the Side-by-Side Google GIS and CesiumJS 3D Terrain view?',
  },
  {
    id: 'feat_cesium_3d',
    title: 'CesiumJS 3D Satellite & Topography Globe',
    category: 'Mapping & GIS',
    description: 'True 3D geospatial globe featuring high-resolution satellite imagery, 2.0x terrain exaggeration, and 3D flood inundation water volumes.',
    path: '/',
    isHomeModule: true,
    moduleKey: 'risk_map',
    tags: ['cesium', '3d terrain', 'globe', 'elevation', 'satellite', 'flood volume'],
    suggestedPrompt: 'Explain how CesiumJS visualizes 3D flood inundation volumes and terrain elevation.',
  },
  {
    id: 'feat_google_gis',
    title: 'Google Maps GIS Live Tactical Layer',
    category: 'Mapping & GIS',
    description: 'Live Google Maps JavaScript API integration with topological graph overlays, hazard beacons, and shelter markers.',
    path: '/',
    tags: ['google maps', 'gis', 'api key', 'layers', 'markers', 'polylines'],
    suggestedPrompt: 'How does the Google Maps GIS interface display river flooding and road networks?',
  },
  {
    id: 'feat_river_diagram',
    title: 'River Overflow & Embankment Breach Physical Diagram',
    category: 'Hydrology',
    description: 'Interactive hydraulic cross-section visualizing water elevation vs 54.5m embankment crest, breach flow rates, and lead time matrices.',
    path: '/',
    isHomeModule: true,
    moduleKey: 'river_diagram',
    tags: ['river', 'overflow', 'hydrology', 'weir', 'embankment', 'breach', 'water level', 'physics'],
    suggestedPrompt: 'How does the river overflow diagram calculate weir overtopping and embankment breach?',
  },
  {
    id: 'feat_dynamic_risk',
    title: 'Dynamic Regional Flood Risk Map Overlay',
    category: 'Mapping & GIS',
    description: 'Multi-layer flood depth contours (0-2.8m), river velocity discharge vectors, elevation heatmaps, and safe evacuation corridors.',
    path: '/',
    isHomeModule: true,
    moduleKey: 'risk_map',
    tags: ['risk map', 'heatmap', 'depth contours', 'overlay', 'velocity', 'corridors'],
    suggestedPrompt: 'What layers and depth contours are included in the Dynamic Flood Risk Map?',
  },
  {
    id: 'feat_early_evac',
    title: 'Pre-Disaster Early Evacuation Planner',
    category: 'Shelters & Alerts',
    description: 'Advance evacuation dispatch prioritizing lowest-lying zones (Naya Tola 45m & Moti Basti 46.2m) to rescue families before water enters homes.',
    path: '/',
    isHomeModule: true,
    moduleKey: 'early_evac',
    tags: ['pre-disaster', 'early evacuation', 'low-lying', 'naya tola', 'moti basti', 'vulnerability', 'advance'],
    suggestedPrompt: 'How does pre-disaster evacuation prioritize low-lying settlements before flood crests?',
  },
  {
    id: 'feat_shelters_geo',
    title: 'Geolocation Safe Shelters & Emergency Alerts',
    category: 'Shelters & Alerts',
    description: 'HTML5 geolocation distance and ETA calculator to high-ground shelters (School 62m, Community 59m) with live capacity and emergency broadcast feeds.',
    path: '/',
    isHomeModule: true,
    moduleKey: 'shelters',
    tags: ['shelters', 'geolocation', 'gps', 'proximity', 'distance', 'alerts', 'beds', 'capacity'],
    suggestedPrompt: 'Where are the designated high-ground safe shelters and how is distance calculated?',
  },
  {
    id: 'feat_offline_hub',
    title: 'Offline Safety Pack & Printable Dossier',
    category: 'Emergency Comms',
    description: 'Browser localStorage safety directory with 8-step survival checklist, snakebite & water purification protocols, and printable offline text dossier.',
    path: '/',
    isHomeModule: true,
    moduleKey: 'offline_hub',
    tags: ['offline', 'survival kit', 'checklist', 'localstorage', 'printable', 'dossier', 'without internet'],
    suggestedPrompt: 'What emergency data and first-aid protocols are stored in the Offline Safety Pack?',
  },
  {
    id: 'feat_sim_page',
    title: 'Multi-Agent Simulation Canvas & Inspector',
    category: 'Simulation',
    description: 'Full simulation workspace featuring step-by-step time controls, resource inspector (RT-01, RT-02, BT-01, BT-02), and complete decision audit trails.',
    path: '/simulation',
    tags: ['simulation', 'canvas', 'play', 'pause', 'reassignment', 'multi-agent', 'audit trail'],
    suggestedPrompt: 'How do rescue teams and boats dynamically reassign when bridges collapse in the simulation?',
  },
  {
    id: 'feat_exercises',
    title: 'Tabletop Scenarios 01, 02, and 03',
    category: 'Simulation',
    description: 'Three standardized disaster exercises: Baseline Monsoon Surge (01), Cascading Bridge Failure & Shelter Saturation (02), and Rapid Flash Flood (03).',
    path: '/exercises',
    tags: ['exercises', 'scenarios', 'scenario 01', 'scenario 02', 'scenario 03', 'drills', 'tabletop'],
    suggestedPrompt: 'What are the three simulation exercises and what challenges do they test?',
  },
  {
    id: 'feat_methodology',
    title: 'Coordination Methodology & Algorithmic Benchmark',
    category: 'Methodology',
    description: 'Peer-reviewed comparison of Decentralized Contract Net Protocol (CNP) vs Centralized Hungarian lookahead under communications failure.',
    path: '/methodology',
    tags: ['methodology', 'algorithm', 'contract net protocol', 'cnp', 'hungarian', 'benchmark', 'safety invariants'],
    suggestedPrompt: 'Why does Decentralized Contract Net Protocol outperform Centralized algorithms during flood network cuts?',
  },
  {
    id: 'feat_audio_dispatch',
    title: 'Tactical Audio Dispatch & Civil Defense Siren',
    category: 'Emergency Comms',
    description: 'Acoustic dual-tone disaster warning siren synthesizer (Web Audio API) and bilingual automated voice announcements in English & Hindi.',
    path: '/audio-dispatch',
    tags: ['audio', 'siren', 'voice', 'bilingual', 'hindi', 'english', 'radio', 'speech', 'sound'],
    suggestedPrompt: 'How does the tactical audio dispatch synthesize bilingual radio broadcasts and sirens?',
  },
  {
    id: 'feat_rescuer_login',
    title: 'Field Officer & Rescuer Access Portal',
    category: 'Statutory',
    description: 'Role-based credentials for Incident Commanders, Rescue Boat Leads, Land Team Leads, Shelter Managers, and Field Volunteers.',
    path: '/login',
    tags: ['login', 'roles', 'commander', 'boat crew', 'shelter manager', 'credentials'],
    suggestedPrompt: 'What operational roles exist in BUBBLES and how can I test them?',
  },
  {
    id: 'feat_statutory_terms',
    title: 'Disaster Management Act 2005 Protocols',
    category: 'Statutory',
    description: 'Formal statutory alignment with NDMA, SDMA, DDMA, and NDRF operational mandates under Sections 38 and 39 of the DM Act.',
    path: '/terms',
    tags: ['dm act 2005', 'terms', 'ndma', 'ndrf', 'statutory', 'legal', 'compliance'],
    suggestedPrompt: 'How is BUBBLES aligned with the Disaster Management Act, 2005?',
  },
  {
    id: 'feat_dpdp_privacy',
    title: 'DPDP Act 2023 Privacy Principles',
    category: 'Statutory',
    description: 'Data minimization policies adhering to India\'s Digital Personal Data Protection Act with synthetic civilian identifiers and 90-day cryptographic purge.',
    path: '/privacy',
    tags: ['privacy', 'dpdp act 2023', 'data protection', 'anonymization', 'synthetic'],
    suggestedPrompt: 'What privacy safeguards and data protection principles are enforced by BUBBLES?',
  },
  {
    id: 'feat_contact',
    title: 'Institutional Contacts & Research Collaboration',
    category: 'Statutory',
    description: 'Emergency switchboard numbers, NDMA control rooms, research partner affiliations, and official operational access request forms.',
    path: '/contact',
    tags: ['contact', 'helpline', 'ndrf phone', 'collaboration', 'research', 'support'],
    suggestedPrompt: 'What emergency helpline numbers and research contacts are available?',
  },
];

const CATEGORIES = [
  'All Topics',
  'Simulation',
  'Mapping & GIS',
  'Shelters & Alerts',
  'Hydrology',
  'Methodology',
  'Emergency Comms',
  'Statutory',
] as const;

export default function AIPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Topics');
  const [activeTab, setActiveTab] = useState<'ask' | 'catalog'>('ask');

  // AI Chat states
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    Array<{
      id: string;
      role: 'user' | 'assistant';
      text: string;
      timestamp: string;
      relatedFeatures?: SiteFeature[];
    }>
  >([
    {
      id: 'ai_intro',
      role: 'assistant',
      text: `Hello! I am the **BUBBLES Site Intelligence & Operational Assistant**. 

You can ask me to find, explain, or launch **anything across this entire portal**:
- **Simulations & Tabletop Scenarios** (Scenarios 01, 02, 03)
- **Side-by-Side Google GIS & 3D CesiumJS Terrain**
- **River Overflow Hydraulics & Embankment Breach Models**
- **Pre-Disaster Evacuation for Low-Lying Wards** (Naya Tola & Moti Basti)
- **High-Ground Shelters & Geolocation Proximity**
- **Offline Survival Checklist & Printable Dossier**
- **Bilingual Audio Broadcasts & Civil Defense Warning Siren**
- **Algorithmic Benchmarks** (Contract Net Protocol vs Hungarian Lookahead)

What would you like to explore or navigate to right now?`,
      timestamp: 'Just now',
      relatedFeatures: [
        SITE_INDEX.find((f) => f.id === 'feat_side_by_side')!,
        SITE_INDEX.find((f) => f.id === 'feat_early_evac')!,
        SITE_INDEX.find((f) => f.id === 'feat_exercises')!,
        SITE_INDEX.find((f) => f.id === 'feat_river_diagram')!,
      ].filter(Boolean),
    },
  ]);

  const chatScrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (chatHistory.length > 1 && chatScrollContainerRef.current) {
      chatScrollContainerRef.current.scrollTo({
        top: chatScrollContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chatHistory, isLoading]);

  // Text to Speech
  const handleSpeak = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const cleanText = text.replace(/[*#_`[\]()]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Filter features based on search and category
  const filteredFeatures = SITE_INDEX.filter((feat) => {
    const matchesCat = selectedCategory === 'All Topics' || feat.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCat;
    const matchesQuery =
      feat.title.toLowerCase().includes(q) ||
      feat.description.toLowerCase().includes(q) ||
      feat.category.toLowerCase().includes(q) ||
      feat.tags.some((t) => t.toLowerCase().includes(q));
    return matchesCat && matchesQuery;
  });

  // Smart Query Handler
  const handleAskAI = async (queryText: string) => {
    const userText = queryText.trim();
    if (!userText || isLoading) return;

    const userMsg = {
      id: `u_${Date.now()}`,
      role: 'user' as const,
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsLoading(true);

    // Identify related features automatically
    const qLower = userText.toLowerCase();
    const related = SITE_INDEX.filter((f) =>
      f.tags.some((t) => qLower.includes(t)) ||
      f.title.toLowerCase().split(' ').some((w) => w.length > 3 && qLower.includes(w))
    ).slice(0, 4);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `The user is looking up something on the BUBBLES website: "${userText}". 
Explain what feature or page on the website answers their question, how to access it, and provide the technical/operational details. 
Mention exact page routes (e.g. /, /simulation, /exercises, /methodology, /audio-dispatch, /login, /contact) and modules.`,
          context: {
            riverStageMeters: 51.8,
            bridgeIsOpen: true,
            simulationTime: 'T+04 min',
          },
        }),
      });

      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();

      const assistantMsg = {
        id: `a_${Date.now()}`,
        role: 'assistant' as const,
        text: data.reply || 'Here is what I found on the BUBBLES portal.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        relatedFeatures: related.length > 0 ? related : undefined,
      };

      setChatHistory((prev) => [...prev, assistantMsg]);
    } catch {
      // Offline fallback tailored to site navigation
      let fallback = `**BUBBLES Site Knowledge Engine:**\n\n`;

      if (qLower.includes('scenario') || qLower.includes('exercise')) {
        fallback += `You can test all 3 disaster drills on the **Exercises Page** (\`/exercises\`):
1. **Scenario 01 (Monsoon Surge)**: Baseline multi-agent resource coordination.
2. **Scenario 02 (Cascading Failure)**: Purab Bridge closed to wheeled traffic + School Shelter saturated.
3. **Scenario 03 (Rapid Inundation)**: Upstream dam release with fast flood wave.
👉 Click **"Open Exercises"** below to start a drill.`;
      } else if (qLower.includes('cesium') || qLower.includes('gis') || qLower.includes('map') || qLower.includes('google')) {
        fallback += `The portal features a state-of-the-art **Side-by-Side Google GIS & 3D CesiumJS Terrain** viewer:
- **Google Maps GIS**: Tactical road overlays, hazard nodes, and shelter pins.
- **CesiumJS 3D Globe**: 3D satellite topography, terrain elevation exaggeration, and animated flood volumes.
👉 Access it via the **"Side-by-Side GIS & Cesium"** tab on the Home dashboard or click the quick action below.`;
      } else if (qLower.includes('river') || qLower.includes('breach') || qLower.includes('overflow') || qLower.includes('diagram')) {
        fallback += `The **River Overflow & Embankment Breach Diagram** visualizes:
- Saryu River Stage (current 51.8m) vs 54.5m Embankment Crest.
- Broad-crested weir overtopping discharge ($Q = C \\cdot L \\cdot H^{1.5}$).
- Inundation lead times for low-lying settlements (Naya Tola 45m floods in ~35 mins).
👉 View it directly on the Home page under the **"River Overflow Diagram"** module.`;
      } else if (qLower.includes('low') || qLower.includes('evac') || qLower.includes('early') || qLower.includes('priorit')) {
        fallback += `The **Pre-Disaster Early Evacuation Planner** enforces the safety invariant that help must arrive *before* disaster strikes:
- **Naya Tola (45.0m elevation)**: Lowest settlement, highest flood risk.
- **Moti Basti (46.2m elevation)**: Evacuation lead time is 45 mins.
- Advance dispatch button pre-deploys Boat BT-01 and Team RT-01 to high ground before access roads submerge.
👉 Located under **"Early Evacuation"** on the Home dashboard.`;
      } else if (qLower.includes('shelter') || qLower.includes('bed') || qLower.includes('nearest') || qLower.includes('geo')) {
        fallback += `The **Geolocation Shelters & Alerts** system calculates live distance from your GPS coordinates:
- **School Shelter (Ridge High)**: Elevation 62.0m | 26 / 80 beds free | Safe road access.
- **Community Shelter (South Mound)**: Elevation 59.0m | 24 / 60 beds free | High ground.
- **Relief Camp Alpha**: Elevation 58.0m | 24 / 120 beds free.
👉 Use the **"Shelters & Alerts"** tab on the Home page for one-click routing.`;
      } else if (qLower.includes('offline') || qLower.includes('dossier') || qLower.includes('pack') || qLower.includes('survival')) {
        fallback += `The **Offline Safety Pack** stores critical survival data directly in your browser's local memory:
- 8-point pre-evacuation checklist (Aadhaar cards in plastic bags, 4L water, medications).
- Emergency helpline directory (NDRF 1078, ERSS 112, VHF Ch 16).
- First-aid guides for water purification and snakebites.
- Single-click download of the complete printable emergency text dossier.
👉 Accessible via **"Offline Safety Pack"** on the Home page.`;
      } else if (qLower.includes('siren') || qLower.includes('audio') || qLower.includes('voice') || qLower.includes('hindi')) {
        fallback += `The **Tactical Audio Dispatch** page (\`/audio-dispatch\`) features:
- **Civil Defense Acoustic Siren**: Synthesizes standard dual-tone wavering emergency sirens directly via Web Audio API.
- **Bilingual Radio Broadcasts**: Automated voice readouts in clear English and Hindi (हिन्दी) for continuous weather and evacuation warnings.
👉 Navigate to **"Audio Dispatch"** in the top navigation.`;
      } else if (qLower.includes('algorithm') || qLower.includes('cnp') || qLower.includes('hungarian') || qLower.includes('methodology')) {
        fallback += `The **Methodology Benchmark** (\`/methodology\`) evaluates:
- **Contract Net Protocol (CNP)**: Decentralized multi-agent bidding that survives communication network severance.
- **Hungarian Method**: Centralized global optimal assignment which suffers high disruption fragility during sudden bridge cuts.
👉 Check out the interactive benchmark and safety invariant mathematical specifications on the Methodology page.`;
      } else {
        fallback += `BUBBLES contains complete resources for:
1. **Simulation Workspace** (\`/simulation\`): Live step-by-step dispatch.
2. **Interactive Exercises** (\`/exercises\`): Scenarios 01 to 03.
3. **Side-by-Side Google GIS & 3D Cesium**: Topography and satellite view.
4. **River Overflow Physics**: Embankment overtopping equations.
5. **Pre-Disaster Advance Evacuation**: Protecting lowest elevations first.
6. **Shelters & Emergency Radio**: National Helplines 1078 & 112.

Try asking about any of these, or select one of the quick cards below!`;
      }

      const fallbackMsg = {
        id: `a_${Date.now()}`,
        role: 'assistant' as const,
        text: fallback,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        relatedFeatures: related.length > 0 ? related : undefined,
      };

      setChatHistory((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLaunchFeature = (feat: SiteFeature) => {
    if (feat.path === '/' && feat.isHomeModule && feat.moduleKey) {
      router.push(`/?module=${feat.moduleKey}`);
    } else {
      router.push(feat.path);
    }
  };

  return (
    <div className="bg-neutral-50 min-h-[calc(100vh-140px)] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Banner */}
        <div className="bg-white border border-neutral-300 p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 text-xs font-mono font-bold uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                BUBBLES Site Intelligence
              </span>
              <span className="text-xs font-mono text-neutral-500">
                • 16 Indexed Modules • Real-Time Grounding
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 tracking-tight">
              Look Up <span className="italic text-amber-800">Anything</span> on BUBBLES
            </h1>
            <p className="text-sm text-neutral-600 max-w-2xl mt-1.5 leading-relaxed font-sans">
              Search any simulation scenario, GIS & Cesium 3D map, river overflow physics model, safe high-ground shelter, coordination algorithm, or emergency survival protocol.
            </p>
          </div>

          {/* Quick Stats or CTA */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('ask')}
              className={`px-4 py-2 text-xs font-mono border transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'ask'
                  ? 'bg-neutral-900 text-white border-neutral-900 font-bold'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Explorer Chat</span>
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 text-xs font-mono border transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'catalog'
                  ? 'bg-neutral-900 text-white border-neutral-900 font-bold'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Browse All Features ({SITE_INDEX.length})</span>
            </button>
          </div>
        </div>

        {/* Global Fast Filter Bar */}
        <div className="bg-white border border-neutral-300 p-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across all pages, scenarios, algorithms, and disaster tools (e.g. '3D Cesium', 'weir overflow', 'Naya Tola', 'shelters')..."
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900 bg-neutral-50/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-neutral-400 hover:text-neutral-700 font-mono"
                >
                  Clear
                </button>
              )}
            </div>

            {searchQuery && (
              <button
                onClick={() => {
                  setActiveTab('ask');
                  handleAskAI(searchQuery);
                }}
                className="px-4 py-2 bg-amber-800 text-white text-xs font-mono hover:bg-amber-900 transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask AI About &ldquo;{searchQuery}&rdquo;</span>
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono pt-1">
            <span className="text-neutral-400 text-[11px] mr-1 uppercase">Categories:</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 transition-colors cursor-pointer text-xs ${
                  selectedCategory === cat
                    ? 'bg-neutral-900 text-white font-semibold'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Interactive AI Explorer Mode */}
        {activeTab === 'ask' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Chat Conversation Stream */}
            <div className="lg:col-span-8 bg-white border border-neutral-300 shadow-xs flex flex-col">
              <div className="p-4 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-neutral-900 text-white flex items-center justify-center">
                    <Bot className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm text-neutral-900">
                      BUBBLES Deep Site Explorer
                    </h3>
                    <p className="text-[11px] text-neutral-500 font-mono">
                      Ask about any page, scenario, data point, or simulation rule
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleSpeak(chatHistory[chatHistory.length - 1]?.text || '')}
                  className={`p-1.5 border text-xs font-mono transition-colors flex items-center gap-1 ${
                    isSpeaking
                      ? 'bg-amber-100 border-amber-500 text-amber-900'
                      : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                  }`}
                  title="Voice readout"
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-amber-700" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span className="text-[10px] hidden sm:inline">{isSpeaking ? 'Mute' : 'Voice'}</span>
                </button>
              </div>

              {/* Chat Stream */}
              <div ref={chatScrollContainerRef} className="p-5 overflow-y-auto space-y-6 max-h-[500px] min-h-[360px] bg-neutral-50/20">
                {chatHistory.map((item) => {
                  const isUser = item.role === 'user';
                  return (
                    <div
                      key={item.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono text-neutral-400">
                        <span>{isUser ? 'You (Searcher)' : 'BUBBLES Intelligence'}</span>
                        <span>•</span>
                        <span>{item.timestamp}</span>
                      </div>

                      <div
                        className={`max-w-[90%] p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                          isUser
                            ? 'bg-neutral-900 text-white'
                            : 'bg-white border border-neutral-300 text-neutral-800 shadow-2xs font-sans'
                        }`}
                      >
                        {item.text}

                        {/* Direct Jump Action Links if related features were found */}
                        {item.relatedFeatures && item.relatedFeatures.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-neutral-200">
                            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-500 block mb-2">
                              Jump Directly to Website Feature:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {item.relatedFeatures.map((rf) => (
                                <button
                                  key={rf.id}
                                  onClick={() => handleLaunchFeature(rf)}
                                  className="text-left p-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-300 transition-colors flex items-center justify-between group cursor-pointer"
                                >
                                  <div>
                                    <div className="font-semibold text-xs text-neutral-900 group-hover:text-amber-800">
                                      {rf.title}
                                    </div>
                                    <div className="text-[10px] font-mono text-neutral-500">
                                      {rf.path}
                                    </div>
                                  </div>
                                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 p-2">
                    <Sparkles className="w-4 h-4 animate-spin text-amber-700" />
                    <span>Searching BUBBLES intelligence index...</span>
                  </div>
                )}
              </div>

              {/* Chat Input Box */}
              <div className="p-4 border-t border-neutral-200 bg-white">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAskAI(chatInput);
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask anything (e.g. 'Where is the 3D Cesium map?', 'How do I run Scenario 02?', 'What are low-lying wards?')..."
                    className="flex-1 px-3.5 py-2.5 border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !chatInput.trim()}
                    className="px-5 py-2.5 bg-neutral-900 text-white text-xs font-mono font-medium hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Ask</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Suggested Query Quick-Chips & Key Shortcuts */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-5 border border-neutral-300 bg-white space-y-3">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-700" />
                  <h3 className="font-serif font-bold text-base text-neutral-900">
                    Frequent Inquiries
                  </h3>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                  Click any query below to immediately receive detailed guidance and jump links:
                </p>

                <div className="space-y-2 pt-2">
                  {[
                    'How does pre-disaster evacuation prioritize low-lying settlements?',
                    'Where can I view the Side-by-Side Google GIS and Cesium 3D map?',
                    'Explain Scenario 02: Cascading bridge failure and shelter saturation',
                    'How does the river overflow breach physics model work?',
                    'What emergency helpline numbers and VHF channels are cached offline?',
                    'Why is Contract Net Protocol better than Hungarian centralized dispatch?',
                    'How does the acoustic civil defense siren sound in Hindi and English?',
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAskAI(preset)}
                      className="w-full text-left p-2.5 bg-neutral-50 hover:bg-amber-50/70 border border-neutral-200 hover:border-amber-300 text-xs text-neutral-800 transition-colors flex items-start gap-2 cursor-pointer font-sans"
                    >
                      <Sparkles className="w-3 h-3 text-amber-700 shrink-0 mt-0.5" />
                      <span>{preset}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Direct Jump Quick Cards */}
              <div className="p-5 border border-neutral-300 bg-amber-50/50 space-y-3 text-xs">
                <span className="font-bold font-mono text-amber-950 uppercase tracking-wide block">
                  FAST WEBSITE JUMP LINKS
                </span>
                <div className="divide-y divide-amber-200">
                  <Link
                    href="/simulation"
                    className="py-2 flex items-center justify-between text-neutral-800 hover:text-amber-900 font-medium"
                  >
                    <span>Simulation Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/exercises"
                    className="py-2 flex items-center justify-between text-neutral-800 hover:text-amber-900 font-medium"
                  >
                    <span>3 Tabletop Exercises (Scenarios)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/methodology"
                    className="py-2 flex items-center justify-between text-neutral-800 hover:text-amber-900 font-medium"
                  >
                    <span>Algorithmic Benchmark (CNP vs Hungarian)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/audio-dispatch"
                    className="py-2 flex items-center justify-between text-neutral-800 hover:text-amber-900 font-medium"
                  >
                    <span>Bilingual Audio Radio & Acoustic Siren</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/login"
                    className="py-2 flex items-center justify-between text-neutral-800 hover:text-amber-900 font-medium"
                  >
                    <span>Demo Officer Credentials</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Complete Interactive Site Catalog & Directory */}
        {activeTab === 'catalog' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs font-mono text-neutral-500 px-1">
              <span>Showing {filteredFeatures.length} of {SITE_INDEX.length} indexed features</span>
              <span>Filter: {selectedCategory}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFeatures.map((feature) => (
                <div
                  key={feature.id}
                  className="bg-white border border-neutral-300 p-5 flex flex-col justify-between hover:border-neutral-900 transition-colors shadow-2xs group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-100 text-neutral-700 font-semibold uppercase tracking-wider">
                        {feature.category}
                      </span>
                      <span className="text-[11px] font-mono text-neutral-400">
                        {feature.path}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-base text-neutral-900 mb-2 group-hover:text-amber-800 transition-colors">
                      {feature.title}
                    </h3>

                    <p className="text-xs text-neutral-600 leading-relaxed font-sans mb-4">
                      {feature.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {feature.tags.slice(0, 4).map((tag, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-mono text-neutral-500 bg-neutral-50 px-1.5 py-0.5 border border-neutral-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-200 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setActiveTab('ask');
                        handleAskAI(feature.suggestedPrompt);
                      }}
                      className="text-xs font-mono text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Ask AI</span>
                    </button>

                    <button
                      onClick={() => handleLaunchFeature(feature)}
                      className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredFeatures.length === 0 && (
              <div className="bg-white border border-neutral-300 p-12 text-center space-y-3">
                <Search className="w-8 h-8 text-neutral-400 mx-auto" />
                <h4 className="font-serif font-bold text-lg text-neutral-800">
                  No matching features found
                </h4>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto font-sans">
                  Try clearing your search query or switching category filters to explore the whole portal.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All Topics');
                  }}
                  className="px-4 py-2 bg-neutral-900 text-white text-xs font-mono"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
