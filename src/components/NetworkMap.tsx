import React, { useState } from 'react';
import { GraphNode, GraphEdge, ResourceUnit } from '../lib/types';
import { Plus, Minus, AlertTriangle, ShieldCheck } from 'lucide-react';

interface NetworkMapProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  resources: ResourceUnit[];
  currentMinute: number;
  timeString?: string;
  interactive?: boolean;
  onNodeClick?: (node: GraphNode) => void;
  className?: string;
  highlightLowLying?: boolean;
}

export default function NetworkMap({
  nodes,
  edges,
  resources,
  currentMinute,
  timeString = 'T+04 min',
  interactive = true,
  onNodeClick,
  className = '',
  highlightLowLying = false,
}: NetworkMapProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(1.4, prev + 0.1));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(0.8, prev - 0.1));

  const getNode = (id: string) => nodes.find((n) => n.id === id);

  return (
    <div className={`relative bg-[#1A2530] text-neutral-100 overflow-hidden select-none ${className}`}>
      {/* Top Header Strip inside canvas */}
      <div className="absolute top-3 left-4 right-4 flex justify-between items-center text-xs text-neutral-400 z-10 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="text-neutral-200 font-mono font-semibold">Saryu-Brahmaputra River Basin</span>
          <span className="text-neutral-500">•</span>
          <span className="text-neutral-400">Topological Graph & Risk Network</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-amber-400 font-mono text-[11px] bg-neutral-900/80 px-2 py-0.5 border border-neutral-700">
            {timeString}
          </span>
        </div>
      </div>

      {/* Compass indicator */}
      <div className="absolute top-12 left-4 text-xs font-mono text-neutral-400 flex flex-col items-center pointer-events-none z-10">
        <span className="text-[10px] text-neutral-300 font-bold">N</span>
        <span className="text-base leading-none text-neutral-400">↑</span>
      </div>

      {/* Zoom Controls */}
      {interactive && (
        <div className="absolute top-10 right-4 flex flex-col gap-1 z-20">
          <button
            onClick={handleZoomIn}
            className="w-7 h-7 bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 border border-neutral-600 flex items-center justify-center text-xs transition-colors cursor-pointer"
            title="Zoom In"
            aria-label="Zoom in"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-7 h-7 bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 border border-neutral-600 flex items-center justify-center text-xs transition-colors cursor-pointer"
            title="Zoom Out"
            aria-label="Zoom out"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Hover Tooltip */}
      {hoveredNode && (
        <div className="absolute top-12 left-16 z-30 bg-neutral-900/95 border border-neutral-700 p-3 text-xs shadow-xl max-w-xs pointer-events-none">
          <div className="font-semibold text-neutral-100 flex items-center justify-between gap-2">
            <span>{hoveredNode.name}</span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 bg-neutral-800 text-amber-300">
              Elev: {hoveredNode.elevationMeters}m
            </span>
          </div>
          <div className="text-neutral-400 font-mono mt-1 text-[11px]">
            {hoveredNode.type === 'shelter'
              ? `Shelter: ${hoveredNode.occupied} / ${hoveredNode.capacity} beds occupied`
              : hoveredNode.type === 'base'
              ? 'Central logistics staging depot'
              : `Awaiting evacuation: ${hoveredNode.waitingCount} persons (${hoveredNode.population} pop)`}
          </div>
          {hoveredNode.flooded && (
            <div className="text-red-400 font-mono text-[11px] mt-1.5 flex items-center gap-1 border-t border-neutral-800 pt-1">
              <AlertTriangle className="w-3 h-3 inline text-red-400 shrink-0" />
              <span>Inundated: {hoveredNode.waterDepthCm || 45}cm water depth</span>
            </div>
          )}
          {hoveredNode.elevationMeters <= 46 && (
            <div className="text-amber-400 font-mono text-[10px] mt-1 font-semibold">
              ⚠️ Priority Low-Lying Zone (High Submersion Risk)
            </div>
          )}
        </div>
      )}

      {/* SVG Canvas */}
      <div
        className="w-full h-full flex items-center justify-center transition-transform duration-200"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        <svg
          viewBox="0 0 840 460"
          className="w-full h-auto max-h-[460px] object-contain"
          style={{ minHeight: '340px' }}
        >
          {/* Subtle Grid Lines for Tactical Depth */}
          <defs>
            <pattern id="tacticalGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
            </pattern>
            <linearGradient id="riverGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1E3A5F" />
              <stop offset="100%" stopColor="#2A4D6C" />
            </linearGradient>
          </defs>
          <rect width="840" height="460" fill="url(#tacticalGrid)" />

          {/* Saryu River Flow Graphic */}
          <path
            d="M 420 0 Q 380 90 410 180 T 470 300 Q 510 390 490 460 L 440 460 Q 460 390 420 300 T 360 180 Q 330 90 370 0 Z"
            fill="url(#riverGrad)"
            opacity="0.85"
          />
          <path
            d="M 400 0 Q 360 90 390 180 T 450 300 Q 490 390 470 460"
            fill="none"
            stroke="#4A7C9D"
            strokeWidth="3"
            strokeDasharray="6,8"
            opacity="0.6"
          />
          {/* River Label */}
          <text
            x="410"
            y="90"
            fill="#6497B1"
            fontSize="11"
            fontFamily="monospace"
            letterSpacing="3"
            fontWeight="bold"
            transform="rotate(65, 410, 90)"
          >
            SARYU RIVER DISCHARGE
          </text>

          {/* Low-lying zone vulnerability halo (Naya Tola & Moti Basti) */}
          {(highlightLowLying || true) && (
            <>
              {/* Naya Tola (45m) */}
              <circle cx="640" cy="310" r="32" fill="#DC2626" fillOpacity="0.12" stroke="#EF4444" strokeWidth="1" strokeDasharray="3,3" />
              <text x="640" y="348" fill="#F87171" fontSize="9" textAnchor="middle" fontFamily="monospace">
                [45m LOW BASIN]
              </text>
              {/* Moti Basti (46m) */}
              <circle cx="320" cy="340" r="30" fill="#DC2626" fillOpacity="0.10" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3,3" />
              <text x="320" y="376" fill="#FBBF24" fontSize="9" textAnchor="middle" fontFamily="monospace">
                [46m LOW-LYING]
              </text>
            </>
          )}

          {/* Edges */}
          {edges.map((edge) => {
            const source = getNode(edge.from);
            const target = getNode(edge.to);
            if (!source || !target) return null;

            const isClosed = !edge.isOpen;
            const isWater = edge.type === 'waterway';

            return (
              <g key={edge.id}>
                <line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={
                    isClosed
                      ? '#DC2626'
                      : isWater
                      ? '#60A5FA'
                      : '#E2E8F0'
                  }
                  strokeWidth={isWater ? '2' : isClosed ? '2.5' : '1.75'}
                  strokeDasharray={isWater ? '4,4' : isClosed ? '6,3' : 'none'}
                  strokeOpacity={isClosed ? '0.95' : isWater ? '0.7' : '0.8'}
                />
                {/* Bridge indicator */}
                {edge.isBridge && (
                  <g>
                    <circle
                      cx={(source.x + target.x) / 2}
                      cy={(source.y + target.y) / 2}
                      r="10"
                      fill={isClosed ? '#7F1D1D' : '#1E293B'}
                      stroke={isClosed ? '#EF4444' : '#94A3B8'}
                      strokeWidth="1.5"
                    />
                    <text
                      x={(source.x + target.x) / 2}
                      y={(source.y + target.y) / 2 + 3}
                      fill={isClosed ? '#FCA5A5' : '#E2E8F0'}
                      fontSize="8"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {isClosed ? '✕' : '═'}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const isShelter = node.type === 'shelter';
            const isBase = node.type === 'base';

            return (
              <g
                key={node.id}
                className="cursor-pointer transition-opacity hover:opacity-95"
                onClick={() => onNodeClick && onNodeClick(node)}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Visual marker based on type */}
                {isBase ? (
                  // Base: Square with yellow/amber cross
                  <g transform={`translate(${node.x - 10}, ${node.y - 10})`}>
                    <rect
                      width="20"
                      height="20"
                      fill="#78350F"
                      stroke="#F59E0B"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M 10 4 L 10 16 M 4 10 L 16 10"
                      stroke="#FEF3C7"
                      strokeWidth="2"
                      strokeLinecap="square"
                    />
                  </g>
                ) : isShelter ? (
                  // Shelter: Square with plus inside (matches screenshot)
                  <g transform={`translate(${node.x - 9}, ${node.y - 9})`}>
                    <rect
                      width="18"
                      height="18"
                      fill="#1E293B"
                      stroke="#94A3B8"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M 9 4 L 9 14 M 4 9 L 14 9"
                      stroke="#F8FAFC"
                      strokeWidth="1.5"
                      strokeLinecap="square"
                    />
                  </g>
                ) : (
                  // Request node: Orange circle with white inner dot
                  <g>
                    {node.waitingCount > 0 && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="11"
                        fill="#D97706"
                        fillOpacity="0.25"
                      />
                    )}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="6.5"
                      fill={node.elevationMeters <= 46 ? '#DC2626' : '#EA580C'}
                      stroke="#FFF"
                      strokeWidth="1.5"
                    />
                  </g>
                )}

                {/* Node Label (Title + Subtitle) */}
                <text
                  x={node.x}
                  y={node.y - 14}
                  fill="#F8FAFC"
                  fontSize="12"
                  fontWeight="600"
                  textAnchor="middle"
                  fontFamily="sans-serif"
                >
                  {node.name}
                </text>
                <text
                  x={node.x}
                  y={node.y + 20}
                  fill="#94A3B8"
                  fontSize="9.5"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {isShelter && node.capacity
                    ? `${node.occupied || 0} / ${node.capacity} beds`
                    : isBase
                    ? 'Coordination Base'
                    : `${node.waitingCount} waiting (${node.elevationMeters}m)`}
                </text>
              </g>
            );
          })}

          {/* Active Resources on Map */}
          {resources.map((res, idx) => {
            const isAvailable = res.status === 'Available';
            if (isAvailable && res.currentLoc === 'base') return null;

            const locId = res.currentLoc;
            const destName = res.destination;
            const locNode = nodes.find((n) => n.id === locId || n.id === destName || n.name === destName);
            const posX = locNode ? locNode.x + (idx % 2 === 0 ? 20 : -20) : 200 + idx * 40;
            const posY = locNode ? locNode.y + (idx < 2 ? -20 : 20) : 220;
            const isFailed = res.status === 'Failed';
            const isBoat = res.type === 'rescue_boat';

            return (
              <g key={res.id} transform={`translate(${posX}, ${posY})`}>
                <rect
                  x="-24"
                  y="-10"
                  width="48"
                  height="20"
                  fill={isFailed ? '#991B1B' : isBoat ? '#075985' : '#0F172A'}
                  stroke={isFailed ? '#EF4444' : isBoat ? '#38BDF8' : '#F59E0B'}
                  strokeWidth="1.5"
                />
                <text
                  x="0"
                  y="4"
                  fill="#F8FAFC"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {res.id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend Footer (Exact match to screenshot) */}
      <div className="absolute bottom-2 left-4 right-4 flex flex-wrap justify-between items-center text-[11px] text-neutral-400 font-mono border-t border-neutral-700/50 pt-2 z-10 pointer-events-none">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600 border border-white inline-block"></span>
            <span>Request</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-neutral-800 border border-neutral-400 inline-block"></span>
            <span>Shelter</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-neutral-200 inline-block"></span>
            <span>Road</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 border-t border-dashed border-sky-400 inline-block"></span>
            <span>Water Route</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 border border-red-300 inline-block"></span>
            <span className="text-red-300">Low-Lying Zone (&lt;46m)</span>
          </div>
        </div>
        <div>
          <span>Topological Exercise Map</span>
        </div>
      </div>
    </div>
  );
}
