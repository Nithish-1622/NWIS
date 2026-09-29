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
    <div className="space-y-4 text-slate-100">
      {/* Top Filter & Radar Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <span>GEOSPATIAL DRILLING RADAR & OFFSET DISCOVERY</span>
            </h2>
            <p className="text-xs text-slate-400">
              Dibrugarh Structural Basin • Active Rig OIL-ASSAM-042 Offset Intelligence
            </p>
          </div>
        </div>

        {/* Radius Filter Buttons */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <span className="text-slate-400 px-2 font-mono text-[11px] flex items-center space-x-1">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>RADIUS:</span>
          </span>
          {radii.map((r) => (
            <button
              key={r}
              onClick={() => onSelectRadiusFilter(r)}
              className={`px-2.5 py-1 rounded font-mono font-bold transition ${
                radiusFilter === r
                  ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
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
        <div className="lg:col-span-7 bg-slate-950/90 border border-slate-800 rounded-xl p-4 relative overflow-hidden flex flex-col justify-between min-h-[460px] shadow-xl">
          {/* Tactical Grid Background Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* Radar Header Info */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 z-10">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>RADAR CENTER: ACTIVE RIG OIL-ASSAM-042</span>
            </div>
            <span>FAULT TREND: N45E STRUCTURAL DIP</span>
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
                <circle r="14" fill="#06b6d4" fillOpacity="0.2" className="animate-ping" />
                <circle r="8" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                <circle r="3" fill="#ffffff" />
                <text x="12" y="4" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  OIL-ASSAM-042 (ACTIVE)
                </text>
              </g>

              {/* OFFSET WELL PINS */}
              {allOffsetWells.map((well) => {
                // Approximate coordinate offset conversion for visualization canvas
                // Northing maps to -Y, Easting maps to +X
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
                      <circle r="12" fill={hasStuckPipe ? '#ef4444' : '#f59e0b'} fillOpacity="0.25" className="animate-pulse" />
                    )}

                    {/* Well Dot */}
                    <circle
                      r={isSelected ? '9' : '6'}
                      fill={hasStuckPipe ? '#ef4444' : '#f59e0b'}
                      stroke={isSelected ? '#ffffff' : '#090d16'}
                      strokeWidth="2"
                    />

                    {/* Trajectory Vector Line connecting to active well */}
                    <line
                      x1="0"
                      y1="0"
                      x2={svgCenter - cx}
                      y2={svgCenter - cy}
                      stroke={isSelected ? '#38bdf8' : '#334155'}
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
                      fill="#090d16"
                      fillOpacity="0.9"
                      stroke={isSelected ? '#38bdf8' : '#334155'}
                      strokeWidth="1"
                    />
                    <text x="14" y="-1" fill="#f8fafc" fontSize="10" fontWeight="bold" fontFamily="monospace">
                      {well.name.split(' ')[0]}
                    </text>
                    <text x="14" y="9" fill={well.relevanceScore > 90 ? '#38bdf8' : '#94a3b8'} fontSize="9" fontFamily="monospace">
                      {well.distance}m • Match {well.relevanceScore}%
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Compass & Map Legend Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono z-10">
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
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
            <div className="flex items-center space-x-1 text-slate-400">
              <Compass className="w-4 h-4 text-cyan-400" />
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
            <div className="h-full bg-slate-950/80 border border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-center text-slate-400">
              <MapPin className="w-12 h-12 text-slate-600 mb-3" />
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                Select an Offset Well
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Click any offset well pin on the radar map to inspect its geological match, historical dysfunctions, and linked reports.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
