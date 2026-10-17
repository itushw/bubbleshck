import React, { useState, useEffect } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from '@vis.gl/react-google-maps';
import { MapPin, ShieldCheck, AlertTriangle, Layers, Navigation, Key, ExternalLink, CheckCircle2 } from 'lucide-react';
import { WARD_COORDINATES, SAFE_SHELTERS } from '../lib/shelters-data';

interface GoogleMapsGisViewProps {
  riverStageMeters: number;
  center?: { lat: number; lng: number };
  zoom?: number;
  onSelectWard?: (wardId: string) => void;
  className?: string;
  bridgeIsOpen?: boolean;
}

const DEFAULT_MAP_CENTER = { lat: 26.7922, lng: 82.205 };

export default function GoogleMapsGisView({
  riverStageMeters,
  center = DEFAULT_MAP_CENTER,
  zoom = 13,
  onSelectWard,
  className = '',
  bridgeIsOpen = true,
}: GoogleMapsGisViewProps) {
  // Only a restricted browser Maps key belongs here. Server API keys must never use VITE_.
  const [apiKey, setApiKey] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      // Remove keys persisted by older versions; session overrides stay in memory.
      try { localStorage.removeItem('jalsetu_gmaps_api_key'); } catch { /* Storage may be disabled. */ }
    }
    return (
      (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || ''
    );
  });

  const [mapTypeId, setMapTypeId] = useState<string>('hybrid');
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [tempKeyInput, setTempKeyInput] = useState<string>(apiKey);
  const [keySavedSuccess, setKeySavedSuccess] = useState<boolean>(false);

  const handleSaveCustomKey = () => {
    if (tempKeyInput.trim()) {
      setApiKey(tempKeyInput.trim());
      setKeySavedSuccess(true);
      setTimeout(() => {
        setKeySavedSuccess(false);
        setShowKeyModal(false);
      }, 1500);
    }
  };

  return (
    <div className={`relative bg-neutral-900 border border-neutral-800 text-neutral-100 flex flex-col overflow-hidden ${className}`}>
      {/* Top GIS Toolbar */}
      <div className="p-3 bg-neutral-950/90 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-neutral-200">GOOGLE MAPS GIS ENGINE</span>
          <span className="text-neutral-500">•</span>
          <span className="text-amber-400">Saryu Flood Basin</span>
        </div>

        {/* Map Type & API Key Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex border border-neutral-700 bg-neutral-900">
            {(['hybrid', 'terrain', 'roadmap', 'satellite'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setMapTypeId(type)}
                className={`px-2.5 py-1 uppercase text-[10px] cursor-pointer transition-colors ${
                  mapTypeId === type
                    ? 'bg-neutral-800 text-white font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setTempKeyInput(apiKey);
              setShowKeyModal(true);
            }}
            className="px-2.5 py-1 border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-[11px] flex items-center gap-1 cursor-pointer"
            title="Configure Google Maps API Key"
          >
            <Key className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">API Key:</span>
            <span className="font-mono text-neutral-400">{apiKey ? `${apiKey.slice(0, 8)}...` : 'Not Set'}</span>
          </button>
        </div>
      </div>

      {/* Main Google Maps Render Container */}
      <div className="flex-1 w-full h-full min-h-[420px] relative">
        {apiKey ? <APIProvider key={apiKey} apiKey={apiKey} solutionChannel="GMP_aistudio_v1">
          <Map
            mapId="DEMO_MAP_ID"
            defaultCenter={center}
            defaultZoom={zoom}
            center={center}
            zoom={zoom}
            mapTypeId={mapTypeId}
            gestureHandling="greedy"
            disableDefaultUI={false}
            className="w-full h-full min-h-[420px]"
          >
            {/* Wards & Risk Settlements Advanced Markers */}
            {Object.entries(WARD_COORDINATES).map(([key, ward]) => {
              const isLowLying = ward.isLowLying;

              return (
                <AdvancedMarker
                  key={key}
                  position={{ lat: ward.lat, lng: ward.lng }}
                  onClick={() => {
                    setSelectedEntity({ entityKind: 'ward', key, ...ward });
                    if (onSelectWard) onSelectWard(key);
                  }}
                  title={ward.name}
                >
                  <Pin
                    background={isLowLying ? '#DC2626' : '#EA580C'}
                    borderColor="#FFFFFF"
                    glyphColor="#FFFFFF"
                    scale={isLowLying ? 1.2 : 1.0}
                  />
                </AdvancedMarker>
              );
            })}

            {/* Safe High-Ground Shelters Advanced Markers */}
            {SAFE_SHELTERS.map((shelter) => (
              <AdvancedMarker
                key={shelter.id}
                position={{ lat: shelter.coordinates.lat, lng: shelter.coordinates.lng }}
                onClick={() => setSelectedEntity({ entityKind: 'shelter', ...shelter })}
                title={shelter.name}
              >
                <Pin
                  background="#059669"
                  borderColor="#FFFFFF"
                  glyphColor="#FFFFFF"
                  scale={1.15}
                />
              </AdvancedMarker>
            ))}

            {/* InfoWindow for Selected Entity */}
            {selectedEntity && (
              <InfoWindow
                position={
                  selectedEntity.entityKind === 'shelter'
                    ? { lat: selectedEntity.coordinates.lat, lng: selectedEntity.coordinates.lng }
                    : { lat: selectedEntity.lat, lng: selectedEntity.lng }
                }
                onCloseClick={() => setSelectedEntity(null)}
              >
                <div className="p-2 text-xs font-sans text-neutral-900 max-w-xs">
                  {selectedEntity.entityKind === 'shelter' ? (
                    <div>
                      <div className="text-[10px] font-mono uppercase text-emerald-700 font-bold">
                        SAFE HIGH-GROUND SHELTER
                      </div>
                      <h4 className="font-serif font-bold text-sm text-neutral-900 mt-0.5">
                        {selectedEntity.name}
                      </h4>
                      <div className="mt-2 text-xs font-mono space-y-1 text-neutral-700">
                        <div>Elevation: <strong>{selectedEntity.elevationMeters}m MSL (Safe)</strong></div>
                        <div>Available: <strong>{selectedEntity.availableBeds} / {selectedEntity.capacity} beds</strong></div>
                        <div>Helpline: <strong>{selectedEntity.phoneContact.split('/')[0]}</strong></div>
                        <div>VHF Radio: <strong>{selectedEntity.vhfRadioChannel}</strong></div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className={`text-[10px] font-mono uppercase font-bold ${
                        selectedEntity.isLowLying ? 'text-red-700' : 'text-amber-700'
                      }`}>
                        {selectedEntity.isLowLying ? 'PRIORITY LOW-LYING BASIN' : 'RESIDENTIAL SECTOR'}
                      </div>
                      <h4 className="font-serif font-bold text-sm text-neutral-900 mt-0.5">
                        {selectedEntity.name}
                      </h4>
                      <div className="mt-2 text-xs font-mono space-y-1 text-neutral-700">
                        <div>Ground Elevation: <strong>{selectedEntity.elevation}m MSL</strong></div>
                        <div>Flood Threat: <strong className={selectedEntity.elevation <= 46 ? 'text-red-700' : 'text-neutral-900'}>
                          {selectedEntity.elevation <= 46 ? 'CRITICAL (Floods First)' : 'Moderate'}
                        </strong></div>
                        <div>River Distance: <strong>~1.8 km from embankment</strong></div>
                      </div>
                    </div>
                  )}
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider> : (
          <div className="p-6 text-sm text-neutral-300">Google Maps is not configured. Use API Key to provide a restricted browser key for this session.</div>
        )}
      </div>

      {/* Bottom GIS Telemetry Bar */}
      <div className="p-3 bg-neutral-950/90 border-t border-neutral-800 text-[11px] font-mono text-neutral-400 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block"></span>
            <span>Low-Lying Zone (≤46m)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
            <span>Designated Shelter (Safe High Ground)</span>
          </span>
        </div>
        <div className="text-neutral-400">
          River Stage: <strong className="text-amber-300">{riverStageMeters.toFixed(1)}m</strong>
        </div>
      </div>

      {/* Google Maps API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-neutral-900/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-400 p-6 max-w-md w-full shadow-2xl text-neutral-900">
            <div className="flex justify-between items-start mb-3 border-b border-neutral-200 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-800 font-bold">
                  Google Maps Platform Configuration
                </span>
                <h3 className="text-lg font-serif font-bold text-neutral-900 mt-0.5">
                  Google Maps API Key
                </h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-xs font-mono text-neutral-500 hover:text-neutral-900"
              >
                [Close]
              </button>
            </div>

            <p className="text-xs text-neutral-600 mb-4 leading-relaxed font-sans">
              Enter your Google Maps Platform API key to power GIS satellite overlays, terrain elevation, and interactive markers.
            </p>

            {keySavedSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Browser key applied for this session.</span>
              </div>
            )}

            <div className="space-y-3 mb-5">
              <label className="block text-xs font-mono text-neutral-700 font-bold">
                API Key
              </label>
              <input
                type="text"
                value={tempKeyInput}
                onChange={(e) => setTempKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full p-2.5 border border-neutral-300 font-mono text-xs focus:outline-none focus:border-neutral-900 bg-neutral-50"
              />
              <span className="text-[10px] font-mono text-neutral-400 block">
                Use a browser key restricted to this website and Maps JavaScript API. It is visible to visitors.
              </span>
            </div>

            <div className="flex justify-end gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="px-3 py-2 border border-neutral-300 text-neutral-700 hover:bg-neutral-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCustomKey}
                className="px-4 py-2 bg-neutral-900 text-white font-medium hover:bg-neutral-800 cursor-pointer"
              >
                Apply & Save Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
