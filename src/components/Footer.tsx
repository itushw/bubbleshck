import React from 'react';
import { Link } from '../lib/navigation';

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-neutral-200">
          <div>
            <span className="font-bold text-2xl font-serif tracking-wider text-neutral-900 block mb-2">
              BUBBLES
            </span>
            <p className="text-sm text-neutral-600 max-w-md">
              A place to test how flood-response plans adapt.
              <br />
              Built with synthetic scenarios for the Indian context.
            </p>
          </div>
          <div className="text-xs text-neutral-500 font-mono">
            <span>Saryu & Brahmaputra basin topological testbed</span>
          </div>
        </div>
        <div className="pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs text-neutral-500">
          <div>
            <span>Research prototype • No live operational feeds</span>
          </div>
          <nav className="flex flex-wrap gap-6">
            <Link href="/" className="hover:text-neutral-900 transition-colors">
              Home
            </Link>
            <Link href="/ai" className="hover:text-amber-800 font-semibold text-neutral-800 transition-colors">
              BUBBLES AI
            </Link>
            <Link href="/exercises" className="hover:text-neutral-900 transition-colors">
              Exercises
            </Link>
            <Link href="/methodology" className="hover:text-neutral-900 transition-colors">
              Methodology
            </Link>
            <Link href="/audio-dispatch" className="hover:text-neutral-900 transition-colors">
              Audio Dispatch
            </Link>
            <Link href="/contact" className="hover:text-neutral-900 transition-colors">
              Contact
            </Link>
            <Link href="/privacy" className="hover:text-neutral-900 transition-colors">
              Privacy policy
            </Link>
            <Link href="/terms" className="hover:text-neutral-900 transition-colors">
              Terms of service
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
