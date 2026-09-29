'use client';

import React, { useState } from 'react';
import { FLEET_RIGS } from '@/data/fleet';
import { FleetRig, RiskLevel } from '@/types/nwis';
import { getRiskBadgeColor } from '@/lib/utils';
import { Grid, Activity, Layers, AlertTriangle, ShieldCheck, Gauge, TrendingUp, Search } from 'lucide-react';

interface FleetViewProps {
  onSelectRig?: (wellName: string) => void;
}

export const FleetView: React.FC<FleetViewProps> = ({ onSelectRig }) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredRigs = FLEET_RIGS.filter((rig) => {
    const matchesStatus = filterStatus === 'ALL' || rig.status === filterStatus;
    const matchesSearch =
      rig.rigName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rig.wellName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rig.field.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const normalCount = FLEET_RIGS.filter((r) => r.status === 'NORMAL').length;
  const elevatedCount = FLEET_RIGS.filter((r) => r.status === 'ELEVATED').length;
  const cautionCount = FLEET_RIGS.filter((r) => r.status === 'CAUTION').length;
  const criticalCount = FLEET_RIGS.filter((r) => r.status === 'CRITICAL').length;

  return (
    <div className="space-y-4 text-slate-100">
      {/* Fleet Header Summary */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Grid className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              OIL INDIA LIMITED — FLEET INTELLIGENCE MONITOR
            </h2>
            <p className="text-xs text-slate-400">
              18 Active Rigs Across Upper Assam Basin • Real-Time eRTMAC Companion Fleet Stream
            </p>
          </div>
        </div>

        {/* Status Counters */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 rounded border transition ${
              filterStatus === 'ALL' ? 'bg-slate-800 text-white border-slate-600' : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            ALL (18)
          </button>
          <button
            onClick={() => setFilterStatus('NORMAL')}
            className={`px-2.5 py-1.5 rounded border transition ${
              filterStatus === 'NORMAL' ? 'bg-emerald-950 text-emerald-300 border-emerald-500' : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            NORMAL ({normalCount})
          </button>
          <button
            onClick={() => setFilterStatus('ELEVATED')}
            className={`px-2.5 py-1.5 rounded border transition ${
              filterStatus === 'ELEVATED' ? 'bg-amber-950 text-amber-300 border-amber-500' : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            ELEVATED ({elevatedCount})
          </button>
          <button
            onClick={() => setFilterStatus('CAUTION')}
            className={`px-2.5 py-1.5 rounded border transition ${
              filterStatus === 'CAUTION' ? 'bg-orange-950 text-orange-300 border-orange-500' : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            CAUTION ({cautionCount})
          </button>
          <button
            onClick={() => setFilterStatus('CRITICAL')}
            className={`px-2.5 py-1.5 rounded border transition ${
              filterStatus === 'CRITICAL' ? 'bg-red-950 text-red-300 border-red-500 animate-pulse' : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            CRITICAL ({criticalCount})
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter rigs by rig name, well ID, or field..."
          className="bg-transparent border-none text-slate-200 placeholder-slate-500 focus:outline-none w-full"
        />
      </div>

      {/* 18-Rig Compact Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {filteredRigs.map((rig) => {
          const isMainSimRig = rig.id === 'RIG-01';

          return (
            <div
              key={rig.id}
              onClick={() => onSelectRig && onSelectRig(rig.wellName)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                rig.status === 'CRITICAL'
                  ? 'bg-red-950/40 border-red-500/60 shadow-lg shadow-red-950/40 hover:border-red-400'
                  : rig.status === 'CAUTION'
                  ? 'bg-orange-950/30 border-orange-500/40 hover:border-orange-400'
                  : rig.status === 'ELEVATED'
                  ? 'bg-amber-950/30 border-amber-500/40 hover:border-amber-400'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[10px] font-bold text-slate-400">{rig.id}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono border uppercase ${getRiskBadgeColor(
                      rig.status
                    )}`}
                  >
                    {rig.status}
                  </span>
                </div>

                <div className="font-extrabold text-sm text-white tracking-wide">{rig.rigName}</div>
                <div className="font-mono text-xs text-cyan-300 font-bold">{rig.wellName}</div>
                <div className="text-[10px] text-slate-400">{rig.field}</div>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Depth:</span>
                  <span className="text-slate-200 font-bold">{rig.currentDepth} m</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Formation:</span>
                  <span className="text-purple-300 font-semibold">{rig.formation.split(' ')[0]}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                  <span>ROP {rig.rop} m/h</span>
                  <span>SPP {rig.spp} psi</span>
                </div>
              </div>

              {isMainSimRig && (
                <div className="text-[9px] font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 text-center">
                  SIMULATED RIG ACTIVE
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
