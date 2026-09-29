'use client';

import React from 'react';
import { TelemetryPoint, RiskAssessment, Well, AIAgentInfo, DrillingDocument } from '@/types/nwis';
import { getRiskColor, getRiskBadgeColor } from '@/lib/utils';
import { TelemetryView } from '@/components/telemetry/TelemetryView';
import { RiskEvidenceView } from '@/components/risk/RiskEvidenceView';
import { NearbyWellsView } from '@/components/nearby-wells/NearbyWellsView';
import { AgentPipelineDrawer } from '@/components/agents/AgentPipelineDrawer';
import { DecisionSupportCard } from '@/components/decision-support/DecisionSupportCard';
import { getAgentsStatus } from '@/data/agents';
import { Activity, Radio, ShieldAlert, Layers, MapPin, Gauge, TrendingUp, Cpu, Sparkles, ChevronRight } from 'lucide-react';

interface CommandCenterProps {
  telemetry: TelemetryPoint;
  history: TelemetryPoint[];
  riskAssessment: RiskAssessment;
  activeWell: Well;
  offsetWells: Well[];
  allOffsetWells: Well[];
  selectedOffsetWell: Well | null;
  onSelectOffsetWell: (well: Well) => void;
  radiusFilter: number;
  onSelectRadiusFilter: (radius: number) => void;
  onOpenDocument: (docId: string) => void;
  onNavigateView: (view: any) => void;
  isPlaying: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onFastForward: () => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  telemetry,
  history,
  riskAssessment,
  activeWell,
  offsetWells,
  allOffsetWells,
  selectedOffsetWell,
  onSelectOffsetWell,
  radiusFilter,
  onSelectRadiusFilter,
  onOpenDocument,
  onNavigateView,
  isPlaying,
  onStart,
  onPause,
  onReset,
  onFastForward,
}) => {
  const agents = getAgentsStatus(telemetry, riskAssessment);

  return (
    <div className="space-y-4 text-slate-100">
      {/* 1. Hero Active Rig Operational Status Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-xl p-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 p-0.5 shadow-lg shadow-cyan-950 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Radio className="w-6 h-6 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-black text-white tracking-wide">
                  ACTIVE RIG: <span className="text-cyan-400">{activeWell.rigName}</span>
                </h1>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {activeWell.field}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Well: <strong className="text-slate-200">{activeWell.name}</strong> • Target Depth: 3,850 m • Lat: {activeWell.latitude}°N, Long: {activeWell.longitude}°E
              </p>
            </div>
          </div>

          {/* Key Metric Gauges */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <div className="bg-slate-950/80 px-3 py-2 rounded-lg border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase">MEASURED DEPTH</div>
              <div className="text-xl font-bold text-cyan-300">{telemetry.depth} m</div>
            </div>

            <div className="bg-slate-950/80 px-3 py-2 rounded-lg border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase">FORMATION</div>
              <div className={`text-sm font-bold mt-0.5 ${telemetry.formation === 'Kopili Shale' ? 'text-red-400' : 'text-purple-300'}`}>
                {telemetry.formation}
              </div>
            </div>

            <div className="bg-slate-950/80 px-3 py-2 rounded-lg border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase">PREDICTIVE HAZARD</div>
              <div className={`text-xs font-bold px-2.5 py-1 rounded border uppercase mt-0.5 ${getRiskBadgeColor(riskAssessment.level)}`}>
                {riskAssessment.level} ({Math.round(riskAssessment.score * 100)}%)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Predictive Alert Banner & Decision Support (If elevated or critical) */}
      {(riskAssessment.level === 'CRITICAL' || riskAssessment.level === 'CAUTION' || riskAssessment.level === 'ELEVATED') && (
        <div className="space-y-4">
          <RiskEvidenceView
            riskAssessment={riskAssessment}
            onOpenDocument={onOpenDocument}
            onOpenOffsetWell={(wellId) => {
              const match = offsetWells.find((w) => w.id === wellId);
              if (match) onSelectOffsetWell(match);
              onNavigateView('nearby-wells');
            }}
          />

          <DecisionSupportCard
            riskAssessment={riskAssessment}
            onViewEvidence={() => onNavigateView('risk-alerts')}
            onOpenOffsetHistory={() => onNavigateView('historical-intelligence')}
          />
        </div>
      )}

      {/* 3. Live Telemetry Suite */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
          <span className="flex items-center space-x-1.5">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>REAL-TIME TELEMETRY CHANNELS (WITSML STREAM)</span>
          </span>
          <button
            onClick={() => onNavigateView('live-simulation')}
            className="text-[11px] text-cyan-400 hover:underline font-mono flex items-center space-x-1"
          >
            <span>Full Telemetry Dashboard</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <TelemetryView telemetry={telemetry} history={history} />
      </div>

      {/* 4. 6-AI Agent Intelligence Pipeline Drawer */}
      <AgentPipelineDrawer agents={agents} />

      {/* 5. Geospatial Radar & Nearby Wells Discovery */}
      <NearbyWellsView
        offsetWells={offsetWells}
        allOffsetWells={allOffsetWells}
        selectedOffsetWell={selectedOffsetWell}
        onSelectOffsetWell={onSelectOffsetWell}
        radiusFilter={radiusFilter}
        onSelectRadiusFilter={onSelectRadiusFilter}
        onOpenDocument={onOpenDocument}
      />
    </div>
  );
};
