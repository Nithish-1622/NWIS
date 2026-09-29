import { Formation } from '@/types/nwis';

export const FORMATIONS: Formation[] = [
  {
    id: 'GIRUJAN',
    name: 'Girujan Clay',
    topDepth: 0,
    bottomDepth: 1200,
    lithology: 'Mottled Claystone & Siltstone',
    description: 'Upper tertiary clay sequence. Prone to surface washouts and bit balling if mud weight is insufficient.',
    typicalRisks: ['BOREHOLE_INSTABILITY'],
    color: '#38bdf8',
  },
  {
    id: 'TIPAM',
    name: 'Tipam Sandstone',
    topDepth: 1200,
    bottomDepth: 2400,
    lithology: 'Medium to Coarse Sandstone with Interbedded Shales',
    description: 'High porosity reservoir sands. Permeable sections with potential differential sticking risks during high overbalance.',
    typicalRisks: ['MUD_LOSS', 'STUCK_PIPE'],
    color: '#eab308',
  },
  {
    id: 'BARAIL',
    name: 'Barail Coal-Shale',
    topDepth: 2400,
    bottomDepth: 3180,
    lithology: 'Alternating Arenaceous Sands, Carbonaceous Shales & Coal Seams',
    description: 'Complex interbedded sequence. Carbonaceous shale cleavage can induce micro-fracturing and localized torque fluctuations.',
    typicalRisks: ['BOREHOLE_INSTABILITY', 'BIT_BHA_DYSFUNCTION'],
    color: '#a855f7',
  },
  {
    id: 'KOPILI',
    name: 'Kopili Shale',
    topDepth: 3180,
    bottomDepth: 3550,
    lithology: 'Brittle Tectonically Stressed Marine Shale',
    description: 'High-risk shale unit. Notorious in Upper Assam basin for severe sloughing shale, hole pack-offs, and mechanical pipe sticking.',
    typicalRisks: ['STUCK_PIPE', 'BOREHOLE_INSTABILITY', 'MUD_LOSS'],
    color: '#ef4444',
  },
  {
    id: 'SYLHET',
    name: 'Sylhet Limestone',
    topDepth: 3550,
    bottomDepth: 4200,
    lithology: 'Hard Dense Nummulitic Limestone with Chert',
    description: 'Deep carbonate target. High compressive strength requiring optimized bit selection to prevent extreme vibration.',
    typicalRisks: ['BIT_BHA_DYSFUNCTION', 'MUD_LOSS'],
    color: '#10b981',
  },
];

export function getFormationAtDepth(depth: number): Formation {
  const match = FORMATIONS.find((f) => depth >= f.topDepth && depth < f.bottomDepth);
  return match || FORMATIONS[FORMATIONS.length - 1];
}
