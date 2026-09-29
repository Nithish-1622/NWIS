'use client';

import React, { useState } from 'react';
import { RiskAssessment } from '@/types/nwis';
import { ShieldCheck, CheckCircle2, AlertTriangle, Layers, FileText, ArrowRight, Check } from 'lucide-react';
import { getRiskBadgeColor } from '@/lib/utils';

interface DecisionSupportCardProps {
  riskAssessment: RiskAssessment;
  onViewEvidence: () => void;
  onOpenOffsetHistory: () => void;
}

export const DecisionSupportCard: React.FC<DecisionSupportCardProps> = ({
  riskAssessment,
  onViewEvidence,
  onOpenOffsetHistory,
}) => {
  const [isAcknowledged, setIsAcknowledged] = useState<boolean>(false);

  const { recommendation, level, score } = riskAssessment;
  const isCritical = level === 'CRITICAL' || level === 'CAUTION';

  return (
    <div
      className={`rounded-xl border p-4 shadow-xl transition-all duration-300 ${
        isCritical
          ? 'bg-slate-950/95 border-amber-500/60 shadow-amber-950/20'
          : 'bg-slate-950/80 border-slate-800'
      }`}
    >
      {/* Top Banner & Advisory Tag */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                ADVISORY — HUMAN DECISION REQUIRED
              </span>
              {isAcknowledged && (
                <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center space-x-1">
                  <Check className="w-3 h-3" />
                  <span>ACKNOWLEDGED BY DRILLER</span>
                </span>
              )}
            </div>
            <h3 className="text-sm font-bold text-white mt-0.5">{recommendation.title}</h3>
          </div>
        </div>

        <span className={`px-2.5 py-1 rounded text-xs font-bold font-mono border uppercase ${getRiskBadgeColor(level)}`}>
          {level} ({Math.round(score * 100)}%)
        </span>
      </div>

      {/* Recommended 6-Step Driller Review Workflow */}
      <div className="mt-3 space-y-2">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          RECOMMENDED OPERATIONAL REVIEW WORKFLOW:
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {recommendation.workflowSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-200 font-mono flex items-start space-x-2"
            >
              <span className="text-amber-400 font-bold shrink-0">{idx + 1}.</span>
              <span>{step.replace(/^\d+\.\s*/, '')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={onViewEvidence}
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition shadow-sm"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>VIEW EVIDENCE</span>
          </button>

          <button
            onClick={onOpenOffsetHistory}
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>OPEN OFFSET HISTORY</span>
          </button>
        </div>

        <button
          onClick={() => setIsAcknowledged(!isAcknowledged)}
          className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-bold font-mono transition shadow-md ${
            isAcknowledged
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
              : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isAcknowledged ? 'ALERT ACKNOWLEDGED' : 'ACKNOWLEDGE ALERT'}</span>
        </button>
      </div>
    </div>
  );
};
