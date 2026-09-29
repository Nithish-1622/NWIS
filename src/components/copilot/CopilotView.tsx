'use client';

import React, { useState } from 'react';
import { CopilotMessage, TelemetryPoint, RiskAssessment, Well } from '@/types/nwis';
import { getCopilotResponse } from '@/lib/copilot';
import { Bot, Send, User, Sparkles, FileText, ArrowRight, ShieldCheck } from 'lucide-react';

interface CopilotViewProps {
  telemetry: TelemetryPoint;
  riskAssessment: RiskAssessment;
  offsetWells: Well[];
  onOpenDocument?: (docId: string) => void;
  onOpenOffsetWell?: (wellId: string) => void;
}

export const CopilotView: React.FC<CopilotViewProps> = ({
  telemetry,
  riskAssessment,
  offsetWells,
  onOpenDocument,
  onOpenOffsetWell,
}) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'init-1',
      sender: 'NWIS_COPILOT',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text:
        `Welcome to **NWIS Copilot**. I am monitoring live telemetry for **OIL-ASSAM-042** at depth **${telemetry.depth} m** in **${telemetry.formation}**.\n\n` +
        `Current risk assessment: **${riskAssessment.level} (${Math.round(riskAssessment.score * 100)}%)** for Pack-Off / Stuck Pipe.\n` +
        `Ask any question below or select a suggested prompt for instant evidence analysis.`,
      suggestedActions: [
        'Why is the current well at risk?',
        'Which nearby wells are relevant?',
        'What happened at this depth before?',
        'What should the driller review?',
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState<string>('');

  const suggestedQuestions = [
    'Why is the current well at risk?',
    'Which nearby wells are relevant?',
    'What happened at this depth before?',
    'What formation are we entering?',
    'What are the main risk indicators?',
    'What should the driller review?',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      sender: 'USER',
      text: query,
      timestamp: timeStr,
    };

    const copilotMsg = getCopilotResponse(query, telemetry, riskAssessment, offsetWells);

    setMessages((prev) => [...prev, userMsg, copilotMsg]);
    setInputQuery('');
  };

  return (
    <div className="bg-slate-950/95 border border-slate-800 rounded-xl p-4 flex flex-col h-[580px] shadow-2xl text-slate-100">
      {/* Copilot Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-700 text-white shadow-md shadow-cyan-900/40">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-white">NWIS DRILLING COPILOT</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                FRONTEND SIMULATED AI
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Context Aware • Active Depth: {telemetry.depth} m • Kopili Shale
            </p>
          </div>
        </div>

        <div className="text-right font-mono text-xs text-slate-400 hidden sm:block">
          <span className="text-cyan-400 font-bold">5 Offset Wells Index</span> • 6-Agent Pipeline Connected
        </div>
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="py-2 flex flex-wrap gap-1.5 shrink-0 border-b border-slate-800/60">
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="text-[11px] font-medium bg-slate-900 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-700 px-2.5 py-1 rounded-full transition flex items-center space-x-1"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>{q}</span>
          </button>
        ))}
      </div>

      {/* Messages Scroll Viewport */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {messages.map((msg) => {
          const isUser = msg.sender === 'USER';
          return (
            <div key={msg.id} className={`flex items-start space-x-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-xl rounded-xl p-3.5 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-cyan-600 text-white rounded-tr-none shadow-md'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none space-y-2'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] opacity-75 mb-1 font-mono">
                  <span>{isUser ? 'Drilling Engineer' : 'NWIS Copilot'}</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="whitespace-pre-line font-sans">{msg.text}</div>

                {/* Suggested Action Quick Buttons in Response */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-800 flex flex-wrap gap-1.5">
                    {msg.suggestedActions.map((act, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => {
                          if (act.includes('Document') || act.includes('DDR')) {
                            onOpenDocument && onOpenDocument('DOC-041-DDR');
                          } else {
                            handleSend(act);
                          }
                        }}
                        className="text-[10px] font-mono font-bold bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-slate-700 px-2 py-1 rounded flex items-center space-x-1 transition"
                      >
                        <ArrowRight className="w-3 h-3 text-cyan-400" />
                        <span>{act}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="pt-2 border-t border-slate-800 flex items-center space-x-2 shrink-0"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask NWIS Copilot about risk drivers, nearby offset wells, or historical documents..."
          className="flex-1 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition"
        />
        <button
          type="submit"
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center space-x-1.5 transition shadow-sm"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">ASK</span>
        </button>
      </form>
    </div>
  );
};
