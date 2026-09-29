'use client';

import React from 'react';
import { DrillingDocument } from '@/types/nwis';
import { FileText, X, CheckCircle2, Download, Printer, Layers, Search, ShieldCheck } from 'lucide-react';

interface DocumentViewerModalProps {
  document: DrillingDocument | null;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({ document, onClose }) => {
  if (!document) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-700/80 rounded-xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-100">
        {/* Modal Top Header */}
        <div className="bg-slate-900 border-b border-slate-800 p-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm font-bold text-white">{document.name}</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  PAGE {document.page}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Source: {document.sourceMetadata} • Date: {document.date}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => alert('Document download simulated in prototype.')}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition"
              title="Download PDF"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition text-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* OCR Intelligence Banner */}
        <div className="bg-cyan-950/40 border-b border-cyan-800/60 px-4 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-cyan-300 font-mono">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>OCR SENSOR-TO-DOCUMENT CORRELATION ENGINE</span>
          </div>
          <span className="text-[11px] font-mono text-slate-300">
            Target Match: <strong className="text-cyan-300">{document.relevantDepth} m</strong> (Kopili Shale)
          </span>
        </div>

        {/* Document Body Viewport (PDF Paper Look in Dark Mode) */}
        <div className="p-6 overflow-y-auto space-y-4 font-mono text-xs leading-relaxed bg-slate-900/60">
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 space-y-3 shadow-inner">
            <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-slate-800 font-sans">
              <span>DOCUMENT PAGE EXTRACT #{document.page}</span>
              <span>WELL: {document.wellName}</span>
            </div>

            {/* Extracted Text with Sentence Highlighter */}
            <div className="text-slate-200 whitespace-pre-line font-mono leading-relaxed text-sm">
              {document.extractedText}
            </div>

            {/* AI OCR Sentence Highlight Box */}
            <div className="mt-4 p-3 rounded-lg bg-amber-500/15 border-l-4 border-amber-400 text-amber-200 space-y-1">
              <div className="flex items-center space-x-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-300">
                <Search className="w-3.5 h-3.5" />
                <span>MATCHED ANOMALY SIGNATURE SENTENCE:</span>
              </div>
              <p className="text-xs font-semibold italic">"{document.highlightText}"</p>
            </div>
          </div>

          {/* Context Correlation Card */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">RELEVANT DEPTH</div>
              <div className="text-sm font-bold text-cyan-300 mt-0.5">{document.relevantDepth} m MD</div>
              <p className="text-[10px] text-slate-400 mt-1">Exact depth match with active well anomaly zone</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">CLASSIFIED DYSFUNCTION</div>
              <div className="text-sm font-bold text-red-400 mt-0.5">STUCK_PIPE / PACK-OFF</div>
              <p className="text-[10px] text-slate-400 mt-1">Historical precedent verified by Evidence Agent</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-900 border-t border-slate-800 p-3 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono">Oil India Limited • eRTMAC Historical Archive</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition"
          >
            Close Document
          </button>
        </div>
      </div>
    </div>
  );
};
