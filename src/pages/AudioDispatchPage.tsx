import React, { useState, useEffect, useRef } from 'react';
import { Link } from '../lib/navigation';
import {
  Volume2,
  VolumeX,
  Play,
  Square,
  Radio,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react';

interface BroadcastItem {
  id: string;
  timeString: string;
  category: 'CRITICAL_ALERT' | 'DISPATCH_ORDER' | 'VERIFICATION_ADVISORY';
  textEn: string;
  textHi: string;
}

const BROADCASTS: BroadcastItem[] = [
  {
    id: 'b1',
    timeString: 'T+05:00',
    category: 'CRITICAL_ALERT',
    textEn:
      'Emergency Dispatch: Purab bridge approach is submerged and impassable. Rescue Boat BT-02 has experienced engine failure. All units must reroute immediately to Community shelter.',
    textHi:
      'आपातकालीन सूचना: पूरब पुल का मार्ग जलमग्न हो चुका है। नाव बीटी-02 का इंजन रुक गया है। सभी इकाइयाँ तुरंत कम्युनिटी शेल्टर की ओर डायवर्ट करें।',
  },
  {
    id: 'b2',
    timeString: 'T+08:00',
    category: 'DISPATCH_ORDER',
    textEn:
      'Operational Order: Rescue Team RT-01 has been assigned to evacuate 8 persons at Nadi Nagar via southern bypass road.',
    textHi:
      'कार्यवाही आदेश: रेस्क्यू टीम आरटी-01 को नदी नगर से 8 व्यक्तियों को सुरक्षित निकालने का कार्य सौंपा गया है।',
  },
  {
    id: 'b3',
    timeString: 'T+12:00',
    category: 'VERIFICATION_ADVISORY',
    textEn:
      'Verification Advisory: Unverified citizen report claiming Purab bridge is clear has been rejected by safety invariants. Ultrasonic gauge confirms 60cm water depth.',
    textHi:
      'सत्यापन सलाह: पूरब पुल खुलने की अपुष्ट सूचना खारिज कर दी गई है। सेंसर से 60 सेंटीमीटर पानी की पुष्टि हुई है।',
  },
];

export default function AudioDispatchPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<'both' | 'hi' | 'en'>('both');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentBroadcastIdx, setCurrentBroadcastIdx] = useState<number>(0);
  const [isSirenActive, setIsSirenActive] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(1.0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const sirenOscRef = useRef<OscillatorNode | null>(null);

  const stopSiren = () => {
    if (sirenOscRef.current) {
      try {
        sirenOscRef.current.stop();
        sirenOscRef.current.disconnect();
      } catch {}
      sirenOscRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {}
      audioCtxRef.current = null;
    }
    setIsSirenActive(false);
  };

  const startSiren = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.12 * volume, ctx.currentTime);

      const now = ctx.currentTime;
      for (let i = 0; i < 20; i++) {
        osc.frequency.setValueAtTime(440, now + i * 1.2);
        osc.frequency.linearRampToValueAtTime(880, now + i * 1.2 + 0.6);
        osc.frequency.linearRampToValueAtTime(440, now + i * 1.2 + 1.2);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      sirenOscRef.current = osc;
      setIsSirenActive(true);
    } catch {}
  };

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      stopSiren();
    };
  }, []);

  const toggleSiren = () => {
    if (isSirenActive) {
      stopSiren();
    } else {
      startSiren();
    }
  };

  const playSpeech = (index: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const item = BROADCASTS[index];
    if (!item) return;

    setCurrentBroadcastIdx(index);
    setIsPlaying(true);

    const utterances: SpeechSynthesisUtterance[] = [];
    if (selectedLanguage === 'hi' || selectedLanguage === 'both') {
      const uHi = new SpeechSynthesisUtterance(item.textHi);
      uHi.lang = 'hi-IN';
      uHi.rate = speechRate;
      uHi.volume = volume;
      utterances.push(uHi);
    }
    if (selectedLanguage === 'en' || selectedLanguage === 'both') {
      const uEn = new SpeechSynthesisUtterance(item.textEn);
      uEn.lang = 'en-IN';
      uEn.rate = speechRate;
      uEn.volume = volume;
      utterances.push(uEn);
    }

    if (utterances.length === 0) return;

    for (let i = 0; i < utterances.length - 1; i++) {
      utterances[i].onend = () => {
        window.speechSynthesis.speak(utterances[i + 1]);
      };
    }
    utterances[utterances.length - 1].onend = () => {
      setIsPlaying(false);
    };
    utterances[utterances.length - 1].onerror = () => {
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterances[0]);
  };

  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  return (
    <div className="bg-white py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/simulation"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 font-mono mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to simulation</span>
        </Link>

        <div className="mb-10">
          <div className="text-xs font-mono text-neutral-500 mb-2">
            SYNTHETIC EXERCISE TACTICAL AUDIO DISPATCH
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif text-neutral-900 tracking-tight mb-4">
            Tactical Audio Briefing Center
          </h1>
          <p className="text-base text-neutral-600 max-w-3xl leading-relaxed">
            Automated bilingual English and Hindi voice broadcasts for emergency
            command centers, motorized rescue boats, and field operators where screen
            readability is compromised by heavy rain and severe weather.
          </p>
        </div>

        <div className="p-6 border border-neutral-300 bg-neutral-50 mb-10">
          <h2 className="text-sm font-semibold text-neutral-900 mb-2 flex items-center gap-2">
            <Radio className="w-4 h-4 text-neutral-700" />
            <span>Why Audio Dispatch is Critical in Indian Flood Operations</span>
          </h2>
          <p className="text-xs text-neutral-700 leading-relaxed max-w-4xl font-sans">
            In the Brahmaputra and Saryu river basins, power grid blackouts and torrents
            render mobile displays virtually unreadable during active boat maneuvers.
            Autonomous audio synthesis bridges the gap between algorithmic re-routing
            decisions and field personnel through high-frequency VHF radio feeds and local
            speaker horns in both Hindi and English.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Controls Column */}
          <div className="lg:col-span-5 p-6 border border-neutral-300 bg-white space-y-6">
            <h3 className="text-base font-serif text-neutral-900 pb-3 border-b border-neutral-200">
              Transmission Controls
            </h3>

            <div>
              <label className="text-xs font-mono text-neutral-600 block mb-2">
                Broadcast Language
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSelectedLanguage('both')}
                  className={`px-3 py-2 text-xs font-medium border cursor-pointer ${
                    selectedLanguage === 'both'
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  Dual (Hi + En)
                </button>
                <button
                  onClick={() => setSelectedLanguage('hi')}
                  className={`px-3 py-2 text-xs font-medium border cursor-pointer ${
                    selectedLanguage === 'hi'
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  Hindi Only
                </button>
                <button
                  onClick={() => setSelectedLanguage('en')}
                  className={`px-3 py-2 text-xs font-medium border cursor-pointer ${
                    selectedLanguage === 'en'
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  English Only
                </button>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-xs font-mono text-neutral-600 mb-1">
                  <span>Speech Cadence</span>
                  <span>{speechRate.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.4"
                  step="0.1"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className="w-full accent-neutral-900 cursor-pointer h-1.5 bg-neutral-200"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs font-mono text-neutral-600 mb-1">
                  <span>Output Volume</span>
                  <span>{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full accent-neutral-900 cursor-pointer h-1.5 bg-neutral-200"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => (isPlaying ? stopSpeech() : playSpeech(currentBroadcastIdx))}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Stop Broadcast</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play Current Sitrep</span>
                  </>
                )}
              </button>
              <button
                onClick={toggleSiren}
                className={`px-4 py-2.5 border text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                  isSirenActive
                    ? 'border-red-600 bg-red-600 text-white'
                    : 'border-neutral-300 text-neutral-800 hover:bg-neutral-100'
                }`}
              >
                {isSirenActive ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isSirenActive ? 'Siren Active' : 'Test Siren'}</span>
              </button>
            </div>
          </div>

          {/* Broadcasts Queue */}
          <div className="lg:col-span-7 p-6 border border-neutral-300 bg-neutral-50/50 space-y-4">
            <h3 className="text-base font-serif text-neutral-900 pb-3 border-b border-neutral-200 flex items-center justify-between">
              <span>Automated SITREP Broadcast Feed</span>
              <span className="text-xs font-mono text-neutral-500 font-normal">
                Live Transcripts
              </span>
            </h3>

            <div className="space-y-4">
              {BROADCASTS.map((item, idx) => (
                <div
                  key={item.id}
                  className={`p-4 border transition-colors ${
                    currentBroadcastIdx === idx && isPlaying
                      ? 'border-neutral-900 bg-white ring-1 ring-neutral-900'
                      : 'border-neutral-200 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-mono mb-2">
                    <span className="text-neutral-500">{item.timeString}</span>
                    <span
                      className={`text-[11px] font-semibold ${
                        item.category === 'CRITICAL_ALERT'
                          ? 'text-red-700'
                          : item.category === 'DISPATCH_ORDER'
                          ? 'text-blue-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {item.category}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="text-[10px] font-mono text-neutral-400">ENGLISH</div>
                      <p className="text-neutral-900 leading-relaxed font-sans">{item.textEn}</p>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-neutral-400">हिन्दी (HINDI)</div>
                      <p className="text-neutral-900 leading-relaxed font-sans">{item.textHi}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-neutral-100 flex justify-end">
                    <button
                      onClick={() => playSpeech(idx)}
                      className="text-xs font-mono text-neutral-900 hover:text-amber-800 underline flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Transmit this sitrep</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
