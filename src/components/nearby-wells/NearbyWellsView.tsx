'use client';

import React, { useState } from 'react';
import { Well } from '@/types/nwis';
import { ACTIVE_WELL } from '@/data/wells';
import { MapPin, Compass, AlertTriangle, Layers, Radio, Info, ChevronRight, Sliders } from 'lucide-react';
import { WellIntelligencePanel } from '@/components/well-intelligence/WellIntelligencePanel';

interface NearbyWellsViewProps {
  offsetWells: Well[];
  allOffsetWells: Well[];
  selectedOffsetWell: Well | null;
  onSelectOffsetWell: (well: Well) => void;
  radiusFilter: number;
  onSelectRadiusFilter: (radius: number) => void;
  onOpenDocument?: (docId: string) => void;
}

export const NearbyWellsView: React.FC<NearbyWellsViewProps> = ({
  offsetWells,
  allOffsetWells,
  selectedOffsetWell,
  onSelectOffsetWell,
  radiusFilter,
  onSelectRadiusFilter,
  onOpenDocument,
}) => {
  const radii = [500, 1000, 2000, 5000];

  // Scale calculations for SVG radar map (5000m max view box radius)
  const maxViewRadius = radiusFilter === 5000 ? 5500 : radiusFilter === 2000 ? 2500 : radiusFilter === 1000 ? 1200 : 700;
  const svgCenter = 300;
  const svgScale = 240 / maxViewRadius;

  return (
    <div className="space-y-4 text-[#f0edf8]">
      {/* Top Filter & Radar Controls */}
      <div className="bg-[#110d1e]/90 border border-[#8968bf]/[0.2] rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-bold text-white tracking-wide">
              Subsurface Geospatial Offset Discovery
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1c1469]/80 text-[#8968bf] border border-[#8968bf]/[0.35]">
              Dibrugarh Basin GIS
            </span>
          </div>
          <p className="text-xs text-[#8a8299] mt-0.5">
            Radial Search Matrix • Center: OIL-ASSAM-042 (27.48°N, 94.92°E) • Fault Trend: N45E Structural Dip
          </p>
        </div>

        {/* Radius Filter Buttons */}
        <div className="flex items-center space-x-1.5 bg-[#0a0812] p-1 rounded-lg border border-[#8968bf]/[0.2] text-xs">
          <span className="text-[#8a8299] px-2 font-mono text-[11px] flex items-center space-x-1 font-semibold">
            <Sliders className="w-3.5 h-3.5 text-[#8968bf]" />
            <span>Search Radius:</span>
          </span>
          {radii.map((r) => (
            <button
              key={r}
              onClick={() => onSelectRadiusFilter(r)}
              className={`px-2.5 py-1 rounded-md font-mono font-bold transition ${
                radiusFilter === r
                  ? 'bg-[#551ca5]/40 text-[#f0edf8] border border-[#8968bf]/[0.5] shadow-sm'
                  : 'text-[#8a8299] hover:text-[#cec9e1] hover:bg-[#1c1469]/30'
              }`}
            >
              {r >= 1000 ? `${r / 1000} km` : `${r} m`}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Geospatial Map Canvas + Intelligence Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Radar Map Canvas Container */}
        <div className="lg:col-span-7 bg-[#0a0812]/95 border border-[#8968bf]/[0.2] rounded-xl p-4 relative overflow-hidden flex flex-col justify-between min-h-[460px] shadow-xl">
          {/* Tactical Grid Background Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(137,104,191,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(137,104,191,0.06)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* Radar Header Info */}
          <div className="flex items-center justify-between text-xs font-mono text-[#8a8299] z-10">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[#cec9e1] font-semibold">RADAR CENTER: ACTIVE RIG OIL-ASSAM-042</span>
            </div>
            <span className="text-[#8968bf] font-medium">FAULT TREND: N45E STRUCTURAL DIP</span>
          </div>

          {/* SVG Map Canvas */}
          <div className="w-full flex-1 flex items-center justify-center my-2 relative z-10">
            <svg viewBox="0 0 600 600" className="w-full max-w-[480px] h-auto drop-shadow-lg select-none">
              {/* Concentric Range Rings */}
              {[0.25, 0.5, 0.75, 1.0].map((frac, idx) => {
                const r = maxViewRadius * frac * svgScale;
                return (
                  <g key={idx}>
                    <circle
                      cx={svgCenter}
                      cy={svgCenter}
                      r={r}
                      fill="none"
                      stroke="#334155"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={svgCenter + 4}
                      y={svgCenter - r + 12}
                      fill="#64748b"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {Math.round(maxViewRadius * frac)}m
                    </text>
                  </g>
                );
              })}

              {/* Crosshairs */}
              <line x1={svgCenter} y1="20" x2={svgCenter} y2="580" stroke="#1e293b" strokeWidth="1" />
              <line x1="20" y1={svgCenter} x2="580" y2={svgCenter} stroke="#1e293b" strokeWidth="1" />

              {/* Subsurface Fault Line Indicator */}
              <line
                x1={svgCenter - 220}
                y1={svgCenter + 180}
                x2={svgCenter + 220}
                y2={svgCenter - 180}
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeDasharray="6 4"
                opacity="0.6"
              />
              <text
                x={svgCenter + 140}
                y={svgCenter - 140}
                fill="#f87171"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                FAULT FA-204 (DIBRUGARH)
              </text>

              {/* ACTIVE WELL PIN (Center) */}
              <g transform={`translate(${svgCenter}, ${svgCenter})`}>
                <circle r="14" fill="#8968bf" fillOpacity="0.25" className="animate-ping" />
                <circle r="8" fill="#551ca5" stroke="#8968bf" strokeWidth="2" />
                <circle r="3" fill="#ffffff" />
                <text x="12" y="4" fill="#cec9e1" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  OIL-ASSAM-042 (ACTIVE)
                </text>
              </g>

              {/* OFFSET WELL PINS */}
              {allOffsetWells.map((well) => {
                const xOffset = well.trajectory[well.trajectory.length - 1].easting;
                const yOffset = -well.trajectory[well.trajectory.length - 1].northing;

                const cx = svgCenter + xOffset * svgScale;
                const cy = svgCenter + yOffset * svgScale;

                const isWithinRadius = well.distance <= radiusFilter;
                const isSelected = selectedOffsetWell?.id === well.id;
                const hasStuckPipe = well.historicalEvents.some((e) => e.type === 'STUCK_PIPE');

                return (
                  <g
                    key={well.id}
                    transform={`translate(${cx}, ${cy})`}
                    className="cursor-pointer group"
                    onClick={() => onSelectOffsetWell(well)}
                    opacity={isWithinRadius ? 1 : 0.3}
                  >
                    {/* Pulsing ring for high relevance offset */}
                    {well.relevanceScore > 90 && isWithinRadius && (
                      <circle r="12" fill={hasStuckPipe ? '#ef4444' : '#8968bf'} fillOpacity="0.25" className="animate-pulse" />
                    )}

                    {/* Well Dot */}
                    <circle
                      r={isSelected ? '9' : '6'}
                      fill={hasStuckPipe ? '#ef4444' : '#a98fda'}
                      stroke={isSelected ? '#ffffff' : '#0a0812'}
                      strokeWidth="2"
                    />

                    {/* Trajectory Vector Line connecting to active well */}
                    <line
                      x1="0"
                      y1="0"
                      x2={svgCenter - cx}
                      y2={svgCenter - cy}
                      stroke={isSelected ? '#8968bf' : 'rgba(137,104,191,0.25)'}
                      strokeWidth={isSelected ? '1.5' : '0.8'}
                      strokeDasharray="2 2"
                    />

                    {/* Well Label Badge */}
                    <rect
                      x="10"
                      y="-12"
                      width="110"
                      height="24"
                      rx="4"
                      fill="#110d1e"
                      fillOpacity="0.95"
                      stroke={isSelected ? '#8968bf' : 'rgba(137,104,191,0.3)'}
                      strokeWidth="1"
                    />
                    <text x="14" y="-1" fill="#f0edf8" fontSize="10" fontWeight="bold" fontFamily="monospace">
                      {well.name.split(' ')[0]}
                    </text>
                    <text x="14" y="9" fill={well.relevanceScore > 90 ? '#8968bf' : '#8a8299'} fontSize="9" fontFamily="monospace">
                      {well.distance}m • Match {well.relevanceScore}%
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Compass & Map Legend Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-[#8968bf]/[0.15] text-[11px] text-[#8a8299] font-mono z-10">
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8968bf] inline-block" />
                <span>Active Well</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                <span>Stuck Pipe Incident</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                <span>Mud Loss Incident</span>
              </span>
            </div>
            <div className="flex items-center space-x-1 text-[#8a8299]">
              <Compass className="w-4 h-4 text-[#8968bf]" />
              <span>NORTH (GRID)</span>
            </div>
          </div>
        </div>

        {/* Selected Offset Well Intelligence Panel */}
        <div className="lg:col-span-5">
          {selectedOffsetWell ? (
            <WellIntelligencePanel
              well={selectedOffsetWell}
              onOpenDocument={onOpenDocument}
            />
          ) : (
            <div className="h-full bg-[#0a0812]/80 border border-[#8968bf]/[0.18] rounded-xl p-8 flex flex-col items-center justify-center text-center text-[#8a8299]">
              <MapPin className="w-12 h-12 text-[#5a5582] mb-3" />
              <h3 className="text-sm font-bold text-[#cec9e1] uppercase tracking-wider">
                Select an Offset Well
              </h3>
              <p className="text-xs text-[#8a8299] mt-1 max-w-xs">
                Click any offset well pin on the radar map to inspect its geological match, historical dysfunctions, and linked reports.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


