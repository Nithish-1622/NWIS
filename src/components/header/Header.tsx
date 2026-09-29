'use client';

import React from 'react';
import { TelemetryPoint, RiskAssessment } from '@/types/nwis';
import { getRiskBadgeColor } from '@/lib/utils';
import { Activity, ShieldAlert, Cpu, Layers, Radio, Play, Pause, RotateCcw, FastForward } from 'lucide-react';

interface HeaderProps {
  telemetry: TelemetryPoint;
  riskAssessment: RiskAssessment;
  isPlaying: boolean;
  speed: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onFastForward: () => void;
  onSetSpeed: (speed: number) => void;
  activeView: string;
}

export const Header: React.FC<HeaderProps> = ({
  telemetry,
  riskAssessment,
  isPlaying,
  speed,
  onStart,
  onPause,
  onReset,
  onFastForward,
  onSetSpeed,
  activeView,
}) => {
  return (
    <header className="bg-slate-950/90 border-b border-slate-800/80 px-4 py-2.5 backdrop-blur-md sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3 text-slate-100 shadow-lg shadow-black/40">
      {/* Brand & Organization */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-700 p-0.5 shadow-md shadow-cyan-900/40 flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
            <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-extrabold tracking-wider text-base text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">
              NWIS
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
              SIMULATION MODE
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            Nearby Wells Intelligence System • <span className="text-cyan-300 font-semibold">Oil India Limited (OIL)</span> eRTMAC Companion
          </p>
        </div>
      </div>

      {/* Active Well Status Snapshot */}
      <div className="hidden lg:flex items-center space-x-4 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
        <div className="flex items-center space-x-1.5 border-r border-slate-800 pr-3">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">Rig:</span>
          <span className="font-mono font-bold text-slate-200">OIL-ASSAM-042</span>
        </div>

        <div className="flex items-center space-x-1 border-r border-slate-800 pr-3">
          <span className="text-slate-400">Depth:</span>
          <span className="font-mono font-bold text-cyan-300">{telemetry.depth} m</span>
          <span className="text-[10px] text-slate-500 font-mono">(TVD {telemetry.tvd}m)</span>
        </div>

        <div className="flex items-center space-x-1 border-r border-slate-800 pr-3">
          <Layers className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-slate-400">Formation:</span>
          <span className={`font-semibold ${telemetry.formation === 'Kopili Shale' ? 'text-red-400 font-bold' : 'text-purple-300'}`}>
            {telemetry.formation}
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Risk:</span>
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-bold border uppercase ${getRiskBadgeColor(
              riskAssessment.level
            )}`}
          >
            {riskAssessment.level} ({Math.round(riskAssessment.score * 100)}%)
          </span>
        </div>
      </div>

      {/* Interactive Simulation Controls */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 space-x-1">
          {isPlaying ? (
            <button
              onClick={onPause}
              className="flex items-center space-x-1 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 px-2.5 py-1 rounded text-xs font-semibold border border-amber-500/40 transition"
              title="Pause Drilling Simulation"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>PAUSE</span>
            </button>
          ) : (
            <button
              onClick={onStart}
              className="flex items-center space-x-1 bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 px-2.5 py-1 rounded text-xs font-semibold border border-cyan-500/40 transition shadow-sm shadow-cyan-900/40"
              title="Start Deterministic Live Simulation"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>START SIM</span>
            </button>
          )}

          <button
            onClick={onReset}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition"
            title="Reset Simulation to 3,145 m"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onFastForward}
            className="flex items-center space-x-1 text-slate-300 hover:text-amber-300 hover:bg-slate-800 px-2 py-1 rounded text-xs font-semibold transition"
            title="Fast Forward to Pack-Off Precursor Hazard Zone (Step 52)"
          >
            <FastForward className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">HAZARD PRESET</span>
          </button>
        </div>

        {/* Speed Selector */}
        <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 space-x-0.5 text-xs font-mono">
          {[1, 2, 4].map((s) => (
            <button
              key={s}
              onClick={() => onSetSpeed(s)}
              className={`px-2 py-0.5 rounded font-bold transition ${
                speed === s
                  ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
