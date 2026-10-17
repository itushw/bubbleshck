import React from 'react';
import { Link } from '../lib/navigation';

export default function TermsPage() {
  return (
    <div className="bg-white py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="text-xs font-mono text-neutral-500 mb-2">
            LEGAL FRAMEWORK & REGULATORY COMPLIANCE
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif text-neutral-900 tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-xs text-neutral-500 font-mono">
            Governed by the Disaster Management Act, 2005 (Act No. 53 of 2005, Republic of India)
          </p>
        </div>

        <div className="prose prose-neutral max-w-none text-sm text-neutral-700 leading-relaxed space-y-8">
          <section className="p-6 border border-neutral-300 bg-neutral-50">
            <h2 className="text-base font-semibold text-neutral-900 mb-2 font-serif">
              1. Synthetic Exercise Environment Disclaimer
            </h2>
            <p>
              <strong>BUBBLES</strong> is a computational modeling sandbox developed for
              evaluating multi-agent coordination, algorithmic re-planning, and resource
              contention under synthetic flood conditions. <strong>All geographic nodes,
              population counts, distress reports, and operational commitments are synthetic.</strong>
            </p>
            <p className="mt-2 text-neutral-600 text-xs">
              This system does not dispatch live emergency personnel or interface with live
              state emergency dispatch switchboards (Emergency Response Support System - ERSS 112).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif text-neutral-900">
              2. Public-Sector & Statutory Alignment
            </h2>
            <p>
              Use of BUBBLES by officials of the National Disaster Management Authority (NDMA),
              State Disaster Management Authorities (SDMAs), District Disaster Management Authorities
              (DDMAs), and the National Disaster Response Force (NDRF) is subject to operational
              guidelines issued under Sections 38 and 39 of the Disaster Management Act, 2005.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif text-neutral-900">
              3. Algorithmic Invariants & Liability Limitations
            </h2>
            <p>
              While BUBBLES enforces mathematical safety invariants (including route depth
              verification, bridge closure avoidance, and shelter capacity tracking), algorithmic
              outputs reflect synthetic simulation heuristics. Neither the developers nor hosting
              infrastructure providers shall be held liable for operational decisions made during
              live disasters without human-in-the-loop validation by authorized Incident Commanders.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif text-neutral-900">
              4. Authorized Usage & Fair Evaluation
            </h2>
            <p>
              Benchmarking datasets and comparative simulation runs generated on BUBBLES may be
              utilized for academic research, government tabletop exercises, and algorithmic
              validation provided proper attribution is maintained. Automated crawling or stress-testing
              outside authorized sandbox parameters is prohibited.
            </p>
          </section>

          <div className="pt-8 border-t border-neutral-200 flex justify-between items-center text-xs font-mono text-neutral-500">
            <span>Effective Date: 15 October 2026</span>
            <Link href="/" className="text-neutral-900 underline hover:text-amber-800">
              Return to BUBBLES Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
