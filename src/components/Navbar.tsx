import React from 'react';
import { Link, usePathname } from '../lib/navigation';
import { Play } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const navLinks = [
    { label: 'About the project', href: '/' },
    { label: 'BUBBLES AI', href: '/ai', isAi: true },
    { label: 'Exercises', href: '/exercises' },
    { label: 'Methodology', href: '/methodology' },
    { label: 'Audio Dispatch', href: '/audio-dispatch' },
    { label: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="border-b border-neutral-200 bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Zone */}
        <Link href="/" className="flex items-center gap-2.5 text-neutral-900 group">
          <div className="w-7 h-7 flex items-center justify-center border border-neutral-800 text-neutral-900 bg-neutral-50 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
            {/* Minimalist geometric bubble insignia */}
            <svg
              className="w-4 h-4 stroke-current fill-none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="9" r="6" />
              <circle cx="16" cy="15" r="4" />
              <circle cx="16.5" cy="7.5" r="2.5" />
            </svg>
          </div>
          <span className="font-bold text-xl tracking-wider font-serif text-neutral-900">
            BUBBLES
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-7 text-sm">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-5 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  active
                    ? 'text-neutral-900 font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <span>{link.label}</span>
                {link.isAi && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 font-bold uppercase tracking-tight">
                    AI
                  </span>
                )}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-800" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Primary CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center px-3 py-2 border border-neutral-300 text-neutral-800 text-sm font-medium hover:bg-neutral-100 transition-colors whitespace-nowrap"
          >
            <span>Rescuer Login</span>
          </Link>
          <Link
            href="/simulation"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors whitespace-nowrap"
          >
            <span>Open simulation</span>
            <Play className="w-3.5 h-3.5 fill-current" />
          </Link>
        </div>
      </div>
    </header>
  );
}
