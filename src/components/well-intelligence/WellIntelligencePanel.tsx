'use client';

import React from 'react';
import { Well, DrillingEvent } from '@/types/nwis';
import { getEventCategoryLabel } from '@/lib/utils';
import { MapPin, FileText, AlertTriangle, Layers, Clock, ExternalLink, ShieldCheck, Compass, CheckCircle2 } from 'lucide-react';

interface WellIntelligencePanelProps {
  well: Well;
  onOpenDocument?: (docId: string) => void;
  onClose?: () => void;
}

export const WellIntelligencePanel: React.FC<WellIntelligencePanelProps> = ({
  well,
  onOpenDocument,
  onClose,
}) => {
  return (
    <div className="bg-slate-950/95 border border-slate-800 rounded-xl p-4 text-slate-100 space-y-4 shadow-xl">
      {/* Header Info */}
      <div className="flex items-start justify-between pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              OFFSET WELL INTELLIGENCE
            </span>
            <span className="text-xs text-slate-400 font-mono">{well.field}</span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1 flex items-center space-x-2">
            <span>{well.name}</span>
            <span className="text-xs font-mono text-cyan-400 font-normal">({well.distance} m offset)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Drilled by {well.operator} • Rig {well.rigName} ({well.completionYear})
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-mono">RELEVANCE</div>
            <div className="text-xl font-black font-mono text-cyan-400">{well.relevanceScore}%</div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Structural & Formational Similarity Progress Grid */}
      <div className="grid grid-cols-3 gap-2.5 bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs font-mono">
        <div>
          <div className="text-[10px] text-slate-400 mb-1">FORMATION MATCH</div>
          <div className="flex items-baseline space-x-1">
            <span className="text-sm font-bold text-cyan-300">{well.formationSimilarity}%</span>
            <span className="text-[10px] text-slate-500">Kopili Shale</span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full mt-1 overflow-hidden">
            <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${well.formationSimilarity}%` }} />
          </div>
        </div>

        <div>
          <div className="text-[10px] text-slate-400 mb-1">STRUCTURAL MATCH</div>
          <div className="flex items-baseline space-x-1">
            <span className="text-sm font-bold text-amber-300">{well.structuralSimilarity}%</span>
            <span className="text-[10px] text-slate-500">Stratigraphy</span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full mt-1 overflow-hidden">
            <div className="bg-amber-400 h-full rounded-full" style={{ width: `${well.structuralSimilarity}%` }} />
          </div>
        </div>

        <div>
          <div className="text-[10px] text-slate-400 mb-1">TRAJECTORY MATCH</div>
          <div className="flex items-baseline space-x-1">
            <span className="text-sm font-bold text-purple-300">{well.trajectorySimilarity}%</span>
            <span className="text-[10px] text-slate-500">Inclination</span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full mt-1 overflow-hidden">
            <div className="bg-purple-400 h-full rounded-full" style={{ width: `${well.trajectorySimilarity}%` }} />
          </div>
        </div>
      </div>

      {/* Historical Incidents & NPT Events Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-300 tracking-wider">
          <span className="flex items-center space-x-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>HISTORICAL DRILLING EVENTS & NPT LOGS ({well.historicalEvents.length})</span>
          </span>
          <span className="text-[10px] font-mono text-slate-400">Target Interval 3,180–3,240 m</span>
        </div>

        {well.historicalEvents.length === 0 ? (
          <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
            No historical dysfunctions recorded for this well in the target interval.
          </div>
        ) : (
          well.historicalEvents.map((evt: DrillingEvent) => (
            <div
              key={evt.id}
              className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-red-500/20 text-red-300 border border-red-500/40 uppercase">
                    {evt.type}
                  </span>
                  <span className="font-mono text-slate-300 font-bold">
                    Depth: {evt.depth} m <span className="text-slate-500 text-[10px]">(TVD {evt.tvd}m)</span>
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-amber-400 font-mono text-xs font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{evt.nptHours} hrs NPT</span>
                </div>
              </div>

              <p className="text-slate-300 leading-relaxed text-[11px] font-medium">{evt.description}</p>

              <div className="p-2 rounded bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400">
                <strong className="text-cyan-300 font-mono">Resolution:</strong> {evt.resolution}
              </div>

              {evt.documentId && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400 font-mono">Formation: {evt.formation}</span>
                  <button
                    onClick={() => onOpenDocument && onOpenDocument(evt.documentId!)}
                    className="flex items-center space-x-1 text-amber-400 hover:text-amber-300 text-[11px] font-mono font-semibold hover:underline"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Report (Page {evt.documentPage})</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Historical Documents Reference List */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <div className="text-[11px] font-bold uppercase text-slate-400 flex items-center space-x-1.5">
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          <span>INDEXED HISTORICAL DRILLING REPORTS ({well.documents.length})</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {well.documents.map((doc) => (
            <button
              key={doc.id}
              onClick={() => onOpenDocument && onOpenDocument(doc.id)}
              className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-2 rounded-lg text-xs font-mono text-cyan-300 transition"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <div className="text-left">
                <div className="font-bold text-slate-200">{doc.name}</div>
                <div className="text-[10px] text-slate-400">Page {doc.page} • Depth {doc.relevantDepth}m</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
