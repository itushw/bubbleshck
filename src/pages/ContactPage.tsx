import React, { useState } from 'react';
import { Link } from '../lib/navigation';
import { ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    agency: 'National Disaster Response Force (NDRF)',
    designation: '',
    email: '',
    phone: '',
    region: 'Brahmaputra Valley & Assam Basin',
    purpose: '',
  });

  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaModalOpen, setCaptchaModalOpen] = useState(false);
  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const challengeTiles = [
    { id: 1, label: 'Motorized Rescue Boat (NDRF)', isTarget: true },
    { id: 2, label: 'Urban Highway Overpass', isTarget: false },
    { id: 3, label: 'Inflatable Raft in Current', isTarget: true },
    { id: 4, label: 'Dry Commercial Building', isTarget: false },
    { id: 5, label: 'Flood Evacuation Ferry', isTarget: true },
    { id: 6, label: 'Railway Track Junction', isTarget: false },
  ];

  const handleTileClick = (id: number) => {
    setSelectedTiles((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleVerifyCaptcha = () => {
    const correct =
      selectedTiles.includes(1) &&
      selectedTiles.includes(3) &&
      selectedTiles.includes(5) &&
      !selectedTiles.includes(2) &&
      !selectedTiles.includes(4) &&
      !selectedTiles.includes(6);

    if (correct || selectedTiles.length >= 2) {
      setCaptchaVerified(true);
      setCaptchaChecked(true);
      setCaptchaModalOpen(false);
    } else {
      alert('Verification incomplete. Please select all watercraft & rescue boats.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaVerified) {
      alert('Please complete the security verification challenge before submitting.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const randomRef = `JS-NDMA-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedRef(randomRef);
    }, 1200);
  };

  return (
    <div className="bg-white py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="text-xs font-mono text-neutral-500 mb-2">
            PUBLIC-SECTOR COLLABORATION & RESEARCH ACCESS
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif text-neutral-900 tracking-tight mb-4">
            Official Operational Access Request
          </h1>
          <p className="text-base text-neutral-600 leading-relaxed">
            For state disaster-management authorities, emergency services, civil defense
            directorates, and research institutions conducting flood coordination modeling.
          </p>
        </div>

        {submittedRef ? (
          <div className="p-8 border border-neutral-300 bg-neutral-50 space-y-4">
            <div className="flex items-center gap-2 text-emerald-800 font-mono text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              <span className="font-semibold text-sm">ACCESS APPLICATION REGISTERED</span>
            </div>
            <h2 className="text-2xl font-serif text-neutral-900">
              Registration Reference: {submittedRef}
            </h2>
            <p className="text-sm text-neutral-700 leading-relaxed font-sans">
              Your institutional access request for the Saryu and Brahmaputra synthetic testbed
              has been recorded. A secure API key and algorithmic model documentation will be
              dispatched to <strong className="font-mono text-neutral-900">{formData.email}</strong>{' '}
              following credential confirmation with your respective authority.
            </p>
            <div className="pt-4 border-t border-neutral-200">
              <Link
                href="/simulation"
                className="inline-block px-5 py-2.5 bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-800 transition-colors"
              >
                Return to simulation workspace
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 border border-neutral-300 p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono text-neutral-700 mb-2">
                  Full Name & Rank / Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Commandant R. K. Sharma"
                  className="w-full border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 rounded-none bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-700 mb-2">
                  Agency / Department *
                </label>
                <select
                  value={formData.agency}
                  onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                  className="w-full border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 rounded-none bg-white"
                >
                  <option value="National Disaster Response Force (NDRF)">
                    National Disaster Response Force (NDRF)
                  </option>
                  <option value="State Disaster Management Authority (SDMA)">
                    State Disaster Management Authority (SDMA)
                  </option>
                  <option value="District Disaster Management Authority (DDMA)">
                    District Disaster Management Authority (DDMA)
                  </option>
                  <option value="State Fire & Emergency Services">
                    State Fire & Emergency Services
                  </option>
                  <option value="Academic or Research Institute">
                    Academic or Research Institute
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-700 mb-2">
                  Official Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. rk.sharma@ndrf.gov.in"
                  className="w-full border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 rounded-none bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-700 mb-2">
                  Contact Number / VHF Call Sign *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98XXXXXXXX"
                  className="w-full border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 rounded-none bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-700 mb-2">
                Operational River Basin of Focus
              </label>
              <select
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="w-full border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 rounded-none bg-white"
              >
                <option value="Brahmaputra Valley & Assam Basin">
                  Brahmaputra Valley & Assam Basin (Guwahati, Majuli, Dhubri)
                </option>
                <option value="Saryu & Ghaghara Tributary Basin">
                  Saryu & Ghaghara Tributary Basin (Eastern UP / Ayodhya)
                </option>
                <option value="Mahanadi Delta & Coastal Odisha">
                  Mahanadi Delta & Coastal Odisha
                </option>
                <option value="Kosi & North Bihar Embankment Network">
                  Kosi & North Bihar Embankment Network
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-700 mb-2">
                Operational Objectives & Research Scope *
              </label>
              <textarea
                required
                rows={4}
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                placeholder="Describe intended evaluation scenarios, tabletop simulation parameters, or route planning integration."
                className="w-full border border-neutral-300 p-3 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 rounded-none bg-white font-sans"
              />
            </div>

            {/* reCAPTCHA Box */}
            <div className="p-4 border border-neutral-300 bg-neutral-50/80 max-w-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="recaptcha"
                  checked={captchaChecked}
                  onChange={() => {
                    if (!captchaVerified) {
                      setCaptchaModalOpen(true);
                    }
                  }}
                  className="w-5 h-5 accent-neutral-900 cursor-pointer"
                />
                <label
                  htmlFor="recaptcha"
                  className="text-xs font-medium text-neutral-800 cursor-pointer"
                >
                  I am not a robot
                </label>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 inline" />
                  <span>reCAPTCHA</span>
                </div>
                <div className="text-[9px] text-neutral-400">Privacy - Terms</div>
              </div>
            </div>

            {captchaVerified && (
              <div className="text-xs font-mono text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Operational integrity verified. Security token active.</span>
              </div>
            )}

            <div className="pt-4 border-t border-neutral-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Transmitting Request...' : 'Submit Official Access Request'}
              </button>
            </div>
          </form>
        )}

        {/* Modal Challenge */}
        {captchaModalOpen && (
          <div className="fixed inset-0 bg-neutral-900/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-neutral-400 p-6 max-w-md w-full shadow-2xl">
              <div className="bg-blue-600 text-white p-3 -mx-6 -mt-6 mb-4">
                <div className="text-xs uppercase tracking-wider font-mono opacity-80">
                  Security Verification
                </div>
                <div className="text-sm font-semibold">
                  Select all tiles with rescue boats or watercraft
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {challengeTiles.map((tile) => {
                  const isSelected = selectedTiles.includes(tile.id);
                  return (
                    <button
                      type="button"
                      key={tile.id}
                      onClick={() => handleTileClick(tile.id)}
                      className={`h-24 p-2 text-[11px] font-mono border flex flex-col justify-between text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold ring-2 ring-blue-600'
                          : 'border-neutral-300 bg-neutral-50 hover:bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      <span>0{tile.id}</span>
                      <span className="leading-snug">{tile.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setSelectedTiles([])}
                  className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1 font-mono cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCaptchaModalOpen(false)}
                    className="px-3 py-1.5 border border-neutral-300 text-xs text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleVerifyCaptcha}
                    className="px-4 py-1.5 bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 cursor-pointer"
                  >
                    Verify
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
