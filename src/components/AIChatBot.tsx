import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Volume2, VolumeX, ShieldCheck, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { Link } from '../lib/navigation';
import { ChatMessage, SimulationState } from '../lib/types';

interface AIChatBotProps {
  simulationState: SimulationState;
  riverStageMeters: number;
  bridgeIsOpen: boolean;
  onNavigateToTab?: (tab: string) => void;
  className?: string;
}

const DEFAULT_PROMPTS = [
  'Which low-lying areas need evacuation first?',
  'Is Purab Bridge currently passable?',
  'Where is the nearest safe shelter with available beds?',
  'Explain how river overflow causes floodplain inundation',
  'What should I pack in my offline emergency kit?',
];

export default function AIChatBot({
  simulationState,
  riverStageMeters,
  bridgeIsOpen,
  onNavigateToTab,
  className = '',
}: AIChatBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      sender: 'assistant',
      content: `Welcome to the BUBBLES Operational AI Commander. I provide real-time decision support, evacuation routing, hydrological analysis, and multi-agent coordination telemetry.

Current Telemetry: River Saryu stage is **${riverStageMeters.toFixed(1)}m** (${riverStageMeters >= 53.0 ? 'CRITICAL DANGER' : riverStageMeters >= 51.5 ? 'WARNING LEVEL' : 'NORMAL'}). Purab Bridge is **${bridgeIsOpen ? 'OPEN' : 'CLOSED TO WHEELED VEHICLES'}**.

How can I assist your flood response operation?`,
      timestamp: '09:00 IST',
      suggestedActions: [
        { label: 'Prioritize Low-Lying Zones', action: 'prioritize_low_lying' },
        { label: 'Check Bridge Status', action: 'check_bridge' },
        { label: 'View River Diagram', action: 'view_diagram' },
        { label: 'Find Nearby Shelters', action: 'view_shelters' },
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSpeak = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    // Strip markdown symbols for clean speech
    const cleanText = text.replace(/[*_#`[\]()]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          context: {
            riverStageMeters,
            bridgeIsOpen,
            simulationMinute: simulationState.currentMinute,
            scenarioName: simulationState.scenarioName,
            peopleSaved: simulationState.metrics.peopleSaved,
            totalPeople: simulationState.metrics.totalPeople,
            shelterOccupancyPct: simulationState.metrics.shelterOccupancyPct,
            lowLyingWards: ['Naya Tola (45m)', 'Moti Basti (46m)'],
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Chat service unreachable');
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `assistant_${Date.now()}`,
        sender: 'assistant',
        content: data.reply || 'No response generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      // Offline / Local Heuristic fallback
      let fallbackText = `BUBBLES Automated Advisory:
- River Saryu is at ${riverStageMeters.toFixed(1)}m.
- Purab Bridge is ${bridgeIsOpen ? 'passable' : 'CLOSED due to 75cm current'}.
- Low-lying zone priority: Naya Tola (45m) and Moti Basti (46m) must be evacuated before flood crests.
- Safe shelter with vacancies: School Shelter (62m elevation) & Community Shelter (59m).
- Offline emergency radio: VHF Channel 16 (156.800 MHz). National Helpline: 1078.`;

      if (textToSend.toLowerCase().includes('bridge')) {
        fallbackText = bridgeIsOpen
          ? `Purab Bridge is currently OPEN, but river stage is ${riverStageMeters.toFixed(1)}m. We recommend non-essential traffic cross immediately before water crests.`
          : `Purab Bridge is strictly CLOSED. Water depth is 75cm across the northern ramp. Wheeled vehicles cannot cross. Use the southern bypass or request Boat BT-01.`;
      }

      const fallbackMsg: ChatMessage = {
        id: `assistant_${Date.now()}`,
        sender: 'assistant',
        content: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: string) => {
    if (action === 'prioritize_low_lying' && onNavigateToTab) {
      onNavigateToTab('early_evac');
    } else if (action === 'view_diagram' && onNavigateToTab) {
      onNavigateToTab('river_diagram');
    } else if (action === 'view_shelters' && onNavigateToTab) {
      onNavigateToTab('shelters');
    } else if (action === 'check_bridge') {
      sendMessage('What is the current status of Purab Bridge?');
    }
  };

  return (
    <div className={`bg-white border border-neutral-300 flex flex-col shadow-xs ${className}`}>
      {/* Chatbot Header */}
      <div className="p-4 border-b border-neutral-200 bg-neutral-50/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-neutral-900 text-white flex items-center justify-center">
            <Bot className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-sm text-neutral-900">
                BUBBLES Operational AI
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-100 text-emerald-800 border border-emerald-300">
                Active Telemetry
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 font-mono">
              Flood response advisor • Grounded in basin topography
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/ai"
            className="p-1.5 border border-neutral-300 bg-white text-xs font-mono text-neutral-700 hover:text-neutral-900 hover:border-neutral-400 transition-colors flex items-center gap-1.5"
            title="Open comprehensive BUBBLES AI Site Explorer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span className="text-[11px] font-sans font-medium hidden sm:inline">Explore Full Website AI</span>
            <ExternalLink className="w-3 h-3 text-neutral-400" />
          </Link>
          <button
            onClick={() => handleSpeak(messages[messages.length - 1]?.content || '')}
            className={`p-1.5 border text-xs font-mono transition-colors flex items-center gap-1 ${
              isSpeaking
                ? 'bg-amber-100 border-amber-500 text-amber-900'
                : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100'
            }`}
            title="Read latest response aloud"
            aria-label="Read aloud"
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-amber-700" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span className="text-[10px] hidden sm:inline">{isSpeaking ? 'Mute' : 'Voice'}</span>
          </button>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-4 py-2 border-b border-neutral-200 bg-white overflow-x-auto flex items-center gap-2 text-xs">
        <span className="text-neutral-400 font-mono text-[10px] uppercase shrink-0">Prompts:</span>
        {DEFAULT_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => sendMessage(prompt)}
            className="whitespace-nowrap px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[11px] font-sans border border-neutral-200 transition-colors cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[380px] min-h-[260px] bg-neutral-50/30">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono text-neutral-400">
                <span>{isUser ? 'Operations Officer' : 'BUBBLES Commander AI'}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>
              <div
                className={`max-w-[88%] p-3.5 text-xs leading-relaxed whitespace-pre-wrap ${
                  isUser
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white border border-neutral-300 text-neutral-800 shadow-2xs font-sans'
                }`}
              >
                {msg.content}

                {/* Suggested Action Buttons if present */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-neutral-200 flex flex-wrap gap-2">
                    {msg.suggestedActions.map((act, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => handleActionClick(act.action)}
                        className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-900 text-[11px] font-mono flex items-center gap-1 transition-colors"
                      >
                        <Sparkles className="w-3 h-3 text-amber-700" />
                        <span>{act.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex flex-col items-start">
            <div className="p-3 bg-white border border-neutral-200 text-xs font-mono text-neutral-500 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-700" />
              <span>Analyzing basin hydrology and multi-agent queue...</span>
            </div>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="p-3 border-t border-neutral-200 bg-white flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about flood risks, evacuation priority, shelters, or road status..."
          className="flex-1 px-3 py-2 border border-neutral-300 text-xs font-sans focus:outline-none focus:border-neutral-900 bg-neutral-50"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <span>Ask</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
