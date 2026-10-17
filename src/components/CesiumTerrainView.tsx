import React, { useEffect, useRef, useState } from 'react';
import { Layers, Eye, Navigation, Compass, AlertTriangle, ShieldCheck, Maximize2, RotateCcw } from 'lucide-react';
import { GraphNode, ResourceUnit } from '../lib/types';
import { WARD_COORDINATES, SAFE_SHELTERS } from '../lib/shelters-data';

declare global {
  interface Window {
    Cesium: any;
  }
}

interface CesiumTerrainViewProps {
  riverStageMeters: number;
  nodes?: GraphNode[];
  resources?: ResourceUnit[];
  bridgeIsOpen?: boolean;
  className?: string;
  focusTarget?: string; // e.g. 'naya_tola' or 'school_shelter'
}

export default function CesiumTerrainView({
  riverStageMeters,
  nodes,
  resources,
  bridgeIsOpen = true,
  className = '',
  focusTarget,
}: CesiumTerrainViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [satelliteProvider, setSatelliteProvider] = useState<'arcgis' | 'osm'>('arcgis');
  const [terrainExaggeration, setTerrainExaggeration] = useState<number>(3.0);
  const [showFloodVolume, setShowFloodVolume] = useState<boolean>(true);
  const waterEntityRef = useRef<any>(null);

  useEffect(() => {
    let viewer: any = null;
    let isMounted = true;

    const initCesium = async () => {
      if (typeof window === 'undefined' || !containerRef.current) return;

      // Wait for Cesium script if loading
      let attempts = 0;
      while (!window.Cesium && attempts < 30) {
        await new Promise((r) => setTimeout(r, 200));
        attempts++;
      }

      if (!window.Cesium) {
        if (isMounted) setLoadError('CesiumJS script could not be initialized from CDN.');
        return;
      }

      const Cesium = window.Cesium;

      // Provide free Ion access token fallback or standard imagery
      try {
        // High-resolution Satellite Imagery Provider (ArcGIS World Imagery)
        const imageryProvider = new Cesium.ArcGisMapServerImageryProvider({
          url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
        });

        // Initialize Cesium Viewer
        viewer = new Cesium.Viewer(containerRef.current, {
          imageryProvider: imageryProvider,
          baseLayerPicker: false,
          geocoder: false,
          homeButton: false,
          infoBox: false,
          selectionIndicator: false,
          timeline: false,
          animation: false,
          sceneModePicker: false,
          navigationHelpButton: false,
          fullscreenButton: false,
          vrButton: false,
          terrainProvider: new Cesium.EllipsoidTerrainProvider(),
        });

        viewerRef.current = viewer;

        // Visual enhancement: Dark tactical atmosphere & lighting
        viewer.scene.globe.enableLighting = true;
        viewer.scene.globe.depthTestAgainstTerrain = true;
        viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#0B131D');

        // Center on Saryu Basin coordinates: 26.7922°N, 82.2050°E, altitude 8500m
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(82.205, 26.792, 7500),
          orientation: {
            heading: Cesium.Math.toRadians(15.0),
            pitch: Cesium.Math.toRadians(-45.0), // 3D oblique tilt for terrain depth
            roll: 0.0,
          },
          duration: 1.5,
        });

        // Add 3D Inundation Flood Water Body
        const waterColor = Cesium.Color.fromCssColorString('#0284C7').withAlpha(0.65);
        const waterEntity = viewer.entities.add({
          name: 'Saryu River Overflow Inundation',
          polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray([
              82.175, 26.815,
              82.205, 26.818,
              82.235, 26.795,
              82.230, 26.775,
              82.205, 26.765,
              82.180, 26.770,
            ]),
            extrudedHeight: 46.0 + (riverStageMeters - 48.0) * 1.5, // 3D water column rising
            height: 44.0,
            material: waterColor,
            outline: true,
            outlineColor: Cesium.Color.fromCssColorString('#38BDF8'),
            outlineWidth: 2,
          },
        });
        waterEntityRef.current = waterEntity;

        // Add 3D Geospatial Node Labels & Billboards
        Object.entries(WARD_COORDINATES).forEach(([key, ward]) => {
          const isLowLying = ward.isLowLying;
          const pinColor = isLowLying ? Cesium.Color.RED : Cesium.Color.ORANGE;

          viewer.entities.add({
            id: `ward_${key}`,
            position: Cesium.Cartesian3.fromDegrees(ward.lng, ward.lat, ward.elevation),
            point: {
              pixelSize: isLowLying ? 14 : 10,
              color: pinColor,
              outlineColor: Cesium.Color.WHITE,
              outlineWidth: 2,
            },
            label: {
              text: `${ward.name}\n(Elev: ${ward.elevation}m)`,
              font: '11px sans-serif',
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              outlineWidth: 2,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              pixelOffset: new Cesium.Cartesian2(0, -12),
              fillColor: Cesium.Color.WHITE,
              outlineColor: Cesium.Color.BLACK,
            },
          });
        });

        // Add 3D Safe Shelter Markers (High Ground)
        SAFE_SHELTERS.forEach((shelter) => {
          viewer.entities.add({
            id: `shelter_${shelter.id}`,
            position: Cesium.Cartesian3.fromDegrees(
              shelter.coordinates.lng,
              shelter.coordinates.lat,
              shelter.elevationMeters
            ),
            point: {
              pixelSize: 15,
              color: Cesium.Color.fromCssColorString('#10B981'),
              outlineColor: Cesium.Color.WHITE,
              outlineWidth: 2,
            },
            label: {
              text: `[SHELTER] ${shelter.name}\n(Safe Elev: ${shelter.elevationMeters}m | ${shelter.availableBeds} beds)`,
              font: 'bold 11px sans-serif',
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              outlineWidth: 2,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              pixelOffset: new Cesium.Cartesian2(0, -16),
              fillColor: Cesium.Color.fromCssColorString('#34D399'),
              outlineColor: Cesium.Color.BLACK,
            },
          });
        });

        // Add Purab Bridge 3D Polyline
        const bridgeColor = bridgeIsOpen
          ? Cesium.Color.fromCssColorString('#F59E0B')
          : Cesium.Color.RED;

        viewer.entities.add({
          name: 'Purab Bridge Crossing',
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights([
              82.191, 26.802, 50,
              82.205, 26.791, 52,
            ]),
            width: 4,
            material: bridgeColor,
          },
        });

        if (isMounted) setIsLoaded(true);
      } catch (e: any) {
        console.error('Cesium init error', e);
        if (isMounted) setLoadError(e.message || 'Error initializing 3D WebGL globe.');
      }
    };

    initCesium();

    return () => {
      isMounted = false;
      if (viewer && !viewer.isDestroyed()) {
        try {
          viewer.destroy();
        } catch {}
      }
    };
  }, []);

  // Update 3D flood volume when river stage changes
  useEffect(() => {
    if (viewerRef.current && waterEntityRef.current && window.Cesium) {
      const Cesium = window.Cesium;
      const height = Math.max(45.0, 45.0 + (riverStageMeters - 48.0) * 1.6);
      waterEntityRef.current.polygon.extrudedHeight = new Cesium.ConstantProperty(height);
      waterEntityRef.current.show = showFloodVolume;
    }
  }, [riverStageMeters, showFloodVolume]);

  // Handle camera focus presets
  const flyToTarget = (targetKey: string) => {
    const viewer = viewerRef.current;
    if (!viewer || !window.Cesium) return;
    const Cesium = window.Cesium;

    if (targetKey === 'overview') {
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(82.205, 26.792, 7500),
        orientation: {
          heading: Cesium.Math.toRadians(15.0),
          pitch: Cesium.Math.toRadians(-45.0),
          roll: 0.0,
        },
        duration: 1.2,
      });
    } else if (targetKey === 'naya_tola') {
      // Fly directly to lowest basin (45m elevation)
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(82.222, 26.778, 1600),
        orientation: {
          heading: Cesium.Math.toRadians(350.0),
          pitch: Cesium.Math.toRadians(-25.0), // Low angle 3D perspective
          roll: 0.0,
        },
        duration: 1.5,
      });
    } else if (targetKey === 'school_shelter') {
      // Fly to safe ridge shelter (62m elevation)
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(82.228, 26.802, 1800),
        orientation: {
          heading: Cesium.Math.toRadians(210.0),
          pitch: Cesium.Math.toRadians(-30.0),
          roll: 0.0,
        },
        duration: 1.5,
      });
    } else if (targetKey === 'bridge') {
      // Fly to Purab Bridge crossing
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(82.198, 26.796, 2000),
        orientation: {
          heading: Cesium.Math.toRadians(45.0),
          pitch: Cesium.Math.toRadians(-35.0),
          roll: 0.0,
        },
        duration: 1.5,
      });
    }
  };

  return (
    <div className={`relative bg-[#0F172A] border border-neutral-800 text-neutral-100 overflow-hidden ${className}`}>
      {/* 3D Viewport Controls Overlay */}
      <div className="absolute top-3 left-4 right-4 z-20 flex flex-wrap justify-between items-center text-xs font-mono pointer-events-none">
        <div className="flex items-center gap-2 bg-neutral-900/90 px-3 py-1.5 border border-neutral-700 pointer-events-auto">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-bold text-neutral-200">CESIUM 3D SATELLITE & TERRAIN</span>
          <span className="text-neutral-500">•</span>
          <span className="text-amber-400">Saryu Basin Digital Elevation Model</span>
        </div>

        {/* Camera Fly Presets */}
        <div className="flex items-center gap-1.5 pointer-events-auto mt-2 sm:mt-0">
          <button
            onClick={() => flyToTarget('overview')}
            className="px-2.5 py-1 bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-[11px] transition-colors cursor-pointer"
          >
            Basin Overview
          </button>
          <button
            onClick={() => flyToTarget('naya_tola')}
            className="px-2.5 py-1 bg-neutral-900/90 hover:bg-red-950 border border-red-700 text-red-200 text-[11px] font-bold transition-colors cursor-pointer"
          >
            Naya Tola (45m Basin)
          </button>
          <button
            onClick={() => flyToTarget('school_shelter')}
            className="px-2.5 py-1 bg-neutral-900/90 hover:bg-emerald-950 border border-emerald-700 text-emerald-200 text-[11px] font-bold transition-colors cursor-pointer"
          >
            Safe Shelter (62m)
          </button>
          <button
            onClick={() => flyToTarget('bridge')}
            className="px-2.5 py-1 bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-[11px] transition-colors cursor-pointer"
          >
            Purab Bridge
          </button>
        </div>
      </div>

      {/* Layer Toggles at bottom-left */}
      <div className="absolute bottom-3 left-4 z-20 flex items-center gap-3 bg-neutral-900/90 px-3 py-1.5 border border-neutral-700 text-[11px] font-mono pointer-events-auto">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={showFloodVolume}
            onChange={(e) => setShowFloodVolume(e.target.checked)}
            className="accent-cyan-500"
          />
          <span className="text-cyan-300">3D Flood Inundation Volume</span>
        </label>
        <span className="text-neutral-600">|</span>
        <span className="text-neutral-400">
          Water Level: <strong className="text-white">{riverStageMeters.toFixed(1)}m</strong>
        </span>
      </div>

      {/* Loading & Error States */}
      {!isLoaded && !loadError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0F172A]/90 text-neutral-400 font-mono text-xs">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <span>Loading CesiumJS 3D Earth Globe & Satellite Imagery...</span>
          <span className="text-[10px] text-neutral-500 mt-1">Rendering Saryu basin topographic coordinates (26.79°N, 82.20°E)</span>
        </div>
      )}

      {loadError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-[#0F172A] text-amber-200 font-mono text-xs">
          <AlertTriangle className="w-8 h-8 text-amber-500 mb-2" />
          <span className="font-bold">Cesium 3D Globe Notice</span>
          <p className="text-neutral-400 max-w-md mt-1 text-[11px]">{loadError}</p>
        </div>
      )}

      {/* Cesium Canvas Container */}
      <div ref={containerRef} className="w-full h-full min-h-[440px]" />
    </div>
  );
}
