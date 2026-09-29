'use client';

import React from 'react';
import { AIAgentInfo } from '@/types/nwis';
import { Cpu, CheckCircle2, AlertTriangle, Loader2, ArrowRight } from 'lucide-react';

interface AgentPipelineDrawerProps {
  agents: AIAgentInfo[];
}

export const AgentPipelineDrawer: React.FC<AgentPipelineDrawerProps> = ({ agents }) => {
  return (
    <div className="bg-[#110d1e]/90 border border-[#8968bf]/[0.2] rounded-xl p-4 space-y-3 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between pb-2.5 border-b border-[#8968bf]/[0.18]">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-[#551ca5]/20 border border-[#8968bf]/[0.3] text-[#8968bf]">
            <Cpu className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            6-AGENT INTELLIGENCE PIPELINE ORCHESTRATION
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[#8968bf] bg-[#1c1469]/50 px-2.5 py-0.5 rounded-full border border-[#8968bf]/[0.3]">
          Autonomous Consensus Pipeline
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
        {agents.map((agent, index) => {
          const isWarning = agent.state === 'WARNING';
          const isProcessing = agent.state === 'PROCESSING';

          return (
            <div
              key={agent.id}
              className={`p-3 rounded-xl border transition-all space-y-2 flex flex-col justify-between shadow-sm ${
                isWarning
                  ? 'bg-red-950/40 border-red-500/60 shadow-red-950/30'
                  : isProcessing
                  ? 'bg-amber-950/40 border-amber-500/50'
                  : 'bg-[#0a0812]/85 border-[#8968bf]/[0.18] hover:border-[#8968bf]/[0.4]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-[#8a8299]">AGENT 0{index + 1}</span>
                  {isWarning ? (
                    <span className="flex items-center space-x-1 text-[9px] font-bold text-red-400 bg-red-500/20 px-1.5 py-0.5 rounded border border-red-500/40">
                      <AlertTriangle className="w-2.5 h-2.5" />
                      <span>WARN</span>
                    </span>
                  ) : isProcessing ? (
                    <span className="flex items-center space-x-1 text-[9px] font-bold text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/40 animate-pulse">
                      <Loader2 className="w-2.5 h-2.5 animate-spin" />
                      <span>PROC</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/40">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span>OK</span>
                    </span>
                  )}
                </div>

                <div className="font-bold text-[11px] text-[#f0edf8] leading-snug line-clamp-1">
                  {agent.name.replace(' Agent', '')}
                </div>
                <div className="text-[10px] text-[#8a8299] line-clamp-2 mt-0.5 leading-relaxed">{agent.role}</div>
              </div>

              <div className="pt-2 border-t border-[#8968bf]/[0.15] text-[10px] font-mono text-[#8968bf] font-medium line-clamp-1">
                {agent.metricsProcessed}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

