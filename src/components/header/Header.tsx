'use client';

import React from 'react';
import Link from 'next/link';
import { TelemetryPoint, RiskAssessment } from '@/types/nwis';
import { getRiskBadgeColor } from '@/lib/utils';
import { Activity, ShieldAlert, Layers, Radio, Play, Pause, RotateCcw, FastForward, ArrowLeft } from 'lucide-react';

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
}) => {
  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-xl"
      style={{
        background: 'rgba(10,8,18,0.92)',
        borderBottom: '1px solid rgba(137,104,191,0.18)',
        boxShadow: '0 1px 0 rgba(137,104,191,0.1)',
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5">

        {/* ── Brand ── */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-opacity group-hover:opacity-80"
              style={{ background: 'linear-gradient(135deg,#551ca5,#1c1469)' }}
            >
              <Radio className="h-4 w-4 text-white animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-sm font-extrabold tracking-widest"
                style={{ color: '#cec9e1' }}
              >
                NWIS
              </span>
              <ArrowLeft className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity -ml-1" style={{ color: '#8968bf' }} />
            </div>
          </Link>

          <div
            className="hidden sm:flex items-center gap-1.5 rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest"
            style={{ borderColor: 'rgba(137,104,191,0.35)', color: '#8968bf', background: 'rgba(85,28,165,0.15)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            SIMULATION MODE
          </div>

          <span className="hidden md:block text-[10px]" style={{ color: 'rgba(137,104,191,0.5)' }}>
            Oil India Limited · eRTMAC Companion
          </span>
        </div>

        {/* ── Live Status Strip ── */}
        <div
          className="hidden lg:flex items-center gap-0 rounded-lg border text-[11px] font-mono overflow-hidden"
          style={{ borderColor: 'rgba(137,104,191,0.2)', background: 'rgba(21,17,42,0.8)' }}
        >
          <div
            className="flex items-center gap-1.5 px-3 py-2 border-r"
            style={{ borderColor: 'rgba(137,104,191,0.15)' }}
          >
            <Activity className="w-3 h-3" style={{ color: '#8968bf' }} />
            <span style={{ color: 'rgba(206,201,225,0.5)' }}>Well:</span>
            <span className="font-bold" style={{ color: '#cec9e1' }}>OIL-ASSAM-042</span>
          </div>

          <div
            className="flex items-center gap-1 px-3 py-2 border-r"
            style={{ borderColor: 'rgba(137,104,191,0.15)' }}
          >
            <span style={{ color: 'rgba(206,201,225,0.5)' }}>MD:</span>
            <span className="font-bold" style={{ color: '#8968bf' }}>{telemetry.depth} m</span>
            <span style={{ color: 'rgba(90,85,130,0.7)', fontSize: '9px' }}>TVD {telemetry.tvd}m</span>
          </div>

          <div
            className="flex items-center gap-1 px-3 py-2 border-r"
            style={{ borderColor: 'rgba(137,104,191,0.15)' }}
          >
            <Layers className="w-3 h-3" style={{ color: telemetry.formation === 'Kopili Shale' ? '#ef4444' : '#8968bf' }} />
            <span
              className="font-semibold"
              style={{ color: telemetry.formation === 'Kopili Shale' ? '#f87171' : '#cec9e1' }}
            >
              {telemetry.formation}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-2">
            <ShieldAlert className="w-3 h-3" style={{ color: 'rgba(137,104,191,0.6)' }} />
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${getRiskBadgeColor(riskAssessment.level)}`}
            >
              {riskAssessment.level} {Math.round(riskAssessment.score * 100)}%
            </span>
          </div>
        </div>

        {/* ── Simulation Controls ── */}
        <div className="flex items-center gap-2">
          {/* Main play/pause */}
          <div
            className="flex items-center rounded-lg border p-1 gap-1"
            style={{ borderColor: 'rgba(137,104,191,0.2)', background: 'rgba(21,17,42,0.8)' }}
          >
            {isPlaying ? (
              <button
                onClick={onPause}
                className="flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-semibold transition-all"
                style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }}
                title="Pause Simulation"
              >
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>PAUSE</span>
              </button>
            ) : (
              <button
                onClick={onStart}
                className="flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-semibold transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg,#551ca5,#3d2aab)', color: '#fff', boxShadow: '0 0 12px rgba(85,28,165,0.4)' }}
                title="Start Deterministic Live Simulation"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>START SIM</span>
              </button>
            )}

            <button
              onClick={onReset}
              className="p-1.5 rounded transition-colors"
              style={{ color: 'rgba(137,104,191,0.6)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#8968bf'; (e.currentTarget as HTMLElement).style.background = 'rgba(85,28,165,0.15)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(137,104,191,0.6)'; (e.currentTarget as HTMLElement).style.background = ''; }}
              title="Reset to 3,145 m"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onFastForward}
              className="flex items-center gap-1 px-2 py-1.5 rounded text-xs font-semibold transition-all"
              style={{ color: '#fbbf24' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(251,191,36,0.1)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; }}
              title="Jump to Pack-Off Hazard Zone (Step 52)"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">HAZARD</span>
            </button>
          </div>

          {/* Speed selector */}
          <div
            className="hidden sm:flex items-center rounded-lg border p-1 gap-0.5 text-xs font-mono"
            style={{ borderColor: 'rgba(137,104,191,0.2)', background: 'rgba(21,17,42,0.8)' }}
          >
            {[1, 2, 4].map((s) => (
              <button
                key={s}
                onClick={() => onSetSpeed(s)}
                className="px-2 py-0.5 rounded font-bold transition-all"
                style={{
                  background: speed === s ? 'rgba(85,28,165,0.4)' : 'transparent',
                  color: speed === s ? '#cec9e1' : 'rgba(90,85,130,0.8)',
                  border: speed === s ? '1px solid rgba(137,104,191,0.4)' : '1px solid transparent',
                }}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
