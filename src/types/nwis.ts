export type RiskLevel = 'NORMAL' | 'ELEVATED' | 'CAUTION' | 'CRITICAL';

export type EventCategory =
  | 'STUCK_PIPE'
  | 'MUD_LOSS'
  | 'WELL_CONTROL'
  | 'BOREHOLE_INSTABILITY'
  | 'BIT_BHA_DYSFUNCTION'
  | 'TRIPPING_PROBLEM'
  | 'CEMENTING_PROBLEM'
  | 'DIRECTIONAL_DYSFUNCTION';

export type AgentState = 'IDLE' | 'PROCESSING' | 'COMPLETE' | 'WARNING';

export interface Formation {
  id: string;
  name: string;
  topDepth: number; // in meters
  bottomDepth: number; // in meters
  lithology: string;
  description: string;
  typicalRisks: EventCategory[];
  color: string;
}

export interface DrillingDocument {
  id: string;
  name: string;
  wellId: string;
  wellName: string;
  type: 'DDR' | 'WCR' | 'FISHING_REPORT' | 'MUD_LOG' | 'GEOLOGICAL';
  date: string;
  page: number;
  extractedText: string;
  relevantDepth: number;
  highlightText: string;
  sourceMetadata: string;
}

export interface DrillingEvent {
  id: string;
  wellId: string;
  wellName: string;
  type: EventCategory;
  depth: number;
  tvd: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  nptHours: number;
  formation: string;
  documentId?: string;
  documentPage?: number;
  resolution: string;
}

export interface WellTrajectoryPoint {
  md: number; // Measured depth
  tvd: number; // True vertical depth
  northing: number; // offset X
  easting: number; // offset Y
  inclination: number;
  azimuth: number;
}

export interface Well {
  id: string;
  name: string;
  operator: string;
  field: string;
  rigName: string;
  latitude: number;
  longitude: number;
  totalDepth: number; // m
  currentFormation: string;
  distance: number; // meters from active well
  relevanceScore: number; // percentage 0 - 100
  formationSimilarity: number; // 0 - 100
  structuralSimilarity: number; // 0 - 100
  trajectorySimilarity: number; // 0 - 100
  trajectory: WellTrajectoryPoint[];
  historicalEvents: DrillingEvent[];
  documents: DrillingDocument[];
  status: 'ACTIVE_RIG' | 'HISTORICAL_PRODUCER' | 'HISTORICAL_ABANDONED' | 'DRILLING_SUSPENDED';
  completionYear: number;
}

export interface TelemetryPoint {
  step: number; // simulation step 0..N
  timestamp: string;
  depth: number; // MD in meters
  tvd: number;
  bitDepth: number;
  rop: number; // m/hr
  wob: number; // tonnes (or kN)
  torque: number; // kN·m
  spp: number; // psi (Standpipe Pressure)
  rpm: number; // rev/min
  hookLoad: number; // tonnes
  flowIn: number; // L/min
  flowOut: number; // L/min
  mudWeight: number; // SG
  ecd: number; // Equivalent Circulating Density SG
  pitVolume: number; // m³
  gas: number; // % or units
  formation: string;
  rigState: 'ROTARY_DRILLING' | 'SLIDING' | 'CIRCULATING' | 'REAMING' | 'TRIPPING';
  torqueVariance: number;
  sppDivergence: number;
}

export interface EvidenceContribution {
  category: 'Physics' | 'Historical Offset' | 'Machine Learning' | 'Geology' | 'Rig State' | 'Data Quality';
  weight: number; // percentage, e.g. 30 for physics
  score: number; // 0-100 hazard contribution
  description: string;
  status: 'OK' | 'ELEVATED' | 'CRITICAL';
  details: string[];
}

export interface RiskAssessment {
  hazard: EventCategory;
  score: number; // 0.00 to 1.00
  level: RiskLevel;
  confidence: number; // 0-100%
  horizonMinutes: number; // e.g., 18 mins onset
  expectedDepthMin: number;
  expectedDepthMax: number;
  evidence: EvidenceContribution[];
  recommendation: {
    title: string;
    summary: string;
    workflowSteps: string[];
    urgency: 'MONITOR' | 'ACTION_REQUIRED' | 'IMMEDIATE_HALT';
  };
}

export interface AIAgentInfo {
  id: string;
  name: string;
  role: string;
  state: AgentState;
  lastMessage: string;
  metricsProcessed: string;
  timestamp: string;
}

export interface CopilotMessage {
  id: string;
  sender: 'USER' | 'NWIS_COPILOT';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
  evidenceReference?: {
    wellId?: string;
    depth?: number;
    documentId?: string;
  };
}

export interface FleetRig {
  id: string;
  rigName: string;
  wellName: string;
  field: string;
  operator: string;
  currentDepth: number;
  targetDepth: number;
  formation: string;
  status: RiskLevel;
  lastUpdate: string;
  rop: number;
  spp: number;
  torque: number;
}
