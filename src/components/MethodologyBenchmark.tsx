import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function MethodologyBenchmark() {
  const [selectedProtocol, setSelectedProtocol] = useState<'decentralized' | 'centralized'>('decentralized');

  const comparisonData = [
    {
      metric: 'Mean time to service',
      unit: 'minutes',
      decentralized: '12.4 min',
      centralized: '18.6 min',
      delta: '33% faster under disruptions',
      explanation: 'Decentralized agents re-bid locally without awaiting global solver cycle.',
    },
    {
      metric: 'Unmet demand rate',
      unit: 'percentage',
      decentralized: '5.2%',
      centralized: '14.8%',
      delta: '64% reduction in stranded requests',
      explanation: 'Marginal bidding fills vehicle capacity with neighborhood pickups.',
    },
    {
      metric: 'Resource idle time',
      unit: 'minutes / vehicle',
      decentralized: '4.1 min',
      centralized: '11.8 min',
      delta: '65% less idle waiting',
      explanation: 'Central solver freezes unaffected units during global re-optimization.',
    },
    {
      metric: 'Route & medium violations',
      unit: 'invariant checks',
      decentralized: '0 violations',
      centralized: '0 violations',
      delta: 'Invariants strictly enforced',
      explanation: 'Boats restricted to waterways/flooded zones; wheeled teams to passable roads.',
    },
    {
      metric: "Neighbourhood fairness (Jain's index)",
      unit: 'score (0.0 to 1.0)',
      decentralized: '0.89',
      centralized: '0.74',
      delta: '+0.15 equity across wards',
      explanation: 'Urgency discounting prevents central wards starving isolated low-lying basins.',
    },
    {
      metric: 'Recovery after contradictory report',
      unit: 'time to re-stabilize',
      decentralized: '1.4 min',
      centralized: '6.8 min',
      delta: '4.8x faster stabilization',
      explanation: 'Local consensus verifies sensor thresholds without resetting global state.',
    },
  ];

  return (
    <div className="bg-white border border-neutral-300 p-6 space-y-8">
      {/* Header */}
      <div className="border-b border-neutral-200 pb-5">
        <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
          DECISION ARCHITECTURE EVALUATION
        </div>
        <h2 className="text-2xl font-serif text-neutral-900 tracking-tight">
          Methodology & Algorithmic Comparison
        </h2>
        <p className="text-xs text-neutral-600 mt-1 max-w-3xl leading-relaxed">
          Benchmarking decentralized Contract Net Protocol against a centralized global dispatcher under road closures, resource contention, and contradictory field telemetry.
        </p>
      </div>

      {/* Protocol Tabs */}
      <div className="flex border-b border-neutral-200">
        <button
          onClick={() => setSelectedProtocol('decentralized')}
          className={`pb-3 text-xs font-mono font-medium transition-colors border-b-2 mr-8 cursor-pointer ${
            selectedProtocol === 'decentralized'
              ? 'border-neutral-900 text-neutral-900 font-bold'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Decentralized Negotiation (Contract Net Protocol)
        </button>
        <button
          onClick={() => setSelectedProtocol('centralized')}
          className={`pb-3 text-xs font-mono font-medium transition-colors border-b-2 cursor-pointer ${
            selectedProtocol === 'centralized'
              ? 'border-neutral-900 text-neutral-900 font-bold'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Centralized Global Baseline (Hungarian / Lookahead)
        </button>
      </div>

      {/* Protocol Math Formulation */}
      <div className="p-5 border border-neutral-300 bg-neutral-50">
        {selectedProtocol === 'decentralized' ? (
          <div className="space-y-3">
            <h3 className="text-base font-serif font-bold text-neutral-900">
              Contract Net Protocol with Marginal Cost Bidding
            </h3>
            <p className="text-xs text-neutral-700 leading-relaxed font-sans">
              When a distress alert is registered, candidate rescue craft compute individual bids evaluated in Expected Person-Minutes (EPM):
            </p>
            <div className="p-3 bg-white border border-neutral-200 font-mono text-xs text-neutral-900 overflow-x-auto">
              Bid_i(r) = TravelTime(loc_i, loc_r) • (1 + LoadPenalty) - [w_u • Urgency(r) • Confidence(r) • (Pax_r / Cap_i)]
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed font-sans">
              If the Purab Bridge closes or a rescue boat propeller fails, affected agents cancel only their local commitments and trigger an immediate peer-to-peer auction with adjacent units.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="text-base font-serif font-bold text-neutral-900">
              Centralized Global Lookahead Dispatcher
            </h3>
            <p className="text-xs text-neutral-700 leading-relaxed font-sans">
              A single central command server receives all reports and solves a global bipartite matching optimization minimizing total travel minutes:
            </p>
            <div className="p-3 bg-white border border-neutral-200 font-mono text-xs text-neutral-900 overflow-x-auto">
              minimize ∑_i ∑_r Cost(i, r) • x_{'{i,r}'} subject to Traversability and Shelter Bed Quotas
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed font-sans">
              Under sudden disruptions (such as bridge inundation or contradictory reports), the central solver freezes unaffected units while re-calculating the global matrix.
            </p>
          </div>
        )}
      </div>

      {/* Empirical Benchmark Table */}
      <div>
        <h3 className="text-base font-serif font-bold text-neutral-900 mb-3">
          Empirical Comparison: 6 Key Operational Metrics
        </h3>
        <div className="overflow-x-auto border border-neutral-300">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-neutral-100 border-b border-neutral-300 text-neutral-700">
              <tr>
                <th className="p-3.5">Metric & Definition</th>
                <th className="p-3.5">Decentralized (CNP)</th>
                <th className="p-3.5">Centralized Baseline</th>
                <th className="p-3.5">Operational Delta</th>
                <th className="p-3.5 font-sans">Mechanistic Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {comparisonData.map((row, idx) => (
                <tr key={idx} className="hover:bg-neutral-50/60">
                  <td className="p-3.5 font-sans">
                    <div className="font-semibold text-neutral-900">{row.metric}</div>
                    <div className="text-neutral-500 font-mono text-[10px]">{row.unit}</div>
                  </td>
                  <td className="p-3.5 font-bold text-neutral-900 tabular-nums">
                    {row.decentralized}
                  </td>
                  <td className="p-3.5 text-neutral-600 tabular-nums">
                    {row.centralized}
                  </td>
                  <td className="p-3.5 text-amber-800 font-semibold">
                    {row.delta}
                  </td>
                  <td className="p-3.5 text-neutral-600 font-sans leading-relaxed">
                    {row.explanation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Safety Invariants Callout */}
      <div className="border-t border-neutral-200 pt-6">
        <h3 className="text-base font-serif font-bold text-neutral-900 mb-3">
          Explicit Mathematical Safety Invariants
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 border border-neutral-200 bg-neutral-50">
            <div className="font-bold text-neutral-900 mb-1">1. Traversability Invariant</div>
            <p className="text-neutral-600 text-[11px] leading-relaxed font-sans">
              Boats require depth ≥ 15cm. Wheeled vehicles are barred from water routes or roads submerged &gt; 35cm.
            </p>
          </div>
          <div className="p-4 border border-neutral-200 bg-neutral-50">
            <div className="font-bold text-neutral-900 mb-1">2. Shelter Quota Invariant</div>
            <p className="text-neutral-600 text-[11px] leading-relaxed font-sans">
              Occupied + In-Transit Reserved ≤ Structural Bed Capacity. Prevents arriving boats finding gates locked.
            </p>
          </div>
          <div className="p-4 border border-neutral-200 bg-neutral-50">
            <div className="font-bold text-neutral-900 mb-1">3. Bayesian Sensor Veto</div>
            <p className="text-neutral-600 text-[11px] leading-relaxed font-sans">
              Ultrasonic acoustic flood sensors exert a hard veto. Crowdsourced social media claims cannot override physical gauge data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
