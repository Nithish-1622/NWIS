'use client';

import React, { useState } from 'react';
import { RiskAssessment, EvidenceContribution } from '@/types/nwis';
import { ShieldAlert, ChevronRight, ChevronDown, CheckCircle2, AlertTriangle, Info, Clock, Layers, FileText } from 'lucide-react';
import { getRiskColor, getRiskBadgeColor } from '@/lib/utils';

interface RiskEvidenceViewProps {
  riskAssessment: RiskAssessment;
  onOpenDocument?: (docId: string) => void;
  onOpenOffsetWell?: (wellId: string) => void;
}

export const RiskEvidenceView: React.FC<RiskEvidenceViewProps> = ({
  riskAssessment,
  onOpenDocument,
  onOpenOffsetWell,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Physics');

  const activeEvidence = riskAssessment.evidence.find((e) => e.category === selectedCategory) || riskAssessment.evidence[0];

  return (
    <div className="space-y-4 text-slate-100">
      {/* Primary Alert Banner */}
      <div
        className={`p-4 rounded-xl border ${getRiskColor(riskAssessment.level)} transition-all duration-300 shadow-lg`}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 shrink-0">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40">
                  PREDICTIVE DRILLING RISK
                </span>
                <span className="text-xs text-slate-400 font-mono">ID #HAZ-2026-042</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-wide mt-1">
                {riskAssessment.recommendation.title}
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {riskAssessment.recommendation.summary}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center space-x-3 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 text-xs font-mono">
            <div className="text-center px-2.5 border-r border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">RISK SCORE</div>
              <div className="text-xl font-extrabold text-red-400">{Math.round(riskAssessment.score * 100)}%</div>
            </div>
            <div className="text-center px-2.5 border-r border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">CONFIDENCE</div>
              <div className="text-xl font-extrabold text-cyan-300">{riskAssessment.confidence}%</div>
            </div>
            <div className="text-center px-2.5 border-r border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">EST. ONSET</div>
              <div className="text-xl font-extrabold text-amber-300">{riskAssessment.horizonMinutes}m</div>
            </div>
            <div className="text-center px-2.5">
              <div className="text-[10px] text-slate-400 uppercase">EXPECTED DEPTH</div>
              <div className="text-sm font-bold text-purple-300">
                {riskAssessment.expectedDepthMin}–{riskAssessment.expectedDepthMax} m
              </div>
            </div>
          </div>
        </div>

        {/* Primary Evidence Checklist */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>PRIMARY VERIFIED EVIDENCE FACTORS</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-2 bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-200">Torque variance increasing (+5.2 kN·m volatility)</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-200">Standpipe pressure divergence (+240 psi spike)</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-200">ROP degradation decay (38 → 14 m/hr)</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-slate-200">Similar stuck-pipe pattern in 3 offset wells (OIL-041, 039, 043)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Evidence Fusion Matrix */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide flex items-center space-x-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Multi-Factor Evidence Fusion Matrix ("Why This Alert?")</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Weighted integration of physics, geology, machine learning, and historical precedent.
            </p>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
            H_hazard = Weighted Consensus
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Contribution Progress Bars List */}
          <div className="lg:col-span-7 space-y-2.5">
            {riskAssessment.evidence.map((ev) => {
              const isSelected = ev.category === selectedCategory;
              return (
                <button
                  key={ev.category}
                  onClick={() => setSelectedCategory(ev.category)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-cyan-500/60 shadow-md shadow-cyan-950/40'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-xs text-slate-200">{ev.category}</span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                        {ev.weight}% Weight
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                          ev.status === 'CRITICAL'
                            ? 'bg-red-500/20 text-red-300 border-red-500/40'
                            : ev.status === 'ELEVATED'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        {ev.status}
                      </span>
                      <span className="font-mono text-xs font-bold text-cyan-300">{ev.score}/100</span>
                    </div>
                  </div>

                  {/* Horizontal Contribution Bar */}
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        ev.score > 65
                          ? 'bg-gradient-to-r from-amber-500 to-red-500'
                          : ev.score > 35
                          ? 'bg-gradient-to-r from-cyan-500 to-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${ev.score}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-1">{ev.description}</p>
                </button>
              );
            })}
          </div>

          {/* Selected Evidence Deep Inspector */}
          <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Info className="w-4 h-4 text-cyan-400" />
                  <span>{activeEvidence.category} Evidence Inspector</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">{activeEvidence.weight}% Weight Contribution</span>
              </div>

              <p className="text-xs text-slate-300 font-medium mb-3">{activeEvidence.description}</p>

              <div className="space-y-2">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">UNDERLYING EVIDENCE LOGS:</div>
                {activeEvidence.details.map((detail, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 flex items-start space-x-2"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>

              {/* Offset Wells Evidence Quick Launcher */}
              {activeEvidence.category === 'Historical Offset' && (
                <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                  <div className="text-[10px] font-bold text-amber-400 uppercase">LINKED HISTORICAL DOCUMENTS:</div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => onOpenDocument && onOpenDocument('DOC-041-DDR')}
                      className="flex items-center space-x-1 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 px-2 py-1 rounded text-[11px] font-mono border border-amber-500/40 transition"
                    >
                      <FileText className="w-3 h-3" />
                      <span>DDR_OIL_041_2018.pdf (P.47)</span>
                    </button>
                    <button
                      onClick={() => onOpenDocument && onOpenDocument('DOC-039-WCR')}
                      className="flex items-center space-x-1 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 px-2 py-1 rounded text-[11px] font-mono border border-amber-500/40 transition"
                    >
                      <FileText className="w-3 h-3" />
                      <span>WCR_OIL_039.pdf (P.112)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-2 border-t border-slate-800 text-[10px] text-slate-500 font-mono flex items-center justify-between">
              <span>Verified by 6 AI Agents</span>
              <span className="text-cyan-400">Deterministic Engine</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
