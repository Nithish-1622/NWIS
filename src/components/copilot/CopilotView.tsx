'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CopilotMessage, TelemetryPoint, RiskAssessment, Well } from '@/types/nwis';
import { getCopilotResponse } from '@/lib/copilot';
import {
  Send,
  Sparkles,
  Paperclip,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  Compass,
  FileText,
  ChevronRight,
  ShieldCheck,
  FileCheck
} from 'lucide-react';

interface CopilotViewProps {
  telemetry: TelemetryPoint;
  riskAssessment: RiskAssessment;
  offsetWells: Well[];
  onOpenDocument?: (docId: string) => void;
  onOpenOffsetWell?: (wellId: string) => void;
}

// ── Microsoft Copilot Fluid Ribbon SVG Emblem ──
function CopilotRibbonIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="copilot-grad-1" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8" />
          <stop offset="0.5" stopColor="#818cf8" />
          <stop offset="1" stopColor="#c084fc" />
        </linearGradient>
        <linearGradient id="copilot-grad-2" x1="12" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f472b6" />
          <stop offset="1" stopColor="#818cf8" />
        </linearGradient>
      </defs>
      <path
        d="M12 2C6.477 2 2 6.477 2 12c0 2.237.737 4.305 1.982 5.973L3 21l3.242-1.026A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"
        fill="url(#copilot-grad-1)"
        fillOpacity="0.2"
      />
      <path
        d="M8.5 7.5a4.5 4.5 0 017.664 3.182c.453.308.854.686 1.186 1.118A4.5 4.5 0 0115.5 16.5h-7a4.5 4.5 0 010-9h0z"
        stroke="url(#copilot-grad-1)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2" fill="url(#copilot-grad-2)" />
    </svg>
  );
}

// ── Formatted Markdown-to-JSX Parser (Removes raw ** and renders bold/italic/bullets) ──
function FormattedMessageText({ content }: { content: string }) {
  const lines = content.split('\n');

  return (
    <div className="space-y-1.5 text-xs text-[#e2dcee] leading-relaxed">
      {lines.map((line, lIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lIdx} className="h-1" />;
        }

        // Parse inline **bold** and *italic*
        const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);

        const renderedLine = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            const inner = part.slice(2, -2);
            return (
              <strong key={pIdx} className="font-semibold text-white">
                {inner}
              </strong>
            );
          }
          if (part.startsWith('*') && part.endsWith('*')) {
            const inner = part.slice(1, -1);
            return (
              <span key={pIdx} className="text-[#cec9e1] font-medium italic">
                {inner}
              </span>
            );
          }
          return part;
        });

        // Bullet point lines
        if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
          const contentWithoutBullet = parts.map((part, pIdx) => {
            let p = part;
            if (pIdx === 0 && (p.startsWith('•') || p.startsWith('-'))) {
              p = p.replace(/^[•\-]\s*/, '');
            }
            if (p.startsWith('**') && p.endsWith('**')) {
              return <strong key={pIdx} className="font-semibold text-white">{p.slice(2, -2)}</strong>;
            }
            return p;
          });

          return (
            <div key={lIdx} className="flex items-start space-x-2 pl-1 my-0.5">
              <span className="text-[#8968bf] font-bold text-xs mt-0.5">•</span>
              <div className="flex-1">{contentWithoutBullet}</div>
            </div>
          );
        }

        // Numbered list lines (e.g. "1. ")
        const numMatch = trimmed.match(/^(\d+)\.\s+/);
        if (numMatch) {
          const num = numMatch[1];
          const contentWithoutNum = parts.map((part, pIdx) => {
            let p = part;
            if (pIdx === 0) {
              p = p.replace(/^\d+\.\s*/, '');
            }
            if (p.startsWith('**') && p.endsWith('**')) {
              return <strong key={pIdx} className="font-semibold text-white">{p.slice(2, -2)}</strong>;
            }
            return p;
          });

          return (
            <div key={lIdx} className="flex items-start space-x-2 pl-1 my-0.5">
              <span className="text-[#8968bf] font-mono text-[11px] font-bold mt-0.5">{num}.</span>
              <div className="flex-1">{contentWithoutNum}</div>
            </div>
          );
        }

        return <div key={lIdx}>{renderedLine}</div>;
      })}
    </div>
  );
}

export const CopilotView: React.FC<CopilotViewProps> = ({
  telemetry,
  riskAssessment,
  offsetWells,
  onOpenDocument,
  onOpenOffsetWell,
}) => {
  const [tone, setTone] = useState<'Precise' | 'Balanced' | 'Creative'>('Precise');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'ms-copilot-welcome',
      sender: 'NWIS_COPILOT',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text:
        `Hello Drilling Operations Team. I am **Microsoft Copilot for WellVista**, integrated directly with Oil India Limited's eRTMAC subsurface data stream.\n\n` +
        `Currently monitoring active well **OIL-ASSAM-042** at **${telemetry.depth} m MD** (**${telemetry.formation}**).\n` +
        `Current risk advisory state is **${riskAssessment.level} (${Math.round(riskAssessment.score * 100)}% Bayesian confidence)** for potential pipe pack-off.\n\n` +
        `How can I assist your drilling operations or offset well review today?`,
      suggestedActions: [
        'Why is the current well at risk?',
        'Compare with nearby offset well OIL-041',
        'What happened at 3,210m in historical records?',
        'Generate driller action plan checklist',
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const starterCards = [
    {
      title: 'Analyze Formation Risk',
      desc: 'Why is Kopili shale triggering torque & SPP divergence?',
      query: 'Why is the current well at risk?',
      icon: ShieldCheck,
    },
    {
      title: 'Offset Well Comparison',
      desc: 'Correlate depth 3,210m with OIL-041 historical stuck pipe incident.',
      query: 'Which nearby wells are relevant?',
      icon: Compass,
    },
    {
      title: 'Drilling Vault OCR Query',
      desc: 'Search historical Daily Drilling Reports & stuck pipe NPT logs.',
      query: 'What happened at this depth before?',
      icon: FileText,
    },
    {
      title: 'SOP Mitigation Checklist',
      desc: 'Generate driller workflow for wiper trip and mud weight adjust.',
      query: 'What should the driller review?',
      icon: FileCheck,
    },
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      sender: 'USER',
      text: query,
      timestamp: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    // 1.5 second processing / thinking delay
    setTimeout(() => {
      const copilotMsg = getCopilotResponse(query, telemetry, riskAssessment, offsetWells);
      setMessages((prev) => [...prev, copilotMsg]);
      setIsLoading(false);
    }, 1500);
  };

  const handleCopy = (id: string, text: string) => {
    // Strip raw markdown asterisks when copying plain text
    const cleanText = text.replace(/\*\*/g, '').replace(/\*/g, '');
    navigator.clipboard.writeText(cleanText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `ms-copilot-welcome-${Date.now()}`,
        sender: 'NWIS_COPILOT',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text:
          `New topic started. Monitoring **OIL-ASSAM-042** at **${telemetry.depth} m** in **${telemetry.formation}**.\n\n` +
          `Risk level is **${riskAssessment.level} (${Math.round(riskAssessment.score * 100)}%)**. What would you like to investigate?`,
        suggestedActions: [
          'Why is the current well at risk?',
          'Which nearby wells are relevant?',
          'What happened at this depth before?',
          'What should the driller review?',
        ],
      },
    ]);
  };

  return (
    <div className="bg-[#0a0812] border border-[#8968bf]/[0.18] rounded-2xl flex flex-col h-[650px] shadow-2xl text-[#f0edf8] overflow-hidden">
      {/* ── Copilot Top Navigation Bar ── */}
      <div className="px-5 py-3.5 bg-[#110d1e]/90 border-b border-[#8968bf]/[0.18] flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#3b82f6]/20 via-[#8b5cf6]/20 to-[#ec4899]/20 border border-[#8968bf]/[0.3] flex items-center justify-center shadow-inner">
            <CopilotRibbonIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm text-white tracking-tight">Copilot</span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#1c1469] text-[#8968bf] border border-[#8968bf]/[0.25]">
                Oil India Subsurface RAG
              </span>
            </div>
            <p className="text-[11px] text-[#8a8299] mt-0.5">
              Integrated with eRTMAC • Active Well: <span className="text-[#cec9e1]">OIL-ASSAM-042</span> ({telemetry.depth} m)
            </p>
          </div>
        </div>

        {/* Conversation Tone & Reset Action */}
        <div className="flex items-center space-x-3">
          {/* Conversation Tone Selector */}
          <div className="hidden md:flex items-center bg-[#15112a] p-0.5 rounded-lg border border-[#8968bf]/[0.2] text-[11px]">
            {(['Precise', 'Balanced', 'Creative'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setTone(mode)}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  tone === mode
                    ? 'bg-[#551ca5] text-white shadow-sm'
                    : 'text-[#8a8299] hover:text-[#cec9e1]'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={handleResetChat}
            className="p-1.5 rounded-lg text-[#8a8299] hover:text-white hover:bg-[#15112a] border border-transparent hover:border-[#8968bf]/[0.2] transition"
            title="New Topic"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Chat Messages Scroll Area ── */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
        {/* If only welcome message, show Microsoft Copilot Prompt Starter Grid */}
        {messages.length === 1 && (
          <div className="mb-6">
            <div className="text-xs font-semibold text-[#8a8299] uppercase tracking-wider mb-3 px-1">
              Suggested Exploration Topics
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {starterCards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSend(card.query)}
                    className="text-left bg-[#110d1e]/80 hover:bg-[#15112a] border border-[#8968bf]/[0.18] hover:border-[#8968bf]/[0.45] p-3.5 rounded-xl transition-all group shadow-sm flex items-start space-x-3"
                  >
                    <div className="p-2 rounded-lg bg-[#551ca5]/15 border border-[#8968bf]/[0.25] text-[#8968bf] group-hover:text-white group-hover:bg-[#551ca5]/30 transition shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white group-hover:text-[#8968bf] transition flex items-center justify-between">
                        <span>{card.title}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#8a8299] group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <p className="text-[11px] text-[#8a8299] mt-1 leading-snug line-clamp-2">
                        {card.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Message Stream */}
        {messages.map((msg) => {
          const isUser = msg.sender === 'USER';
          return (
            <div key={msg.id} className={`flex items-start space-x-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {/* Copilot Avatar */}
              {!isUser && (
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#3b82f6]/20 via-[#8b5cf6]/20 to-[#ec4899]/20 border border-[#8968bf]/[0.3] flex items-center justify-center shrink-0 mt-0.5">
                  <CopilotRibbonIcon className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-[#551ca5] text-white rounded-tr-sm shadow-md'
                    : 'bg-[#110d1e] border border-[#8968bf]/[0.18] text-[#f0edf8] rounded-tl-sm space-y-3 shadow-sm'
                }`}
              >
                {/* Header info */}
                <div className="flex items-center justify-between text-[10px] text-[#8a8299] pb-1 border-b border-[#8968bf]/[0.1]">
                  <span className="font-medium text-[#cec9e1]">{isUser ? 'You' : 'Copilot for WellVista'}</span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Formatted Message Body without raw asterisks */}
                <FormattedMessageText content={msg.text} />

                {/* Microsoft Copilot Suggested Follow-Up Actions */}
                {!isUser && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="pt-2.5 border-t border-[#8968bf]/[0.12] space-y-1.5">
                    <div className="text-[10px] uppercase font-semibold text-[#8a8299] tracking-wider">
                      Suggested Next Questions
                    </div>
                    <div className="flex flex-wrap gap-1.5">
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
                          className="text-[11px] font-medium bg-[#15112a] hover:bg-[#1c1469] text-[#cec9e1] hover:text-white border border-[#8968bf]/[0.25] hover:border-[#8968bf]/[0.5] px-3 py-1 rounded-full transition-all flex items-center space-x-1.5 shadow-sm"
                        >
                          <Sparkles className="w-3 h-3 text-[#8968bf]" />
                          <span>{act}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message Action Footer (Copy, Feedback) */}
                {!isUser && (
                  <div className="flex items-center justify-end space-x-2 pt-1 text-[#8a8299]">
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="p-1 rounded hover:text-white hover:bg-[#15112a] transition"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button className="p-1 rounded hover:text-white hover:bg-[#15112a] transition" title="Helpful">
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1 rounded hover:text-white hover:bg-[#15112a] transition" title="Not helpful">
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* ── Realistic 1.5s Processing Indicator ── */}
        {isLoading && (
          <div className="flex items-start space-x-3.5 justify-start">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#3b82f6]/20 via-[#8b5cf6]/20 to-[#ec4899]/20 border border-[#8968bf]/[0.3] flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
              <CopilotRibbonIcon className="w-4 h-4" />
            </div>

            <div className="bg-[#110d1e] border border-[#8968bf]/[0.18] text-[#f0edf8] rounded-2xl rounded-tl-sm p-4 text-xs shadow-sm space-y-2 max-w-md">
              <div className="flex items-center space-x-2 text-[11px] text-[#8968bf] font-medium">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Analyzing WITSML telemetry & querying offset records...</span>
              </div>
              <div className="flex items-center space-x-1.5 pt-1">
                <span className="w-2 h-2 rounded-full bg-[#8968bf] animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 rounded-full bg-[#7040c8] animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 rounded-full bg-[#551ca5] animate-bounce" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Microsoft Copilot Signature Capsule Input Bar ── */}
      <div className="p-4 bg-[#110d1e]/90 border-t border-[#8968bf]/[0.18] shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="bg-[#15112a] border border-[#8968bf]/[0.25] focus-within:border-[#8968bf]/[0.6] rounded-2xl p-2 transition-all shadow-inner flex flex-col"
        >
          {/* Top text input */}
          <textarea
            value={inputQuery}
            disabled={isLoading}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={
              isLoading
                ? 'Copilot is processing your query...'
                : 'Ask anything about OIL-ASSAM-042, offset well historical events, or mud hydraulics...'
            }
            rows={2}
            className="w-full bg-transparent px-3 pt-1 text-xs text-[#f0edf8] placeholder-[#6b6480] focus:outline-none resize-none disabled:opacity-50"
          />

          {/* Bottom input toolbar */}
          <div className="flex items-center justify-between pt-2 px-2 border-t border-[#8968bf]/[0.1]">
            <div className="flex items-center space-x-2 text-xs text-[#8a8299]">
              <button
                type="button"
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg hover:bg-[#1c1469]/50 hover:text-[#cec9e1] transition text-[11px]"
              >
                <Paperclip className="w-3.5 h-3.5" />
                <span>Attach Log</span>
              </button>
              <span className="text-[10px] text-[#8a8299] hidden sm:inline">Shift + Enter for new line</span>
            </div>

            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className={`p-2 rounded-xl transition-all ${
                inputQuery.trim() && !isLoading
                  ? 'bg-gradient-to-r from-[#551ca5] to-[#7040c8] text-white shadow-md shadow-[#551ca5]/40 hover:opacity-95'
                  : 'bg-[#0a0812] text-[#8a8299] opacity-50 cursor-not-allowed'
              }`}
              title="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Legal / AI disclaimer */}
        <div className="text-[10px] text-center text-[#8a8299] mt-2">
          Copilot uses AI and WellVista Real-Time eRTMAC feeds. For operational drilling decisions, verify recommendations against standard OIL SOP.
        </div>
      </div>
    </div>
  );
};
