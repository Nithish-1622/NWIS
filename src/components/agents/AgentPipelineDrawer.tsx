'use client';

import React from 'react';
import { AIAgentInfo } from '@/types/nwis';
import { Cpu, CheckCircle2, AlertTriangle, Loader2, ArrowRight } from 'lucide-react';

interface AgentPipelineDrawerProps {
  agents: AIAgentInfo[];
}

export const AgentPipelineDrawer: React.FC<AgentPipelineDrawerProps> = ({ agents }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-3 shadow-lg">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            6-AGENT INTELLIGENCE PIPELINE ORCHESTRATION
          </h3>
        </div>
        <span className="text-[10px] font-mono text-cyan-400">Autonomous Consensus Pipeline</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
        {agents.map((agent, index) => {
          const isWarning = agent.state === 'WARNING';
          const isProcessing = agent.state === 'PROCESSING';

          return (
            <div
              key={agent.id}
              className={`p-2.5 rounded-lg border transition space-y-1.5 flex flex-col justify-between ${
                isWarning
                  ? 'bg-red-950/40 border-red-500/50 shadow-sm shadow-red-950'
                  : isProcessing
                  ? 'bg-amber-950/40 border-amber-500/40'
                  : 'bg-slate-950/80 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-slate-400">AGENT 0{index + 1}</span>
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

                <div className="font-bold text-[11px] text-slate-100 leading-snug line-clamp-1">
                  {agent.name.replace(' Agent', '')}
                </div>
                <div className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{agent.role}</div>
              </div>

              <div className="pt-1.5 border-t border-slate-800/80 text-[10px] font-mono text-cyan-300 line-clamp-1">
                {agent.metricsProcessed}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
