import React, { useState } from 'react';
import { useRouter, Link } from '../lib/navigation';
import { Shield, KeyRound, User, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export interface DemoUser {
  id: string;
  email: string;
  name: string;
  role: 'commander' | 'boat_crew' | 'land_team' | 'shelter_manager' | 'field_reporter' | 'analyst' | 'admin';
  badge: string;
  defaultPasswordPlain: string;
}

export const DEMO_USERS: DemoUser[] = [
  {
    id: 'user_commander',
    email: 'commander@bubbles.test',
    name: 'Capt. R. Sharma',
    role: 'commander',
    badge: 'HQ Operations Commander',
    defaultPasswordPlain: 'Demo@Commander123',
  },
  {
    id: 'user_boat_01',
    email: 'boat1@bubbles.test',
    name: 'Crew Lead M. Deka',
    role: 'boat_crew',
    badge: 'Rescue Boat BT-01 In-Charge',
    defaultPasswordPlain: 'Demo@Boat123',
  },
  {
    id: 'user_boat_02',
    email: 'boat2@bubbles.test',
    name: 'Crew Lead J. Das',
    role: 'boat_crew',
    badge: 'Rescue Boat BT-02 In-Charge',
    defaultPasswordPlain: 'Demo@Boat123',
  },
  {
    id: 'user_team_01',
    email: 'team1@bubbles.test',
    name: 'Team Lead P. Hazarika',
    role: 'land_team',
    badge: 'Land Team RT-01 In-Charge',
    defaultPasswordPlain: 'Demo@Team123',
  },
  {
    id: 'user_shelter_01',
    email: 'shelter1@bubbles.test',
    name: 'Relief In-Charge B. Borah',
    role: 'shelter_manager',
    badge: 'School Shelter Manager',
    defaultPasswordPlain: 'Demo@Shelter123',
  },
  {
    id: 'user_shelter_02',
    email: 'shelter2@bubbles.test',
    name: 'Relief In-Charge S. Ahmed',
    role: 'shelter_manager',
    badge: 'Community Shelter Manager',
    defaultPasswordPlain: 'Demo@Shelter123',
  },
  {
    id: 'user_reporter_01',
    email: 'reporter@bubbles.test',
    name: 'Volunteer K. Saikia',
    role: 'field_reporter',
    badge: 'Field Volunteer (Purab Sector)',
    defaultPasswordPlain: 'Demo@Reporter123',
  },
  {
    id: 'user_analyst_01',
    email: 'analyst@bubbles.test',
    name: 'Dr. A. Roy',
    role: 'analyst',
    badge: 'Operations Research Evaluator',
    defaultPasswordPlain: 'Demo@Analyst123',
  },
  {
    id: 'user_admin_01',
    email: 'admin@bubbles.test',
    name: 'Exercise Controller',
    role: 'admin',
    badge: 'Exercise Simulation Admin',
    defaultPasswordPlain: 'Demo@Admin123',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roomCode, setRoomCode] = useState('ROOM-01');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<DemoUser | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const user = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      setError('Invalid synthetic credentials. Please check demo account list.');
      setLoading(false);
      return;
    }
    setLoggedInUser(user);
    setLoading(false);
  };

  const handleQuickLogin = (user: DemoUser) => {
    setEmail(user.email);
    setPassword(user.defaultPasswordPlain);
    setLoggedInUser(user);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8">
      {/* Top Banner */}
      <div className="max-w-4xl mx-auto w-full mb-6">
        <div className="bg-amber-50 border border-amber-300 text-amber-900 px-4 py-2.5 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-700 shrink-0" />
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Synthetic Multi-Role Exercise Portal
            </span>
            <span className="text-amber-600">•</span>
            <span>All accounts are synthetic exercise profiles. No real personal data stored.</span>
          </div>
          <Link href="/terms" className="underline font-medium hover:text-amber-950">
            DM Act 2005 Protocol
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-start flex-1">
        {/* Left Column: Direct Credentials Form */}
        <div className="md:col-span-5 bg-white border border-neutral-300 p-6 sm:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-serif text-neutral-900 font-normal">
              Rescuer <span className="italic text-amber-800">Login</span>
            </h1>
            <p className="text-sm text-neutral-600 mt-1">
              Select an exercise role or enter synthetic demo credentials.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {loggedInUser && (
            <div className="mb-4 p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs space-y-2">
              <div className="font-bold font-mono">AUTHENTICATED AS: {loggedInUser.name}</div>
              <div className="text-[11px] text-neutral-600">Role: {loggedInUser.badge}</div>
              <Link
                href="/simulation"
                className="inline-block mt-2 px-4 py-2 bg-neutral-900 text-white font-medium hover:bg-neutral-800"
              >
                Launch Simulation Workspace →
              </Link>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                Exercise Room Code
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="ROOM-01"
                className="w-full px-3 py-2 border border-neutral-300 font-mono text-sm focus:outline-none focus:border-neutral-900 bg-neutral-50"
                required
              />
              <span className="text-[11px] text-neutral-500">
                Shared multi-user simulation room code.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                Synthetic Email / ID
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="commander@bubbles.test"
                  className="w-full px-3 py-2 pl-9 border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900 bg-white"
                  required
                />
                <User className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 pl-9 border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900 bg-white"
                  required
                />
                <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <span>Sign into Exercise Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-neutral-200 text-xs text-neutral-500">
            <span>Looking for public mode? </span>
            <Link href="/simulation" className="text-neutral-900 font-medium underline">
              Open Solo Simulation
            </Link>
          </div>
        </div>

        {/* Right Column: Quick Demo Logins with Plain Credentials */}
        <div className="md:col-span-7 space-y-4">
          <div className="bg-white border border-neutral-300 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-neutral-900 flex items-center gap-2 font-serif">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  Quick Demo Login (Single Click)
                </h2>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Click any role to populate credentials and jump immediately into that role&apos;s tailored workspace.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DEMO_USERS.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickLogin(u)}
                  className="text-left p-3 border border-neutral-200 hover:border-neutral-900 bg-neutral-50 hover:bg-white transition-all flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-neutral-900 group-hover:text-amber-800 font-serif">
                        {u.name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-neutral-200 text-neutral-700 uppercase">
                        {u.role.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-500 mt-1 line-clamp-1">
                      {u.badge}
                    </div>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-neutral-200 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                    <span>{u.email}</span>
                    <span className="text-neutral-600 font-sans group-hover:translate-x-0.5 transition-transform">
                      →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Role Policy Summary Card */}
          <div className="bg-neutral-100 border border-neutral-300 p-4 text-xs text-neutral-700 leading-relaxed font-sans">
            <span className="font-semibold text-neutral-900 block mb-1 font-mono uppercase text-[11px]">
              Role Access & Boundary Rules:
            </span>
            <ul className="list-disc pl-4 space-y-1 text-neutral-600 text-[11px]">
              <li>
                <strong>Boat Crew & Land Teams:</strong> Isolated to their designated craft; cannot view or edit peer units.
              </li>
              <li>
                <strong>Shelter Managers:</strong> Can update local beds and report overflows; cannot exceed physical limits.
              </li>
              <li>
                <strong>Field Reporters:</strong> Cannot unilaterally reopen closed bridges; reports undergo Bayesian belief validation.
              </li>
              <li>
                <strong>Control Commander:</strong> Full district view with explicit human-in-the-loop override logging.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
