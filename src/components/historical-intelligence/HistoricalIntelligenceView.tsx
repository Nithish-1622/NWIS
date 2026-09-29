'use client';

import React, { useState } from 'react';
import { MOCK_DOCUMENTS } from '@/data/documents';
import { OFFSET_WELLS } from '@/data/wells';
import { DrillingEvent, EventCategory } from '@/types/nwis';
import { FileText, Search, AlertTriangle, Layers, Clock, ExternalLink, ShieldCheck, Filter } from 'lucide-react';
import { getEventCategoryLabel } from '@/lib/utils';

interface HistoricalIntelligenceViewProps {
  onOpenDocument: (docId: string) => void;
}

export const HistoricalIntelligenceView: React.FC<HistoricalIntelligenceViewProps> = ({ onOpenDocument }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const allEvents: DrillingEvent[] = OFFSET_WELLS.flatMap((w) => w.historicalEvents);

  const filteredEvents = allEvents.filter((evt) => {
    const matchesCat = selectedCategory === 'ALL' || evt.type === selectedCategory;
    const matchesSearch =
      evt.wellName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.formation.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const categories: { id: string; label: string }[] = [
    { id: 'ALL', label: 'ALL EVENTS' },
    { id: 'STUCK_PIPE', label: 'STUCK_PIPE' },
    { id: 'MUD_LOSS', label: 'MUD_LOSS' },
    { id: 'BOREHOLE_INSTABILITY', label: 'BOREHOLE_INSTABILITY' },
    { id: 'BIT_BHA_DYSFUNCTION', label: 'BIT_BHA_DYSFUNCTION' },
    { id: 'TRIPPING_PROBLEM', label: 'TRIPPING_PROBLEM' },
    { id: 'DIRECTIONAL_DYSFUNCTION', label: 'DIRECTIONAL_DYSFUNCTION' },
  ];

  return (
    <div className="space-y-4 text-[#f0edf8]">
      {/* Header Banner */}
      <div className="bg-[#110d1e]/90 border border-[#8968bf]/[0.2] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              HISTORICAL DRILLING KNOWLEDGE & DOCUMENT INTELLIGENCE
            </h2>
            <p className="text-xs text-[#8a8299]">
              OIL Central Well Vault • OCR Extracted Records • Cross-Well Dysfunction Corpus
            </p>
          </div>
        </div>

        <span className="text-xs font-mono px-3 py-1 rounded-lg bg-amber-950/80 text-amber-300 border border-amber-800/60 shadow-sm">
          5 Indexed PDFs • {allEvents.length} Historical Incidents
        </span>
      </div>

      {/* Indexed Documents Cards */}
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase text-[#cec9e1] tracking-wider flex items-center space-x-1.5">
          <FileText className="w-4 h-4 text-[#8968bf]" />
          <span>INDEXED HISTORICAL DRILLING REPORTS & OCR RECOVERY</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {MOCK_DOCUMENTS.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onOpenDocument(doc.id)}
              className="bg-[#110d1e]/90 border border-[#8968bf]/[0.2] hover:border-[#8968bf]/[0.55] rounded-xl p-4 space-y-2.5 cursor-pointer transition-all shadow-md hover:shadow-lg group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-[#cec9e1] group-hover:text-[#8968bf] transition-colors">{doc.name}</span>
                <span className="text-[10px] font-mono bg-[#15112a] px-2 py-0.5 rounded border border-[#8968bf]/[0.2] text-[#8a8299]">
                  PAGE {doc.page}
                </span>
              </div>

              <div className="text-[11px] text-[#8a8299] font-mono">
                Well: <strong className="text-[#cec9e1]">{doc.wellName}</strong> • Target Depth: {doc.relevantDepth} m
              </div>

              <p className="text-xs text-[#cec9e1] italic bg-[#0a0812]/80 p-2.5 rounded-lg border border-[#8968bf]/[0.15] line-clamp-2 leading-relaxed">
                "{doc.highlightText}"
              </p>

              <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-amber-400">
                <span>{doc.type} Report ({doc.date})</span>
                <span className="flex items-center space-x-1 group-hover:underline">
                  <span>Open Report</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Incident Corpus Filters & Search */}
      <div className="bg-[#110d1e]/90 border border-[#8968bf]/[0.2] rounded-xl p-4 space-y-3.5 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase text-[#cec9e1]">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>HISTORICAL INCIDENT TAXONOMY CORPUS ({filteredEvents.length})</span>
          </div>

          <div className="flex items-center space-x-2 bg-[#0a0812] border border-[#8968bf]/[0.2] rounded-lg px-3 py-1.5 text-xs w-64 shadow-inner">
            <Search className="w-3.5 h-3.5 text-[#8a8299]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search historical events..."
              className="bg-transparent border-none text-[#cec9e1] placeholder-[#5a5582] focus:outline-none w-full text-xs"
            />
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap gap-1.5 text-xs font-mono">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-md transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-[#551ca5]/40 text-[#f0edf8] border-[#8968bf]/[0.55] font-bold shadow-sm'
                  : 'bg-[#0a0812] text-[#8a8299] border-[#8968bf]/[0.18] hover:text-[#cec9e1] hover:bg-[#1c1469]/30'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Incidents List */}
        <div className="space-y-2 pt-2">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="p-3 rounded-lg bg-[#0a0812]/80 border border-[#8968bf]/[0.18] space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-[#a98fda] font-mono">{evt.wellName}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-red-500/20 text-red-300 border border-red-500/40 uppercase">
                    {evt.type}
                  </span>
                  <span className="text-[#8a8299] font-mono">
                    Depth: {evt.depth} m ({evt.formation})
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-amber-400 font-mono font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{evt.nptHours} hrs NPT</span>
                </div>
              </div>

              <p className="text-[#cec9e1] leading-relaxed font-medium">{evt.description}</p>

              <div className="flex items-center justify-between pt-1 border-t border-[#110d1e] text-[11px]">
                <span className="text-[#8a8299] font-mono">Resolution: {evt.resolution}</span>
                {evt.documentId && (
                  <button
                    onClick={() => onOpenDocument(evt.documentId!)}
                    className="text-amber-400 hover:underline font-mono font-semibold flex items-center space-x-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Document (P.{evt.documentPage})</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


