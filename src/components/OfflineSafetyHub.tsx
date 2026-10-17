import React, { useState, useEffect } from 'react';
import { ShieldCheck, Download, CheckSquare, Square, Phone, Radio, AlertTriangle, FileText, Wifi, WifiOff } from 'lucide-react';
import { getOfflineSafetyPack, saveChecklistState, exportPrintableEmergencyCard, DEFAULT_OFFLINE_PACK } from '../lib/offline-storage';
import { OfflineSafetyPack } from '../lib/types';

export default function OfflineSafetyHub() {
  const [pack, setPack] = useState<OfflineSafetyPack>(DEFAULT_OFFLINE_PACK);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const stored = getOfflineSafetyPack();
    setPack(stored);

    const onOn = () => setIsOnline(true);
    const onOff = () => setIsOnline(false);
    window.addEventListener('online', onOn);
    window.addEventListener('offline', onOff);
    return () => {
      window.removeEventListener('online', onOn);
      window.removeEventListener('offline', onOff);
    };
  }, []);

  const toggleChecklistItem = (id: string) => {
    const updated = pack.evacuationChecklist.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    const newPack = { ...pack, evacuationChecklist: updated };
    setPack(newPack);
    saveChecklistState(updated);
  };

  const handleDownloadCard = () => {
    const cardContent = exportPrintableEmergencyCard();
    const blob = new Blob([cardContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BUBBLES_EMERGENCY_SAFETY_CARD_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const completedCount = pack.evacuationChecklist.filter((i) => i.checked).length;
  const totalCount = pack.evacuationChecklist.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="bg-white border border-neutral-300 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-semibold mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero-Connectivity Disaster Readiness</span>
          </div>
          <h2 className="text-2xl font-serif text-neutral-900 tracking-tight">
            Offline Safety Pack & Critical Protocol Repository
          </h2>
          <p className="text-xs text-neutral-600 mt-1 max-w-2xl leading-relaxed">
            During active monsoon floods, cellular towers and power grids often collapse. This safety dossier is cached directly on your device for instant offline access without internet connectivity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCard}
            className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-mono font-medium flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Offline Emergency Dossier</span>
          </button>
        </div>
      </div>

      {/* Offline Status Badge */}
      <div className={`p-4 border text-xs font-mono flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
        isOnline
          ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
          : 'bg-amber-50/70 border-amber-300 text-amber-950'
      }`}>
        <div className="flex items-center gap-2.5">
          {isOnline ? (
            <Wifi className="w-4 h-4 text-emerald-700 shrink-0" />
          ) : (
            <WifiOff className="w-4 h-4 text-amber-700 shrink-0" />
          )}
          <div>
            <span className="font-bold">
              {isOnline ? 'ONLINE & OFFLINE-READY' : 'RUNNING IN OFFLINE MODE'}
            </span>
            <span className="block text-[11px] text-neutral-600 mt-0.5 font-sans">
              Critical safety guides, shelter contacts, and evacuation checklists are permanently stored in your browser storage.
            </span>
          </div>
        </div>

        <span className="text-[10px] text-neutral-500">
          Last Cached: {new Date(pack.lastUpdated).toLocaleDateString()}
        </span>
      </div>

      {downloadSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono">
          ✓ Emergency Safety Card downloaded to your device storage. Keep a printed or saved copy accessible!
        </div>
      )}

      {/* Checklist & First Aid Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Evacuation Checklist (6 cols) */}
        <div className="lg:col-span-6 border border-neutral-300 p-5 bg-white">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="text-base font-serif font-bold text-neutral-900">
                Evacuation Readiness Checklist
              </h3>
              <p className="text-xs text-neutral-500 font-mono">
                Persisted offline automatically
              </p>
            </div>
            <div className="text-right font-mono text-xs">
              <span className="font-bold text-neutral-900">{completedCount} / {totalCount}</span>
              <span className="text-neutral-500 text-[10px] block">({progressPct}% ready)</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-neutral-200 h-1.5 mb-4">
            <div
              className="bg-neutral-900 h-1.5 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="divide-y divide-neutral-200 space-y-2">
            {pack.evacuationChecklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleChecklistItem(item.id)}
                className="pt-2 flex items-start gap-3 cursor-pointer group"
              >
                <div className="mt-0.5">
                  {item.checked ? (
                    <CheckSquare className="w-4 h-4 text-emerald-700" />
                  ) : (
                    <Square className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700" />
                  )}
                </div>
                <div className="text-xs">
                  <span className={`leading-relaxed font-sans ${
                    item.checked ? 'line-through text-neutral-400' : 'text-neutral-800'
                  }`}>
                    {item.item}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400 block mt-0.5">
                    {item.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: First Aid & Survival Procedures (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="border border-neutral-300 p-5 bg-white">
            <h3 className="text-base font-serif font-bold text-neutral-900 mb-3">
              Essential Flood Survival Protocols
            </h3>

            <div className="space-y-4 text-xs font-sans">
              {pack.firstAidGuide.map((guide, idx) => (
                <div key={idx} className="p-3.5 bg-neutral-50 border border-neutral-200">
                  <h4 className="font-serif font-bold text-neutral-900 text-sm mb-2 flex items-center gap-1.5">
                    <span className="w-5 h-5 bg-neutral-900 text-white text-[10px] font-mono flex items-center justify-center">
                      0{idx + 1}
                    </span>
                    <span>{guide.title}</span>
                  </h4>
                  <ul className="list-disc pl-4 space-y-1 text-neutral-700 leading-relaxed text-[11px]">
                    {guide.steps.map((st, sIdx) => (
                      <li key={sIdx}>{st}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Priority Emergency Helplines & Radio Frequencies Table */}
      <div className="border border-neutral-300 p-5 bg-white">
        <h3 className="text-base font-serif font-bold text-neutral-900 mb-3 flex items-center gap-2">
          <Phone className="w-4 h-4 text-amber-800" />
          <span>Priority Emergency Dispatch Numbers & VHF Channels</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left font-mono">
            <thead className="bg-neutral-100 border-b border-neutral-200 text-neutral-700">
              <tr>
                <th className="p-3">Agency / Directorate</th>
                <th className="p-3">24x7 Phone Helpline</th>
                <th className="p-3">Wireless / VHF Frequency</th>
                <th className="p-3">Operational Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {pack.emergencyContacts.map((contact, idx) => (
                <tr key={idx} className="hover:bg-neutral-50">
                  <td className="p-3 font-semibold text-neutral-900 font-sans">
                    {contact.agency}
                  </td>
                  <td className="p-3 font-bold text-neutral-800">
                    {contact.phone}
                  </td>
                  <td className="p-3 text-neutral-600">
                    {contact.frequency}
                  </td>
                  <td className="p-3 text-neutral-600 font-sans">
                    {contact.operationalRole}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
