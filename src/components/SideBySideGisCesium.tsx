import React, { useState } from 'react';
import { Columns2, Maximize2, Compass, Layers, MapPin, Key, Waves, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import GoogleMapsGisView from './GoogleMapsGisView';
import CesiumTerrainView from './CesiumTerrainView';
import { WARD_COORDINATES, SAFE_SHELTERS } from '../lib/shelters-data';

interface SideBySideGisCesiumProps {
  riverStageMeters: number;
  bridgeIsOpen?: boolean;
  className?: string;
}

export default function SideBySideGisCesium({
  riverStageMeters,
  bridgeIsOpen = true,
  className = '',
}: SideBySideGisCesiumProps) {
  const [layoutMode, setLayoutMode] = useState<'split' | 'gmaps' | 'cesium'>('split');
  const [focusedLocation, setFocusedLocation] = useState<{ lat: number; lng: number; name: string; key: string }>({
    lat: 26.7922,
    lng: 82.205,
    name: 'Saryu Basin Center',
    key: 'overview',
  });
  const [zoomLevel, setZoomLevel] = useState<number>(13);

  const handleFocus = (key: string) => {
    if (key === 'overview') {
      setFocusedLocation({ lat: 26.7922, lng: 82.205, name: 'Saryu Basin Center', key: 'overview' });
      setZoomLevel(13);
    } else if (key === 'naya_tola') {
      const ward = WARD_COORDINATES.naya_tola;
      setFocusedLocation({ lat: ward.lat, lng: ward.lng, name: ward.name, key: 'naya_tola' });
      setZoomLevel(15);
    } else if (key === 'moti_basti') {
      const ward = WARD_COORDINATES.moti_basti;
      setFocusedLocation({ lat: ward.lat, lng: ward.lng, name: ward.name, key: 'moti_basti' });
      setZoomLevel(15);
    } else if (key === 'school_shelter') {
      const shelter = SAFE_SHELTERS[0];
      setFocusedLocation({ lat: shelter.coordinates.lat, lng: shelter.coordinates.lng, name: shelter.name, key: 'school_shelter' });
      setZoomLevel(15);
    } else if (key === 'bridge') {
      setFocusedLocation({ lat: 26.7965, lng: 82.198, name: 'Purab Bridge Approach', key: 'bridge' });
      setZoomLevel(16);
    }
  };

  return (
    <div className={`bg-white border border-neutral-300 p-6 space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-bold mb-1 flex items-center gap-1.5">
            <Columns2 className="w-3.5 h-3.5" />
            <span>Synchronized Geospatial Comparative Suite</span>
          </div>
          <h2 className="text-2xl font-serif text-neutral-900 tracking-tight">
            Dual GIS Mapping: Google Maps Platform &amp; CesiumJS 3D Terrain
          </h2>
          <p className="text-xs text-neutral-600 mt-1 max-w-3xl leading-relaxed">
            Side-by-side synchronized view combining Google Maps Platform 2D/satellite GIS layer with CesiumJS photorealistic 3D digital elevation terrain and rising flood inundation volumes.
          </p>
        </div>

        {/* View Layout Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex border border-neutral-300 bg-neutral-100 p-0.5 text-xs font-mono">
            <button
              onClick={() => setLayoutMode('split')}
              className={`px-3 py-1.5 cursor-pointer transition-colors flex items-center gap-1.5 ${
                layoutMode === 'split' ? 'bg-neutral-900 text-white font-bold' : 'text-neutral-700 hover:text-neutral-900'
              }`}
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span>Side-by-Side (50/50)</span>
            </button>
            <button
              onClick={() => setLayoutMode('gmaps')}
              className={`px-3 py-1.5 cursor-pointer transition-colors ${
                layoutMode === 'gmaps' ? 'bg-neutral-900 text-white font-bold' : 'text-neutral-700 hover:text-neutral-900'
              }`}
            >
              Google Maps Only
            </button>
            <button
              onClick={() => setLayoutMode('cesium')}
              className={`px-3 py-1.5 cursor-pointer transition-colors ${
                layoutMode === 'cesium' ? 'bg-neutral-900 text-white font-bold' : 'text-neutral-700 hover:text-neutral-900'
              }`}
            >
              CesiumJS 3D Only
            </button>
          </div>
        </div>
      </div>

      {/* Synchronized Focus Navigator Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-neutral-50 border border-neutral-200 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-amber-700 shrink-0" />
          <span className="text-neutral-500">Synchronized Camera Target:</span>
          <span className="font-bold text-neutral-900">{focusedLocation.name}</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => handleFocus('overview')}
            className={`px-2.5 py-1 border text-[11px] cursor-pointer transition-colors ${
              focusedLocation.key === 'overview' ? 'bg-neutral-900 text-white font-bold' : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            Basin Overview
          </button>
          <button
            onClick={() => handleFocus('naya_tola')}
            className={`px-2.5 py-1 border text-[11px] cursor-pointer transition-colors ${
              focusedLocation.key === 'naya_tola' ? 'bg-red-700 text-white font-bold border-red-700' : 'bg-white border-neutral-300 text-red-700 hover:bg-red-50'
            }`}
          >
            Naya Tola (45m Basin)
          </button>
          <button
            onClick={() => handleFocus('moti_basti')}
            className={`px-2.5 py-1 border text-[11px] cursor-pointer transition-colors ${
              focusedLocation.key === 'moti_basti' ? 'bg-amber-700 text-white font-bold border-amber-700' : 'bg-white border-neutral-300 text-amber-800 hover:bg-amber-50'
            }`}
          >
            Moti Basti (46.2m)
          </button>
          <button
            onClick={() => handleFocus('school_shelter')}
            className={`px-2.5 py-1 border text-[11px] cursor-pointer transition-colors ${
              focusedLocation.key === 'school_shelter' ? 'bg-emerald-800 text-white font-bold border-emerald-800' : 'bg-white border-neutral-300 text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            School Shelter (62m)
          </button>
          <button
            onClick={() => handleFocus('bridge')}
            className={`px-2.5 py-1 border text-[11px] cursor-pointer transition-colors ${
              focusedLocation.key === 'bridge' ? 'bg-neutral-900 text-white font-bold' : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            Purab Bridge
          </button>
        </div>
      </div>

      {/* Main Dual Maps Area */}
      <div className="w-full">
        {layoutMode === 'split' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Left: Google Maps GIS */}
            <div className="border border-neutral-300 flex flex-col h-[520px]">
              <div className="p-2.5 bg-neutral-900 text-white text-xs font-mono flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  VIEWPORT A: GOOGLE MAPS PLATFORM (GIS 2D/HYBRID)
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">Zoom: {zoomLevel}x</span>
              </div>
              <div className="flex-1 w-full h-full relative">
                <GoogleMapsGisView
                  riverStageMeters={riverStageMeters}
                  center={{ lat: focusedLocation.lat, lng: focusedLocation.lng }}
                  zoom={zoomLevel}
                  bridgeIsOpen={bridgeIsOpen}
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Right: CesiumJS 3D Terrain */}
            <div className="border border-neutral-800 flex flex-col h-[520px]">
              <div className="p-2.5 bg-neutral-950 text-white text-xs font-mono flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  VIEWPORT B: CESIUMJS (3D DIGITAL ELEVATION MODEL)
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">3D Terrain Exaggeration: 3.0x</span>
              </div>
              <div className="flex-1 w-full h-full relative">
                <CesiumTerrainView
                  riverStageMeters={riverStageMeters}
                  bridgeIsOpen={bridgeIsOpen}
                  focusTarget={focusedLocation.key}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        ) : layoutMode === 'gmaps' ? (
          <div className="border border-neutral-300 flex flex-col h-[580px]">
            <div className="p-2.5 bg-neutral-900 text-white text-xs font-mono flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                FULLSCREEN: GOOGLE MAPS PLATFORM GIS ENGINE
              </span>
              <span className="text-[10px] text-neutral-400">Target: {focusedLocation.name}</span>
            </div>
            <div className="flex-1 w-full h-full relative">
              <GoogleMapsGisView
                riverStageMeters={riverStageMeters}
                center={{ lat: focusedLocation.lat, lng: focusedLocation.lng }}
                zoom={zoomLevel}
                bridgeIsOpen={bridgeIsOpen}
                className="w-full h-full"
              />
            </div>
          </div>
        ) : (
          <div className="border border-neutral-800 flex flex-col h-[580px]">
            <div className="p-2.5 bg-neutral-950 text-white text-xs font-mono flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                FULLSCREEN: CESIUMJS 3D EARTH GLOBE &amp; SATELLITE TERRAIN
              </span>
              <span className="text-[10px] text-neutral-400">Target: {focusedLocation.name}</span>
            </div>
            <div className="flex-1 w-full h-full relative">
              <CesiumTerrainView
                riverStageMeters={riverStageMeters}
                bridgeIsOpen={bridgeIsOpen}
                focusTarget={focusedLocation.key}
                className="w-full h-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Comparative Analysis Footer Callout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div className="p-3.5 bg-neutral-50 border border-neutral-200">
          <span className="font-bold text-neutral-900 block mb-1">
            Google Maps Platform GIS Capabilities:
          </span>
          <p className="text-neutral-600 leading-relaxed font-sans text-[11px]">
            Provides road networks, hybrid satellite overlays, infrastructure addresses, and Advanced Markers with real-time shelter bed vacancies and evacuation routing.
          </p>
        </div>
        <div className="p-3.5 bg-neutral-50 border border-neutral-200">
          <span className="font-bold text-neutral-900 block mb-1">
            CesiumJS 3D Geospatial Advantages:
          </span>
          <p className="text-neutral-600 leading-relaxed font-sans text-[11px]">
            Renders true 3D digital elevation models (DEM) of the Saryu basin with simulated rising flood inundation volumes, making it instantly apparent why low-lying Naya Tola (45m) floods before higher ground.
          </p>
        </div>
      </div>
    </div>
  );
}
