import React from 'react';
import { Link } from '../lib/navigation';

export default function ExercisesPage() {
  const exercises = [
    {
      num: '01',
      id: '01',
      title: 'Monsoon surge',
      description:
        'A rising river isolates five neighbourhoods. Allocate rescue teams and boats as urgent requests compete for limited shelter beds.',
      tags: ['Standard exercise', 'No scheduled disruptions', '60 min • IST'],
    },
    {
      num: '02',
      id: '02',
      title: 'Cascading disruption',
      description:
        'At T+5, a bridge closes, a boat fails and the school shelter reaches capacity. Trace cancellations and explain every reassignment.',
      tags: ['Compound failure', '3 simultaneous events at T+5', '60 min • IST'],
    },
    {
      num: '03',
      id: '03',
      title: 'Conflicting field reports',
      description:
        'A low-confidence bridge reopening report arrives after a confirmed closure. Test cautious routing and recovery under uncertainty.',
      tags: ['Report uncertainty', 'Contradictory update at T+5', '60 min • IST'],
    },
    {
      num: '04',
      id: '04',
      title: 'Stress test (seeded disruptions)',
      description:
        'Seeded random bridge closures, sudden boat mechanical stalls, and deluge RF packet losses across 12 distress requests in 5 wards.',
      tags: ['Stochastic stress test', 'Seeded PRNG closures & packet loss', '60 min • IST'],
    },
  ];

  return (
    <div className="bg-white py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-serif text-neutral-900 tracking-tight mb-4">
            Choose an exercise.
          </h1>
          <p className="text-base text-neutral-600 max-w-2xl">
            Repeatable, synthetic exercises designed around changing field conditions.
          </p>
        </div>

        {/* Disclaimer Line */}
        <div className="text-xs text-neutral-500 font-mono pb-6 border-b border-neutral-300">
          All locations, incidents and resources are fictional. Each scenario uses the
          same starting resources for a fair strategy comparison.
        </div>

        {/* Exercises List */}
        <div className="divide-y divide-neutral-200">
          {exercises.map((ex) => (
            <div
              key={ex.id}
              className="py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Number */}
              <div className="lg:col-span-1 text-4xl sm:text-5xl font-serif text-neutral-400 font-light">
                {ex.num}
              </div>

              {/* Title & Description */}
              <div className="lg:col-span-8 space-y-3">
                <h2 className="text-2xl sm:text-3xl font-serif text-neutral-900">
                  {ex.title}
                </h2>
                <p className="text-sm text-neutral-600 max-w-2xl leading-relaxed">
                  {ex.description}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500 font-mono pt-2">
                  {ex.tags.map((tag, idx) => (
                    <span key={idx}>
                      {tag}
                      {idx < ex.tags.length - 1 && <span className="ml-4 text-neutral-300">•</span>}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="lg:col-span-3 lg:text-right">
                <Link
                  href={`/simulation?scenario=${ex.id}`}
                  className="inline-block px-5 py-2.5 bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-800 transition-colors"
                >
                  Load exercise
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Baseline Explanatory Box */}
        <div className="mt-16 pt-12 border-t border-neutral-300">
          <div className="max-w-3xl">
            <h3 className="text-2xl font-serif text-neutral-900 mb-4">
              Compare from the same starting conditions
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Every exercise begins with 38 people awaiting rescue, two rescue teams,
              two boats and two shelters. Decentralised agents bid with partial report
              visibility. The centralised baseline assigns from a shared view. Both
              use the same closures, capacity checks and urgency levels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
