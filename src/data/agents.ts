import { AIAgentInfo, TelemetryPoint, RiskAssessment } from '@/types/nwis';

export function getAgentsStatus(telemetry: TelemetryPoint, risk: RiskAssessment): AIAgentInfo[] {
  const isHighRisk = risk.level === 'CRITICAL' || risk.level === 'CAUTION';
  const isElevated = risk.level === 'ELEVATED';

  return [
    {
      id: 'agent-1',
      name: 'Data Ingestion & Quality Agent',
      role: 'WITS/WITSML Telemetry Stream Validation',
      state: 'COMPLETE',
      lastMessage: `Validated 14 sensor channels @ 1 Hz (Depth: ${telemetry.depth} m). Stream health 100%.`,
      metricsProcessed: '14 Channels / Clean',
      timestamp: telemetry.timestamp,
    },
    {
      id: 'agent-2',
      name: 'Historical Offset Intelligence Agent',
      role: 'Cross-Well Geospatial & Depth Pattern Correlation',
      state: isHighRisk || isElevated ? 'COMPLETE' : 'PROCESSING',
      lastMessage: `Indexed 5 offset wells. Found 3 critical historical precedents at depth ${telemetry.depth}m in ${telemetry.formation}.`,
      metricsProcessed: '3 Offset Matches (OIL-041, 039, 043)',
      timestamp: telemetry.timestamp,
    },
    {
      id: 'agent-3',
      name: 'First-Principles Physics Agent',
      role: 'Hydraulic & Mechanical Parameter Divergence Engine',
      state: telemetry.sppDivergence > 50 || telemetry.torqueVariance > 1.5 ? 'WARNING' : 'COMPLETE',
      lastMessage: `SPP Divergence: +${telemetry.sppDivergence} psi, Torque Variance: ${telemetry.torqueVariance} kN.m. Annular packing detected.`,
      metricsProcessed: `SPP +${telemetry.sppDivergence}psi / Tq Var ${telemetry.torqueVariance}`,
      timestamp: telemetry.timestamp,
    },
    {
      id: 'agent-4',
      name: 'Geomechanical Risk Agent',
      role: 'Lithology & Subsurface Stress Anomaly Classifier',
      state: telemetry.formation === 'Kopili Shale' ? 'WARNING' : 'COMPLETE',
      lastMessage: `Current formation ${telemetry.formation}. Micro-fractured shale cleavage stress active.`,
      metricsProcessed: 'High Structural Stress Zone',
      timestamp: telemetry.timestamp,
    },
    {
      id: 'agent-5',
      name: 'Evidence Fusion Agent',
      role: 'Multi-Factor Evidence Weighting & Risk Matrix Consensus',
      state: isHighRisk ? 'WARNING' : isElevated ? 'PROCESSING' : 'COMPLETE',
      lastMessage: `Evidence consensus reached: ${Math.round(risk.score * 100)}% overall pack-off risk score (Confidence: ${risk.confidence}%).`,
      metricsProcessed: `Consensus Score ${Math.round(risk.score * 100)}%`,
      timestamp: telemetry.timestamp,
    },
    {
      id: 'agent-6',
      name: 'Decision-Support Agent',
      role: 'Advisory Workflow & Human-in-the-Loop Recommendation Engine',
      state: isHighRisk ? 'WARNING' : 'COMPLETE',
      lastMessage: isHighRisk
        ? 'Generated 6-step driller advisory workflow. Recommended picking up off bottom and circulating.'
        : 'Normal operations monitored. Standard parameters maintained.',
      metricsProcessed: 'Operational Advisory Active',
      timestamp: telemetry.timestamp,
    },
  ];
}


