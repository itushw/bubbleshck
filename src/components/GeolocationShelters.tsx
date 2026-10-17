import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Phone, Radio, ShieldCheck, AlertTriangle, ArrowRight, ExternalLink, RefreshCw } from 'lucide-react';
import { getNearbyShelters, generateEmergencyAlerts, WARD_COORDINATES, SAFE_SHELTERS } from '../lib/shelters-data';
import { SafeShelter, EmergencyAlert, UserGeoLocation } from '../lib/types';

interface GeolocationSheltersProps {
  riverStageMeters: number;
}

export default function GeolocationShelters({ riverStageMeters }: GeolocationSheltersProps) {
  const [selectedWardKey, setSelectedWardKey] = useState<string>('naya_tola');
  const [userLocation, setUserLocation] = useState<UserGeoLocation>({
    lat: WARD_COORDINATES['naya_tola'].lat,
    lng: WARD_COORDINATES['naya_tola'].lng,
    nearestWard: WARD_COORDINATES['naya_tola'].name,
    isSimulated: true,
  });
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedShelter, setSelectedShelter] = useState<SafeShelter | null>(null);

  const nearbyShelters = getNearbyShelters(userLocation.lat, userLocation.lng);
  const alerts = generateEmergencyAlerts(userLocation.lat, userLocation.lng, riverStageMeters);

  const handleUseBrowserGPS = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          nearestWard: 'GPS Verified Location',
          accuracyMeters: Math.round(pos.coords.accuracy),
          isSimulated: false,
        });
      },
      (err) => {
        setIsLocating(false);
        setLocationError(`GPS Permission Denied or Timeout (${err.message}). Using basin sector.`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleWardSelect = (key: string) => {
    setSelectedWardKey(key);
    const ward = WARD_COORDINATES[key];
    if (ward) {
      setUserLocation({
        lat: ward.lat,
        lng: ward.lng,
        nearestWard: ward.name,
        isSimulated: true,
      });
      setLocationError(null);
    }
  };

  const currentWardInfo = WARD_COORDINATES[selectedWardKey];

  return (
    <div className="bg-white border border-neutral-300 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-semibold mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>Hyperlocal Safety & Refuge Registry</span>
          </div>
          <h2 className="text-2xl font-serif text-neutral-900 tracking-tight">
            Local Safe Shelters & Geolocation Emergency Alerts
          </h2>
          <p className="text-xs text-neutral-600 mt-1 max-w-2xl leading-relaxed">
            Identifies nearest elevated high-ground shelters with real-time bed capacity, walking/boat transit ETAs, and verified contact helplines based on your current coordinates.
          </p>
        </div>

        {/* Location Selector Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <button
            onClick={handleUseBrowserGPS}
            disabled={isLocating}
            className="px-3.5 py-2 border border-neutral-900 bg-white hover:bg-neutral-100 text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {isLocating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5 text-blue-600" />}
            <span>{isLocating ? 'Acquiring GPS...' : 'Use My Live GPS'}</span>
          </button>

          <select
            value={selectedWardKey}
            onChange={(e) => handleWardSelect(e.target.value)}
            className="border border-neutral-300 px-3 py-2 text-xs font-mono bg-neutral-50 text-neutral-900 focus:outline-none"
          >
            <option value="naya_tola">Naya Tola (45.0m - Low-Lying Basin)</option>
            <option value="moti_basti">Moti Basti (46.2m - Lowland Belt)</option>
            <option value="nadi_nagar">Nadi Nagar (48.0m - Riverbank)</option>
            <option value="purab_ward">Purab Ward (52.0m - Central)</option>
            <option value="shanti_colony">Shanti Colony (50.0m - East)</option>
          </select>
        </div>
      </div>

      {locationError && (
        <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>{locationError}</span>
        </div>
      )}

      {/* User Location Context Banner */}
      <div className="p-4 bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-red-600 shrink-0" />
          <div>
            <span className="text-neutral-500">Current Position: </span>
            <strong className="text-neutral-900 font-sans">{userLocation.nearestWard}</strong>
            <span className="text-neutral-400 ml-2">
              ({userLocation.lat.toFixed(4)}°N, {userLocation.lng.toFixed(4)}°E)
            </span>
          </div>
        </div>

        {currentWardInfo?.isLowLying && (
          <span className="px-2.5 py-1 bg-red-100 border border-red-300 text-red-800 text-[11px] font-bold">
            ⚠️ In Low-Lying Floodplain (Elevation: {currentWardInfo.elevation}m)
          </span>
        )}
      </div>

      {/* Emergency Alerts Feed */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-neutral-900 font-mono uppercase tracking-wider flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <span>Active Official Emergency Alerts ({alerts.length})</span>
        </h3>

        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 border ${
              alert.level === 'CRITICAL_RED'
                ? 'bg-red-50/70 border-red-300 text-red-950'
                : alert.level === 'WARNING_ORANGE'
                ? 'bg-amber-50/70 border-amber-300 text-amber-950'
                : 'bg-neutral-50 border-neutral-200 text-neutral-900'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase ${
                alert.level === 'CRITICAL_RED'
                  ? 'bg-red-600 text-white'
                  : alert.level === 'WARNING_ORANGE'
                  ? 'bg-amber-600 text-white'
                  : 'bg-neutral-800 text-white'
              }`}>
                {alert.level.replace('_', ' ')}
              </span>
              <span className="text-xs font-mono text-neutral-500">{alert.timestamp}</span>
            </div>

            <h4 className="text-base font-serif font-bold mb-1">{alert.title}</h4>
            <p className="text-xs leading-relaxed font-sans mb-2">{alert.actionRequired}</p>

            <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-neutral-500 pt-2 border-t border-neutral-200/60">
              <span>Source: {alert.source}</span>
              <span>Affected: {alert.affectedZones.join(', ')}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Shelters Sorted by Distance */}
      <div className="space-y-4 pt-4 border-t border-neutral-200">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-serif font-bold text-neutral-900">
            Nearby Elevated Safe Shelters (Sorted by Proximity)
          </h3>
          <span className="text-xs font-mono text-neutral-500">
            All facilities situated above 58m MSL
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nearbyShelters.map((shelter) => {
            const isFull = shelter.availableBeds <= 0;
            return (
              <div
                key={shelter.id}
                className="border border-neutral-300 p-5 bg-white hover:border-neutral-900 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-neutral-100 text-neutral-700">
                        {shelter.type} facility
                      </span>
                      <h4 className="text-base font-serif font-bold text-neutral-900 mt-1">
                        {shelter.name}
                      </h4>
                      <p className="text-xs text-neutral-500 font-sans mt-0.5">
                        {shelter.address}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-serif font-bold text-neutral-900 tabular-nums">
                        {shelter.distanceKm} km
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500 block">
                        ~{shelter.etaWalkingMin} min walk
                      </span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="grid grid-cols-2 gap-2 my-3 text-xs font-mono bg-neutral-50 p-2.5 border border-neutral-200">
                    <div>
                      <span className="text-neutral-500 block text-[10px]">GROUND ELEVATION</span>
                      <strong className="text-emerald-700">{shelter.elevationMeters} m MSL (Safe)</strong>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[10px]">AVAILABLE BEDS</span>
                      <strong className={isFull ? 'text-red-700' : 'text-neutral-900'}>
                        {shelter.availableBeds} / {shelter.capacity} free
                      </strong>
                    </div>
                  </div>

                  <div className="space-y-1 text-[11px] font-mono text-neutral-600">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span>{shelter.phoneContact}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span>{shelter.vhfRadioChannel}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Drinking Water • Medical Post • Generator</span>
                  </div>

                  <button
                    onClick={() => setSelectedShelter(shelter)}
                    className="text-xs font-mono font-medium text-neutral-900 hover:text-amber-800 underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Route</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Evacuation Route Modal */}
      {selectedShelter && (
        <div className="fixed inset-0 bg-neutral-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-400 p-6 max-w-lg w-full shadow-2xl">
            <div className="flex justify-between items-start mb-3 border-b border-neutral-200 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-800 font-semibold">
                  Safe High-Ground Evacuation Navigation
                </span>
                <h3 className="text-lg font-serif font-bold text-neutral-900 mt-0.5">
                  Route to {selectedShelter.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedShelter(null)}
                className="text-xs font-mono text-neutral-500 hover:text-neutral-900"
              >
                [Close]
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans text-neutral-700">
              <div className="p-3 bg-neutral-50 border border-neutral-200 font-mono text-[11px] space-y-1">
                <div>• Start Location: <strong>{userLocation.nearestWard}</strong></div>
                <div>• Safe Destination: <strong>{selectedShelter.name} (Elev: {selectedShelter.elevationMeters}m)</strong></div>
                <div>• Distance: <strong>{selectedShelter.distanceKm} km</strong> | ETA: <strong>{selectedShelter.etaWalkingMin} min walk / {selectedShelter.etaVehicleMin} min tractor/boat</strong></div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-neutral-900 block font-mono">Turn-by-Turn Safe Path:</span>
                <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed text-neutral-600">
                  <li>Exit your current structure immediately. Do not retrieve heavy belongings.</li>
                  <li>Move toward the elevated embankment road (Ridge bypass). <strong>Avoid the Purab Bridge approach if water warning is active.</strong></li>
                  <li>Follow the yellow emergency evacuation directional markers mounted on telephone poles.</li>
                  <li>Upon reaching {selectedShelter.name}, report directly to the Reception & Medical Triage desk for dry rations and bed allocation.</li>
                </ol>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex justify-between items-center font-mono text-[11px]">
                <span className="text-neutral-500">Helpline: {selectedShelter.phoneContact.split('/')[0]}</span>
                <button
                  onClick={() => setSelectedShelter(null)}
                  className="px-4 py-2 bg-neutral-900 text-white font-medium text-xs hover:bg-neutral-800 transition-colors"
                >
                  Understood
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
