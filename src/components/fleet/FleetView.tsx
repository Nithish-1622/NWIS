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
    <div className="space-y-4 text-[#f0edf8]">
      {/* Fleet Header Summary */}
      <div className="bg-[#110d1e]/90 border border-[#8968bf]/[0.2] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-[#551ca5]/20 border border-[#8968bf]/[0.35] text-[#8968bf]">
            <Grid className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              OIL INDIA LIMITED — FLEET INTELLIGENCE MONITOR
            </h2>
            <p className="text-xs text-[#8a8299]">
              18 Active Rigs Across Upper Assam Basin • Real-Time eRTMAC Companion Fleet Stream
            </p>
          </div>
        </div>

        {/* Status Counters */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              filterStatus === 'ALL' ? 'bg-[#551ca5]/40 text-white border-[#8968bf]/[0.5] font-bold' : 'bg-[#0a0812] text-[#8a8299] border-[#8968bf]/[0.18]'
            }`}
          >
            ALL (18)
          </button>
          <button
            onClick={() => setFilterStatus('NORMAL')}
            className={`px-2.5 py-1.5 rounded-lg border transition-all ${
              filterStatus === 'NORMAL' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60 font-bold' : 'bg-[#0a0812] text-[#8a8299] border-[#8968bf]/[0.18]'
            }`}
          >
            NORMAL ({normalCount})
          </button>
          <button
            onClick={() => setFilterStatus('ELEVATED')}
            className={`px-2.5 py-1.5 rounded-lg border transition-all ${
              filterStatus === 'ELEVATED' ? 'bg-amber-950/80 text-amber-300 border-amber-500/60 font-bold' : 'bg-[#0a0812] text-[#8a8299] border-[#8968bf]/[0.18]'
            }`}
          >
            ELEVATED ({elevatedCount})
          </button>
          <button
            onClick={() => setFilterStatus('CAUTION')}
            className={`px-2.5 py-1.5 rounded-lg border transition-all ${
              filterStatus === 'CAUTION' ? 'bg-orange-950/80 text-orange-300 border-orange-500/60 font-bold' : 'bg-[#0a0812] text-[#8a8299] border-[#8968bf]/[0.18]'
            }`}
          >
            CAUTION ({cautionCount})
          </button>
          <button
            onClick={() => setFilterStatus('CRITICAL')}
            className={`px-2.5 py-1.5 rounded-lg border transition-all ${
              filterStatus === 'CRITICAL' ? 'bg-red-950/80 text-red-300 border-red-500/60 animate-pulse font-bold' : 'bg-[#0a0812] text-[#8a8299] border-[#8968bf]/[0.18]'
            }`}
          >
            CRITICAL ({criticalCount})
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="flex items-center space-x-2 bg-[#110d1e] border border-[#8968bf]/[0.2] rounded-xl px-3.5 py-2.5 text-xs shadow-inner">
        <Search className="w-4 h-4 text-[#8a8299]" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter rigs by rig name, well ID, or field..."
          className="bg-transparent border-none text-[#cec9e1] placeholder-[#5a5582] focus:outline-none w-full"
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
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 shadow-md ${
                rig.status === 'CRITICAL'
                  ? 'bg-red-950/40 border-red-500/60 shadow-lg shadow-red-950/40 hover:border-red-400'
                  : rig.status === 'CAUTION'
                  ? 'bg-orange-950/30 border-orange-500/40 hover:border-orange-400'
                  : rig.status === 'ELEVATED'
                  ? 'bg-amber-950/30 border-amber-500/40 hover:border-amber-400'
                  : 'bg-[#110d1e]/85 border-[#8968bf]/[0.18] hover:border-[#8968bf]/[0.45] hover:bg-[#15112a]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[10px] font-bold text-[#8a8299]">{rig.id}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono border uppercase ${getRiskBadgeColor(
                      rig.status
                    )}`}
                  >
                    {rig.status}
                  </span>
                </div>

                <div className="font-extrabold text-sm text-white tracking-wide">{rig.rigName}</div>
                <div className="font-mono text-xs text-[#8968bf] font-bold">{rig.wellName}</div>
                <div className="text-[10px] text-[#8a8299]">{rig.field}</div>
              </div>

              <div className="space-y-1 pt-2 border-t border-[#8968bf]/[0.15] text-[11px] font-mono">
                <div className="flex justify-between">
                  <span className="text-[#8a8299]">Depth:</span>
                  <span className="text-[#cec9e1] font-bold">{rig.currentDepth} m</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-[#8a8299]">Formation:</span>
                  <span className="text-purple-300 font-semibold">{rig.formation.split(' ')[0]}</span>
                </div>
                <div className="flex justify-between text-[10px] text-[#8a8299] pt-1">
                  <span>ROP {rig.rop} m/h</span>
                  <span>SPP {rig.spp} psi</span>
                </div>
              </div>

              {isMainSimRig && (
                <div className="text-[9px] font-bold text-[#cec9e1] bg-[#551ca5]/40 px-2 py-0.5 rounded border border-[#8968bf]/[0.4] text-center shadow-sm">
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


