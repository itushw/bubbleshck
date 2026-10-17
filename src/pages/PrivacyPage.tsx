import React from 'react';
import { Link } from '../lib/navigation';

export default function PrivacyPage() {
  return (
    <div className="bg-white py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="text-xs font-mono text-neutral-500 mb-2">
            DATA PROTECTION & GEOSPATIAL GOVERNANCE
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif text-neutral-900 tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-xs text-neutral-500 font-mono">
            Compliant with the Digital Personal Data Protection Act, 2023 (DPDP Act, Republic of India)
          </p>
        </div>

        <div className="prose prose-neutral max-w-none text-sm text-neutral-700 leading-relaxed space-y-8">
          <section className="p-6 border border-neutral-300 bg-neutral-50">
            <h2 className="text-base font-semibold text-neutral-900 mb-2 font-serif">
              1. Principles of Data Minimization
            </h2>
            <p>
              In alignment with the Digital Personal Data Protection Act, 2023, <strong>BUBBLES</strong>{' '}
              processes data strictly for the stated purpose of multi-agent flood response simulation.
              Civilian distress reports in the default operational exercises are entirely synthetic.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif text-neutral-900">
              2. Geospatial Telemetry & Sensor Uncertainty
            </h2>
            <p>
              Telemetry data, including synthetic GPS coordinates, elevation models, ultrasonic river
              stage measurements, and bridge passability reports, are held in-memory or persisted
              exclusively within authorized sandbox session tokens. No real-time citizen device tracking
              or biometric identifiers are gathered or processed.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif text-neutral-900">
              3. Public-Sector Registration Information
            </h2>
            <p>
              Information collected through the Official Operational Access Request form (such as officer
              names, institutional email addresses, and departmental designations) is handled with strict
              confidentiality. Such details are utilized solely for authenticating credentials with state
              disaster authorities and will never be commercialized or shared with third-party advertisers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif text-neutral-900">
              4. Data Retention & Anonymization
            </h2>
            <p>
              Simulation logs, decision step traces, and export archives generated during tabletop exercises
              are retained for a maximum of 90 days for research auditability before automated cryptographic
              purge, unless specifically preserved by participating academic partners.
            </p>
          </section>

          <div className="pt-8 border-t border-neutral-200 flex justify-between items-center text-xs font-mono text-neutral-500">
            <span>Last Updated: October 2026</span>
            <Link href="/" className="text-neutral-900 underline hover:text-amber-800">
              Return to BUBBLES Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
