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
    <div className="space-y-4 text-[#f0edf8]">
      {/* Primary Alert Banner */}
      <div
        className={`p-4 rounded-xl border ${getRiskColor(riskAssessment.level)} transition-all duration-300 shadow-xl backdrop-blur-sm`}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 shrink-0 shadow-md">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40">
                  PREDICTIVE DRILLING RISK
                </span>
                <span className="text-xs text-[#8a8299] font-mono">ID #HAZ-2026-042</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-wide mt-1">
                {riskAssessment.recommendation.title}
              </h2>
              <p className="text-xs text-[#cec9e1] mt-1 max-w-2xl leading-relaxed">
                {riskAssessment.recommendation.summary}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center space-x-2 bg-[#0a0812]/80 p-2.5 rounded-xl border border-[#8968bf]/[0.2] text-xs font-mono shadow-inner">
            <div className="text-center px-3 border-r border-[#8968bf]/[0.15]">
              <div className="text-[10px] text-[#8a8299] uppercase font-semibold">RISK SCORE</div>
              <div className="text-xl font-black text-red-400 mt-0.5">{Math.round(riskAssessment.score * 100)}%</div>
            </div>
            <div className="text-center px-3 border-r border-[#8968bf]/[0.15]">
              <div className="text-[10px] text-[#8a8299] uppercase font-semibold">CONFIDENCE</div>
              <div className="text-xl font-black text-[#8968bf] mt-0.5">{riskAssessment.confidence}%</div>
            </div>
            <div className="text-center px-3 border-r border-[#8968bf]/[0.15]">
              <div className="text-[10px] text-[#8a8299] uppercase font-semibold">EST. ONSET</div>
              <div className="text-xl font-black text-amber-300 mt-0.5">{riskAssessment.horizonMinutes}m</div>
            </div>
            <div className="text-center px-3">
              <div className="text-[10px] text-[#8a8299] uppercase font-semibold">EXPECTED DEPTH</div>
              <div className="text-sm font-bold text-[#cec9e1] mt-1">
                {riskAssessment.expectedDepthMin}–{riskAssessment.expectedDepthMax} m
              </div>
            </div>
          </div>
        </div>

        {/* Primary Evidence Checklist */}
        <div className="mt-4 pt-3 border-t border-[#8968bf]/[0.15]">
          <div className="text-[11px] font-bold text-[#8a8299] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
            <Info className="w-3.5 h-3.5 text-[#8968bf]" />
            <span>PRIMARY VERIFIED EVIDENCE FACTORS</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-2 bg-[#15112a]/80 px-3 py-2 rounded-lg border border-[#8968bf]/[0.2]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-[#cec9e1]">Torque variance increasing (+5.2 kN·m volatility)</span>
            </div>
            <div className="flex items-center space-x-2 bg-[#15112a]/80 px-3 py-2 rounded-lg border border-[#8968bf]/[0.2]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-[#cec9e1]">Standpipe pressure divergence (+240 psi spike)</span>
            </div>
            <div className="flex items-center space-x-2 bg-[#15112a]/80 px-3 py-2 rounded-lg border border-[#8968bf]/[0.2]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-[#cec9e1]">ROP degradation decay (38 → 14 m/hr)</span>
            </div>
            <div className="flex items-center space-x-2 bg-[#15112a]/80 px-3 py-2 rounded-lg border border-[#8968bf]/[0.2]">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-[#cec9e1]">Similar stuck-pipe pattern in 3 offset wells (OIL-041, 039, 043)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Evidence Fusion Matrix */}
      <div className="bg-[#15112a]/90 border border-[#8968bf]/[0.18] rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#f0edf8] uppercase tracking-wide flex items-center space-x-2">
              <Layers className="w-4 h-4 text-[#8968bf]" />
              <span>Multi-Factor Evidence Fusion Matrix ("Why This Alert?")</span>
            </h3>
            <p className="text-xs text-[#8a8299] mt-0.5">
              Weighted integration of physics, geology, machine learning, and historical precedent.
            </p>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#1c1469]/60 text-[#a98fda] border border-[#8968bf]/[0.3]">
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
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-[#1c1469]/50 border-[#8968bf]/[0.6] shadow-lg shadow-[#551ca5]/20'
                      : 'bg-[#0a0812]/70 border-[#8968bf]/[0.18] hover:bg-[#15112a]/90 hover:border-[#8968bf]/[0.35]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-xs text-[#cec9e1]">{ev.category}</span>
                      <span className="text-[10px] font-mono text-[#8a8299] bg-[#15112a] px-2 py-0.5 rounded border border-[#8968bf]/[0.2]">
                        {ev.weight}% Weight
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                          ev.status === 'CRITICAL'
                            ? 'bg-red-500/20 text-red-300 border-red-500/40'
                            : ev.status === 'ELEVATED'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        {ev.status}
                      </span>
                      <span className="font-mono text-xs font-bold text-[#8968bf]">{ev.score}/100</span>
                    </div>
                  </div>

                  {/* Horizontal Contribution Bar */}
                  <div className="w-full bg-[#0a0812] rounded-full h-2 overflow-hidden border border-[#8968bf]/[0.18]">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        ev.score > 65
                          ? 'bg-gradient-to-r from-amber-500 to-red-500'
                          : ev.score > 35
                          ? 'bg-gradient-to-r from-[#8968bf] to-amber-400'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${ev.score}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#8a8299] mt-1.5 line-clamp-1">{ev.description}</p>
                </button>
              );
            })}
          </div>

          {/* Selected Evidence Deep Inspector */}
          <div className="lg:col-span-5 bg-[#0a0812]/90 border border-[#8968bf]/[0.2] rounded-xl p-4 flex flex-col justify-between shadow-md">
            <div>
              <div className="flex items-center justify-between pb-2.5 border-b border-[#8968bf]/[0.18] mb-3">
                <span className="text-xs font-bold text-[#8968bf] uppercase tracking-wider flex items-center space-x-1.5">
                  <Info className="w-4 h-4 text-[#8968bf]" />
                  <span>{activeEvidence.category} Evidence Inspector</span>
                </span>
                <span className="text-[10px] font-mono text-[#8a8299]">{activeEvidence.weight}% Weight Contribution</span>
              </div>

              <p className="text-xs text-[#cec9e1] font-medium mb-3 leading-relaxed">{activeEvidence.description}</p>

              <div className="space-y-2">
                <div className="text-[10px] font-bold text-[#8968bf] uppercase tracking-widest">UNDERLYING EVIDENCE LOGS:</div>
                {activeEvidence.details.map((detail, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-[#15112a] border border-[#8968bf]/[0.18] text-xs font-mono text-[#cec9e1] flex items-start space-x-2"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#8968bf] shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>

              {/* Offset Wells Evidence Quick Launcher */}
              {activeEvidence.category === 'Historical Offset' && (
                <div className="mt-4 pt-3 border-t border-[#8968bf]/[0.18] space-y-2">
                  <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">LINKED HISTORICAL DOCUMENTS:</div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => onOpenDocument && onOpenDocument('DOC-041-DDR')}
                      className="flex items-center space-x-1.5 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 px-2.5 py-1.5 rounded-md text-[11px] font-mono border border-amber-500/40 transition shadow-sm"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>DDR_OIL_041_2018.pdf (P.47)</span>
                    </button>
                    <button
                      onClick={() => onOpenDocument && onOpenDocument('DOC-039-WCR')}
                      className="flex items-center space-x-1.5 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 px-2.5 py-1.5 rounded-md text-[11px] font-mono border border-amber-500/40 transition shadow-sm"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>WCR_OIL_039.pdf (P.112)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-2.5 border-t border-[#8968bf]/[0.18] text-[10px] text-[#5a5582] font-mono flex items-center justify-between">
              <span>Verified by 6 AI Agents</span>
              <span className="text-[#8968bf] font-semibold">Deterministic Engine</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

