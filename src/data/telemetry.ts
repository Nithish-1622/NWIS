import { TelemetryPoint } from '@/types/nwis';

export const SIMULATION_TELEMETRY_STEPS: TelemetryPoint[] = Array.from({ length: 65 }, (_, i) => {
  const step = i;
  const progress = step / 64; // 0.0 to 1.0

  // Depth progression from 3,145 m up to 3,222 m
  const depth = parseFloat((3145 + step * 1.2).toFixed(1));
  const tvd = parseFloat((depth * 0.992).toFixed(1));
  const bitDepth = depth;

  // Formation boundary at depth 3,180 m (step ~ 29)
  const formation = depth < 3180 ? 'Barail Coal-Shale' : 'Kopili Shale';

  // Base parameters
  let torque = 18.0;
  let spp = 4100;
  let rop = 38.0;
  let wob = 12.0;
  let rpm = 120;
  let hookLoad = 145;
  let flowIn = 2400;
  let flowOut = 2400;
  let mudWeight = 1.18;
  let ecd = 1.20;
  let pitVolume = 45.0;
  let gas = 1.1;
  let torqueVariance = 0.4;
  let sppDivergence = 10;

  if (step <= 15) {
    // Stage 1: NORMAL
    torque = 18.0 + Math.sin(step * 0.5) * 0.5;
    spp = 4100 + Math.cos(step * 0.3) * 15;
    rop = 38.0 - (step / 15) * 2;
    wob = 12.0 + Math.sin(step * 0.8) * 0.3;
    torqueVariance = 0.4;
    sppDivergence = 12;
  } else if (step <= 30) {
    // Stage 2: ELEVATED AWARENESS (Formation Transition around step 29)
    const factor = (step - 15) / 15;
    torque = 18.5 + factor * 3.0 + Math.sin(step * 0.7) * 1.2;
    spp = 4115 + factor * 75 + Math.cos(step * 0.5) * 25;
    rop = 36.0 - factor * 7.0;
    wob = 12.2 + factor * 1.5;
    rpm = 118 - factor * 4;
    ecd = 1.20 + factor * 0.02;
    flowOut = 2400 - factor * 25;
    gas = 1.1 + factor * 0.5;
    torqueVariance = 0.5 + factor * 1.5;
    sppDivergence = 20 + factor * 60;
  } else if (step <= 45) {
    // Stage 3: CAUTIONARY PRECURSOR
    const factor = (step - 30) / 15;
    torque = 21.5 + factor * 3.5 + Math.sin(step * 1.2) * 2.2;
    spp = 4190 + factor * 160 + Math.sin(step * 0.9) * 40;
    rop = 29.0 - factor * 8.0;
    wob = 13.7 + factor * 2.1;
    rpm = 114 - factor * 8;
    ecd = 1.22 + factor * 0.03;
    flowOut = 2375 - factor * 65;
    pitVolume = 45.0 + factor * 0.6;
    gas = 1.6 + factor * 1.2;
    torqueVariance = 2.0 + factor * 2.8;
    sppDivergence = 80 + factor * 140;
  } else {
    // Stage 4: CRITICAL HAZARD (PACK-OFF PRECURSOR DETECTED)
    const factor = Math.min((step - 45) / 19, 1.0);
    torque = 25.0 + factor * 4.8 + Math.sin(step * 1.8) * 3.5;
    spp = 4350 + factor * 230 + Math.cos(step * 1.4) * 60;
    rop = 21.0 - factor * 9.0;
    wob = 15.8 + factor * 2.2;
    rpm = 106 - factor * 16;
    hookLoad = 145 + factor * 18; // Overpull tendency
    ecd = 1.25 + factor * 0.04;
    flowOut = 2310 - factor * 130; // 2180 L/min vs 2400 in! Annular packing
    pitVolume = 45.6 + factor * 1.4;
    gas = 2.8 + factor * 1.6;
    torqueVariance = 4.8 + factor * 3.2;
    sppDivergence = 220 + factor * 210;
  }

  // Format timestamp string
  const baseTime = new Date('2026-09-29T14:00:00Z');
  const stepTime = new Date(baseTime.getTime() + step * 30000); // 30 seconds per step
  const timeStr = stepTime.toISOString().substring(11, 19);

  return {
    step,
    timestamp: timeStr,
    depth: parseFloat(depth.toFixed(1)),
    tvd: parseFloat(tvd.toFixed(1)),
    bitDepth: parseFloat(bitDepth.toFixed(1)),
    rop: parseFloat(rop.toFixed(1)),
    wob: parseFloat(wob.toFixed(1)),
    torque: parseFloat(torque.toFixed(1)),
    spp: Math.round(spp),
    rpm: Math.round(rpm),
    hookLoad: parseFloat(hookLoad.toFixed(1)),
    flowIn: Math.round(flowIn),
    flowOut: Math.round(flowOut),
    mudWeight: parseFloat(mudWeight.toFixed(2)),
    ecd: parseFloat(ecd.toFixed(2)),
    pitVolume: parseFloat(pitVolume.toFixed(1)),
    gas: parseFloat(gas.toFixed(1)),
    formation,
    rigState: step > 55 ? 'CIRCULATING' : 'ROTARY_DRILLING',
    torqueVariance: parseFloat(torqueVariance.toFixed(2)),
    sppDivergence: Math.round(sppDivergence),
  };
});
