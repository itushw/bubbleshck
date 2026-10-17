import React, { useState } from 'react';
import { Link } from '../lib/navigation';
import { ArrowLeft, Clock, AlertTriangle, ShieldCheck, UserCheck } from 'lucide-react';

interface ReplayStep {
  minute: number;
  timeIST: string;
  action: string;
  resource: string;
  reason: string;
  invariantsMaintained: string;
  cancelledCommitment?: string;
  reassignedTo?: string;
}

const REPLAY_DATA: ReplayStep[] = [
  {
    minute: 0,
    timeIST: '09:00 IST',
    action: 'Initial Contract Net Announcement',
    resource: 'System Core',
    reason: 'Distress alerts received from 5 isolated wards totaling 38 individuals.',
    invariantsMaintained: 'Road depth checks active across 10 network edges.',
  },
  {
    minute: 2,
    timeIST: '09:02 IST',
    action: 'First Round Bid Award',
    resource: 'RT-01, RT-02, BT-01, BT-02',
    reason: 'BT-02 won Purab Ward contract (10 pax) via water route; RT-01 won Nadi Nagar (8 pax).',
    invariantsMaintained: 'School shelter reserved 10 beds; Community shelter reserved 8 beds.',
  },
  {
    minute: 5,
    timeIST: '09:05 IST',
    action: 'Disruption: Purab Bridge Closure & BT-02 Stall',
    resource: 'BT-02 & Infrastructure',
    reason: 'Flash flood submerged Purab bridge approach with 60cm current. BT-02 motor stalled in river channel.',
    invariantsMaintained: 'Safety invariant strictly barred wheeled vehicles from submerged bridge.',
    cancelledCommitment: 'BT-02 Purab Ward pickup (10 pax)',
    reassignedTo: 'Decentralized re-auction triggered among RT-01 and BT-01',
  },
  {
    minute: 7,
    timeIST: '09:07 IST',
    action: 'Decentralized Re-planning & Commitment Transfer',
    resource: 'BT-01 & RT-01',
    reason: 'BT-01 absorbed 6 passengers from stalled sector; RT-01 rerouted via southern bypass.',
    invariantsMaintained: 'School shelter reached 32/32 capacity; excess evacuees routed to Community shelter.',
    cancelledCommitment: 'School Shelter destination',
    reassignedTo: 'Community Shelter (South Safe Zone)',
  },
  {
    minute: 12,
    timeIST: '09:12 IST',
    action: 'Contradictory Telemetry Rejection',
    resource: 'Safety Invariant Guard',
    reason: 'Unverified citizen report claimed bridge passable. Sensor verified 60cm water depth; rejection logged.',
    invariantsMaintained: 'Zero route violations. Wheeled teams prevented from catastrophic engine flood.',
  },
  {
    minute: 18,
    timeIST: '09:18 IST',
    action: 'Operational Stabilization',
    resource: 'RT-01, RT-02, BT-01',
    reason: 'All 38 individuals safely delivered to validated shelters. Zero casualties.',
    invariantsMaintained: '100% capacity and traversability invariants respected.',
  },
];

export default function ReplayPage() {
  const [activeStep, setActiveStep] = useState<number>(2);
  const current = REPLAY_DATA[activeStep];

  return (
    <div className="bg-white py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/simulation"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 font-mono mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to simulation workspace</span>
        </Link>
        <div className="mb-10">
          <div className="text-xs font-mono text-neutral-500 mb-2">
            AFTER-ACTION AUDIT & CAUSAL ATTRIBUTION
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif text-neutral-900 tracking-tight mb-4">
            After-Action Replay & Reroute Explanations
          </h1>
          <p className="text-base text-neutral-600 max-w-3xl leading-relaxed">
            Scrub through minute-by-minute logs to inspect which commitments were
            cancelled, who was re-assigned, and the exact invariant rationale behind each decision.
          </p>
        </div>

        {/* Timeline Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 mb-8">
          {REPLAY_DATA.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`p-3 text-left border transition-colors cursor-pointer ${
                activeStep === idx
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              <div className="text-xs font-mono opacity-80">{step.timeIST}</div>
              <div className="text-xs font-medium truncate mt-1">T+{step.minute} min</div>
            </button>
          ))}
        </div>

        {/* Detailed Inspection Card */}
        <div className="p-8 border border-neutral-300 bg-neutral-50/50 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-neutral-200">
            <div>
              <span className="text-xs font-mono text-neutral-500">STEP {activeStep + 1} OF 6</span>
              <h2 className="text-2xl font-serif text-neutral-900 mt-1">
                {current.action}
              </h2>
            </div>
            <div className="text-xs font-mono text-neutral-600 bg-white border border-neutral-300 px-3 py-1.5">
              {current.timeIST} • T+{current.minute}:00
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono text-neutral-500 block mb-1">
                  PRIMARY ACTORS & RESOURCES
                </span>
                <span className="font-medium text-neutral-900 font-sans">{current.resource}</span>
              </div>
              <div>
                <span className="text-xs font-mono text-neutral-500 block mb-1">
                  CAUSAL EXPLANATION & MOTIVATION
                </span>
                <p className="text-neutral-700 leading-relaxed font-sans">{current.reason}</p>
              </div>
              {current.cancelledCommitment && (
                <div className="p-3 bg-red-50 border border-red-200 text-xs font-mono">
                  <div className="font-semibold text-red-900 flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Cancelled Commitment</span>
                  </div>
                  <div className="text-red-800">{current.cancelledCommitment}</div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono text-neutral-500 block mb-1">
                  SAFETY INVARIANT VALIDATION
                </span>
                <div className="flex items-start gap-2 text-neutral-700 font-sans">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>{current.invariantsMaintained}</span>
                </div>
              </div>

              {current.reassignedTo && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs font-mono">
                  <div className="font-semibold text-emerald-900 flex items-center gap-1.5 mb-1">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Dynamic Re-assignment Destination</span>
                  </div>
                  <div className="text-emerald-800">{current.reassignedTo}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
