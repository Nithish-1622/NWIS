'use client';

import React, { useState } from 'react';
import { useDrillingSimulation } from '@/hooks/useDrillingSimulation';
import { Header } from '@/components/header/Header';
import { Sidebar, NavView } from '@/components/sidebar/Sidebar';
import { CommandCenter } from '@/components/command-center/CommandCenter';
import { NearbyWellsView } from '@/components/nearby-wells/NearbyWellsView';
import { TelemetryView } from '@/components/telemetry/TelemetryView';
import { DigitalTwin3D } from '@/components/digital-twin/DigitalTwin3D';
import { HistoricalIntelligenceView } from '@/components/historical-intelligence/HistoricalIntelligenceView';
import { RiskEvidenceView } from '@/components/risk/RiskEvidenceView';
import { CopilotView } from '@/components/copilot/CopilotView';
import { FleetView } from '@/components/fleet/FleetView';
import { DocumentViewerModal } from '@/components/documents/DocumentViewerModal';
import { getDocumentById } from '@/data/documents';
import { DecisionSupportCard } from '@/components/decision-support/DecisionSupportCard';
import { AgentPipelineDrawer } from '@/components/agents/AgentPipelineDrawer';
import { getAgentsStatus } from '@/data/agents';

export default function NWISApp() {
  const [activeView, setActiveView] = useState<NavView>('command-center');
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);

  const simulation = useDrillingSimulation();
  const {
    telemetry,
    history,
    riskAssessment,
    isPlaying,
    speed,
    start,
    pause,
    reset,
    fastForward,
    setSpeed,
    activeWell,
    offsetWells,
    allOffsetWells,
    selectedOffsetWell,
    setSelectedOffsetWell,
    radiusFilter,
    setRadiusFilter,
  } = simulation;

  const currentDocument = activeDocumentId ? getDocumentById(activeDocumentId) || null : null;
  const agents = getAgentsStatus(telemetry, riskAssessment);

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ background: 'var(--nwis-bg)', color: 'var(--nwis-text-primary)' }}>
      {/* Top Header */}
      <Header
        telemetry={telemetry}
        riskAssessment={riskAssessment}
        isPlaying={isPlaying}
        speed={speed}
        onStart={start}
        onPause={pause}
        onReset={reset}
        onFastForward={fastForward}
        onSetSpeed={setSpeed}
        activeView={activeView}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeView={activeView}
          onSelectView={setActiveView}
          riskAssessment={riskAssessment}
          unacknowledgedAlertsCount={riskAssessment.level === 'CRITICAL' ? 1 : 0}
        />

        {/* Center Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-5 space-y-4 nwis-mesh-bg">
          {activeView === 'command-center' && (
            <CommandCenter
              telemetry={telemetry}
              history={history}
              riskAssessment={riskAssessment}
              activeWell={activeWell}
              offsetWells={offsetWells}
              allOffsetWells={allOffsetWells}
              selectedOffsetWell={selectedOffsetWell}
              onSelectOffsetWell={setSelectedOffsetWell}
              radiusFilter={radiusFilter}
              onSelectRadiusFilter={setRadiusFilter}
              onOpenDocument={(docId) => setActiveDocumentId(docId)}
              onNavigateView={(view) => setActiveView(view)}
              isPlaying={isPlaying}
              onStart={start}
              onPause={pause}
              onReset={reset}
              onFastForward={fastForward}
            />
          )}

          {activeView === 'nearby-wells' && (
            <NearbyWellsView
              offsetWells={offsetWells}
              allOffsetWells={allOffsetWells}
              selectedOffsetWell={selectedOffsetWell}
              onSelectOffsetWell={setSelectedOffsetWell}
              radiusFilter={radiusFilter}
              onSelectRadiusFilter={setRadiusFilter}
              onOpenDocument={(docId) => setActiveDocumentId(docId)}
            />
          )}

          {activeView === 'live-simulation' && (
            <div className="space-y-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white uppercase tracking-wide">
                    LIVE DRILLING TELEMETRY SIMULATION & HAZARD MONITOR
                  </h2>
                  <p className="text-xs text-slate-400">
                    Step {simulation.currentStepIndex + 1} of {simulation.totalSteps} • Depth {telemetry.depth} m ({telemetry.formation})
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {isPlaying ? (
                    <button
                      onClick={pause}
                      className="px-4 py-1.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold"
                    >
                      PAUSE SIMULATION
                    </button>
                  ) : (
                    <button
                      onClick={start}
                      className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold"
                    >
                      START SIMULATION
                    </button>
                  )}
                  <button
                    onClick={fastForward}
                    className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold font-mono"
                  >
                    HAZARD PRESET (STEP 52)
                  </button>
                </div>
              </div>
              <TelemetryView telemetry={telemetry} history={history} />
              <AgentPipelineDrawer agents={agents} />
            </div>
          )}

          {activeView === 'digital-twin' && (
            <DigitalTwin3D telemetry={telemetry} riskAssessment={riskAssessment} />
          )}

          {activeView === 'historical-intelligence' && (
            <HistoricalIntelligenceView onOpenDocument={(docId) => setActiveDocumentId(docId)} />
          )}

          {activeView === 'risk-alerts' && (
            <div className="space-y-4">
              <RiskEvidenceView
                riskAssessment={riskAssessment}
                onOpenDocument={(docId) => setActiveDocumentId(docId)}
                onOpenOffsetWell={(wellId) => {
                  const match = offsetWells.find((w) => w.id === wellId);
                  if (match) setSelectedOffsetWell(match);
                  setActiveView('nearby-wells');
                }}
              />
              <DecisionSupportCard
                riskAssessment={riskAssessment}
                onViewEvidence={() => setActiveView('risk-alerts')}
                onOpenOffsetHistory={() => setActiveView('historical-intelligence')}
              />
            </div>
          )}

          {activeView === 'copilot' && (
            <CopilotView
              telemetry={telemetry}
              riskAssessment={riskAssessment}
              offsetWells={offsetWells}
              onOpenDocument={(docId) => setActiveDocumentId(docId)}
              onOpenOffsetWell={(wellId) => {
                const match = offsetWells.find((w) => w.id === wellId);
                if (match) setSelectedOffsetWell(match);
                setActiveView('nearby-wells');
              }}
            />
          )}

          {activeView === 'fleet' && (
            <FleetView
              onSelectRig={(wellName) => {
                setActiveView('command-center');
              }}
            />
          )}
        </main>
      </div>

      {/* Document Viewer Modal */}
      {currentDocument && (
        <DocumentViewerModal document={currentDocument} onClose={() => setActiveDocumentId(null)} />
      )}
    </div>
  );
}
