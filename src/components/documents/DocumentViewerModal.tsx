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
      <div className="bg-[#0a0812] border border-[#8968bf]/[0.25]/80 rounded-xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#f0edf8]">
        {/* Modal Top Header */}
        <div className="bg-[#110d1e] border-b border-[#8968bf]/[0.2] p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm font-bold text-white">{document.name}</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#1c1469]/80 text-[#cec9e1] border border-[#8968bf]/[0.4]">
                  PAGE {document.page}
                </span>
              </div>
              <p className="text-xs text-[#8a8299] font-mono mt-0.5">
                Source: {document.sourceMetadata} • Date: {document.date}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => alert('Document download simulated in prototype.')}
              className="p-2 text-[#8a8299] hover:text-[#cec9e1] hover:bg-[#1c1469]/40 rounded-lg transition"
              title="Download PDF"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#8a8299] hover:text-white hover:bg-[#1c1469]/40 rounded-lg transition text-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* OCR Intelligence Banner */}
        <div className="bg-[#15112a] border-b border-[#8968bf]/[0.2] px-4 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-[#8968bf] font-mono font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>OCR SENSOR-TO-DOCUMENT CORRELATION ENGINE</span>
          </div>
          <span className="text-[11px] font-mono text-[#cec9e1]">
            Target Match: <strong className="text-[#8968bf]">{document.relevantDepth} m</strong> (Kopili Shale)
          </span>
        </div>

        {/* Document Body Viewport (PDF Paper Look in Dark Mode) */}
        <div className="p-6 overflow-y-auto space-y-4 font-mono text-xs leading-relaxed bg-[#0a0812]">
          <div className="p-4 rounded-xl bg-[#110d1e] border border-[#8968bf]/[0.2] text-[#cec9e1] space-y-3 shadow-inner">
            <div className="flex items-center justify-between text-[11px] text-[#8a8299] pb-2 border-b border-[#8968bf]/[0.18] font-sans">
              <span>DOCUMENT PAGE EXTRACT #{document.page}</span>
              <span>WELL: {document.wellName}</span>
            </div>

            {/* Extracted Text with Sentence Highlighter */}
            <div className="text-[#cec9e1] whitespace-pre-line font-mono leading-relaxed text-sm">
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
            <div className="p-3.5 rounded-xl bg-[#110d1e] border border-[#8968bf]/[0.2]">
              <div className="text-[10px] text-[#8a8299] uppercase font-semibold">RELEVANT DEPTH</div>
              <div className="text-sm font-bold text-[#8968bf] mt-0.5">{document.relevantDepth} m MD</div>
              <p className="text-[10px] text-[#8a8299] mt-1">Exact depth match with active well anomaly zone</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#110d1e] border border-[#8968bf]/[0.2]">
              <div className="text-[10px] text-[#8a8299] uppercase font-semibold">CLASSIFIED DYSFUNCTION</div>
              <div className="text-sm font-bold text-red-400 mt-0.5">STUCK_PIPE / PACK-OFF</div>
              <p className="text-[10px] text-[#8a8299] mt-1">Historical precedent verified by Evidence Agent</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#110d1e] border-t border-[#8968bf]/[0.2] p-3.5 flex items-center justify-between text-xs">
          <span className="text-[#8a8299] font-mono">Oil India Limited • eRTMAC Historical Archive</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#551ca5] to-[#3d2aab] hover:from-[#7040c8] hover:to-[#551ca5] text-white font-semibold transition shadow-md shadow-[#551ca5]/30"
          >
            Close Document
          </button>
        </div>
      </div>
    </div>
  );
};

