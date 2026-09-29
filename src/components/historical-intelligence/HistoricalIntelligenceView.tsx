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
    <div className="space-y-4 text-slate-100">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              HISTORICAL DRILLING KNOWLEDGE & DOCUMENT INTELLIGENCE
            </h2>
            <p className="text-xs text-slate-400">
              OIL Central Well Vault • OCR Extracted Records • Cross-Well Dysfunction Corpus
            </p>
          </div>
        </div>

        <span className="text-xs font-mono px-3 py-1 rounded bg-amber-950 text-amber-300 border border-amber-800">
          5 Indexed PDFs • {allEvents.length} Historical Incidents
        </span>
      </div>

      {/* Indexed Documents Cards */}
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase text-slate-300 tracking-wider flex items-center space-x-1.5">
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>INDEXED HISTORICAL DRILLING REPORTS & OCR RECOVERY</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {MOCK_DOCUMENTS.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onOpenDocument(doc.id)}
              className="bg-slate-950/90 border border-slate-800 hover:border-cyan-500/60 rounded-xl p-3.5 space-y-2 cursor-pointer transition shadow-md group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-cyan-300 group-hover:text-cyan-200">{doc.name}</span>
                <span className="text-[10px] font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-400">
                  PAGE {doc.page}
                </span>
              </div>

              <div className="text-[11px] text-slate-400 font-mono">
                Well: <strong className="text-slate-200">{doc.wellName}</strong> • Target Depth: {doc.relevantDepth} m
              </div>

              <p className="text-xs text-slate-300 italic bg-slate-900/60 p-2 rounded border border-slate-800/80 line-clamp-2">
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
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase text-slate-200">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>HISTORICAL INCIDENT TAXONOMY CORPUS ({filteredEvents.length})</span>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs w-64">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search historical events..."
              className="bg-transparent border-none text-slate-200 placeholder-slate-500 focus:outline-none w-full text-xs"
            />
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap gap-1.5 text-xs font-mono">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded transition border ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500/30 text-cyan-300 border-cyan-500/50 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
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
              className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-cyan-300 font-mono">{evt.wellName}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-red-500/20 text-red-300 border border-red-500/40 uppercase">
                    {evt.type}
                  </span>
                  <span className="text-slate-400 font-mono">
                    Depth: {evt.depth} m ({evt.formation})
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-amber-400 font-mono font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{evt.nptHours} hrs NPT</span>
                </div>
              </div>

              <p className="text-slate-300 leading-relaxed font-medium">{evt.description}</p>

              <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[11px]">
                <span className="text-slate-400 font-mono">Resolution: {evt.resolution}</span>
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
