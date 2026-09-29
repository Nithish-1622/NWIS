import { CopilotMessage, TelemetryPoint, RiskAssessment, Well } from '@/types/nwis';

export function getCopilotResponse(
  userQuery: string,
  telemetry: TelemetryPoint,
  risk: RiskAssessment,
  offsetWells: Well[]
): CopilotMessage {
  const q = userQuery.toLowerCase();
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (q.includes('why') || q.includes('risk') || q.includes('happening')) {
    return {
      id: `cop-resp-${Date.now()}`,
      sender: 'NWIS_COPILOT',
      timestamp: timeStr,
      text:
        `Based on current live telemetry at ${telemetry.depth} m in ${telemetry.formation}, WellVista has calculated a **${Math.round(risk.score * 100)}% risk score (${risk.level})** for a **STUCK_PIPE / Pack-Off Precursor**.\n\n` +
        `**Key Drivers:**\n` +
        `• **Physics (30% weight):** Standpipe pressure has diverged (+${telemetry.sppDivergence} psi up to ${telemetry.spp} psi) and torque variance is elevated (${telemetry.torqueVariance} kN·m).\n` +
        `• **Geology (15% weight):** Currently penetrating **Kopili Shale**, known for tectonic brittleness and sloughing shale.\n` +
        `• **Historical Precedents (25% weight):** 3 offset wells (OIL-041, OIL-039, OIL-043) encountered pipe sticking at this depth interval (3,198m – 3,224m).`,
      suggestedActions: ['View Evidence Matrix', 'Review Advisory Workflow', 'Open Document DDR_OIL_041'],
    };
  }

  if (q.includes('nearby') || q.includes('offset') || q.includes('wells')) {
    const topWell = offsetWells[0];
    return {
      id: `cop-resp-${Date.now()}`,
      sender: 'NWIS_COPILOT',
      timestamp: timeStr,
      text:
        `WellVista is actively tracking **${offsetWells.length} nearby offset wells** within the Dibrugarh trend:\n\n` +
        `1. **OIL-041** (780 m NW, 96% relevance): STUCK_PIPE incident at 3,212 m (42.5 hrs NPT).\n` +
        `2. **OIL-039** (1,350 m W, 91% relevance): MUD_LOSS & pipe packing off at 3,198 m.\n` +
        `3. **OIL-043** (1,850 m E, 88% relevance): Differential stuck pipe at 3,224 m (54 hrs NPT).\n\n` +
        `All three wells share a **92%+ structural and formational match** with active well OIL-ASSAM-042.`,
      suggestedActions: ['Open Nearby Wells Map', 'Inspect OIL-041 History'],
      evidenceReference: { wellId: topWell?.id },
    };
  }

  if (q.includes('depth') || q.includes('before') || q.includes('past')) {
    return {
      id: `cop-resp-${Date.now()}`,
      sender: 'NWIS_COPILOT',
      timestamp: timeStr,
      text:
        `At the target depth of **${telemetry.depth} m**, historical records show:\n\n` +
        `• **OIL-041 (2018):** Severe pack-off at 3,212 m. Driller noted SPP spike from 4,100 psi to 4,520 psi and torque spike to 27 kN·m before total string sticking. (Document: *DDR_OIL_041_2018.pdf*, Page 47).\n` +
        `• **OIL-039 (2019):** Partial mud losses leading to caving shale at 3,198 m. (Document: *WCR_OIL_039.pdf*, Page 112).\n` +
        `• **OIL-043 (2020):** Differential sticking at 3,224 m requiring 54 hrs fishing. (Document: *FISHING_REPORT_OIL_043.pdf*, Page 12).`,
      suggestedActions: ['View Document DDR_OIL_041', 'Show 3D Trajectory Cross-Section'],
      evidenceReference: { documentId: 'DOC-041-DDR', depth: 3212 },
    };
  }

  if (q.includes('formation') || q.includes('geology') || q.includes('lithology')) {
    return {
      id: `cop-resp-${Date.now()}`,
      sender: 'NWIS_COPILOT',
      timestamp: timeStr,
      text:
        `The active well is currently at **${telemetry.depth} m MD** in the **${telemetry.formation}**.\n\n` +
        `• **Lithology:** Brittle tectonically stressed marine shale with micro-cleavages.\n` +
        `• **Formational Bounds:** 3,180 m to 3,550 m depth.\n` +
        `• **Geomechanical Risk:** High sloughing propensity when overbalance is low or flow restrictions accumulate cuttings in annulus. Next formation: Sylhet Limestone at 3,550 m.`,
      suggestedActions: ['View Formation Profile', 'Check Mud Weight ECD'],
    };
  }

  if (q.includes('review') || q.includes('driller') || q.includes('action') || q.includes('do')) {
    return {
      id: `cop-resp-${Date.now()}`,
      sender: 'NWIS_COPILOT',
      timestamp: timeStr,
      text:
        `**WellVista Advisory Workflow (Human-in-the-Loop):**\n\n` +
        `1. **Pick up string 2 meters off bottom** immediately.\n` +
        `2. **Reduce WOB** and restrict ROP to 18–20 m/hr.\n` +
        `3. **Circulate bottoms-up** at high flow rate (${telemetry.flowIn} L/min) to clear annular cuttings loading.\n` +
        `4. Monitor Standpipe Pressure (Current: ${telemetry.spp} psi) for stabilization.\n` +
        `5. Verify returning flow rate (${telemetry.flowOut} L/min vs ${telemetry.flowIn} L/min in).\n\n` +
        `*Note: WellVista is an advisory system. Driller operational discretion is required.*`,
      suggestedActions: ['Acknowledge Advisory', 'Open Rig Telemetry'],
    };
  }

  // Default response
  return {
    id: `cop-resp-${Date.now()}`,
    sender: 'NWIS_COPILOT',
    timestamp: timeStr,
    text:
      `WellVista Copilot status: Monitoring active well **OIL-ASSAM-042** at depth **${telemetry.depth} m** (${telemetry.formation}).\n\n` +
      `Current risk level: **${risk.level} (${Math.round(risk.score * 100)}%)**. ` +
      `Live sensors indicate Torque ${telemetry.torque} kN·m, SPP ${telemetry.spp} psi, ROP ${telemetry.rop} m/hr. How can I assist your review?`,
    suggestedActions: ['Why is the current well at risk?', 'Which nearby wells are relevant?', 'What happened at this depth before?'],
  };
}
