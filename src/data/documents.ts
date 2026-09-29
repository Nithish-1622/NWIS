import { DrillingDocument } from '@/types/nwis';

export const MOCK_DOCUMENTS: DrillingDocument[] = [
  {
    id: 'DOC-041-DDR',
    name: 'DDR_OIL_041_2018.pdf',
    wellId: 'OIL-041',
    wellName: 'OIL-041',
    type: 'DDR',
    date: '2018-11-14',
    page: 47,
    extractedText:
      'DAILY DRILLING REPORT #47 - RIG E-760\n' +
      'Depth interval: 3,180 m to 3,230 m (Kopili Shale)\n' +
      'At 14:30 hrs (Depth 3,212 m), driller noted torque increased progressively from 18 kN.m to 27 kN.m followed by standpipe pressure divergence (4,100 psi to 4,520 psi) and reduced ROP from 38 m/hr down to 18 m/hr. ' +
      'While attempting to pick up off bottom, string packed off completely and differential sticking occurred. Jarring operations initiated at 16:00 hrs. NPT total: 42.5 hrs.',
    relevantDepth: 3212,
    highlightText:
      'Torque increased progressively followed by standpipe pressure increase and reduced ROP. String became packed off in Kopili Shale at 3,212 m.',
    sourceMetadata: 'OIL Central Archives / Rig E-760 / Section 8.5" Hole',
  },
  {
    id: 'DOC-039-WCR',
    name: 'WCR_OIL_039.pdf',
    wellName: 'OIL-039',
    wellId: 'OIL-039',
    type: 'WCR',
    date: '2019-04-22',
    page: 112,
    extractedText:
      'WELL COMPLETION REPORT - OIL-039 (DIBRUGARH BLOCK)\n' +
      'Section 4: Drilling Dysfunction Summary\n' +
      'At depth 3,198 m in Kopili Shale, severe mud loss of 18 m3/hr was recorded, causing hydrostatic head reduction. ' +
      'Subsequent borehole instability resulted in micro-caving shale entering the annulus, leading to severe tight hole condition and pipe packing off while reaming at 3,198 m. ' +
      'LCM pill spotted. Total NPT: 28.0 hrs.',
    relevantDepth: 3198,
    highlightText:
      'Severe mud loss of 18 m3/hr followed by severe tight hole & pipe packing off while reaming at 3,198 m.',
    sourceMetadata: 'OIL Well Completion Vault / Block Assam-039',
  },
  {
    id: 'DOC-043-FISH',
    name: 'FISHING_REPORT_OIL_043.pdf',
    wellName: 'OIL-043',
    wellId: 'OIL-043',
    type: 'FISHING_REPORT',
    date: '2020-08-09',
    page: 12,
    extractedText:
      'SPECIALIZED FISHING & UNSTICKING REPORT - OIL-043\n' +
      'Incident location: 3,224 m (MD) / 3,115 m (TVD)\n' +
      'Torque spikes recorded up to 28 kN.m prior to differential sticking. Standpipe pressure rose rapidly by 380 psi over 6 minutes. ' +
      'Free point indicator located stuck point at 3,210 m in Kopili brittle shale band. Acid wash and hydraulic jar activation successful after 54 hrs NPT.',
    relevantDepth: 3224,
    highlightText:
      'Torque spikes recorded up to 28 kN.m prior to differential sticking. Free point located at 3,210 m in Kopili brittle shale.',
    sourceMetadata: 'OIL eRTMAC Incident Incident Log / Incident ID #2020-F09',
  },
  {
    id: 'DOC-028-MUD',
    name: 'MUD_LOG_OIL_028.pdf',
    wellName: 'OIL-028',
    wellId: 'OIL-028',
    type: 'MUD_LOG',
    date: '2017-03-18',
    page: 35,
    extractedText:
      'GEOLOGICAL MUD LOG LOGGING SHEET - WELL OIL-028\n' +
      'Depth: 3,205 m\n' +
      'Large angular caving shale fragments (Kopili Formation) recovered at shale shaker screens. ' +
      'Gas influx increase from 1.2% to 4.8%. Mud density increased from 1.18 SG to 1.25 SG to control sloughing shale and suppress pore pressure.',
    relevantDepth: 3205,
    highlightText:
      'Caving shale recovered at shale shaker. Increased mud weight from 1.18 to 1.25 SG to stabilize Kopili shale.',
    sourceMetadata: 'OIL Geological Services / Mud Logging Unit #4',
  },
  {
    id: 'DOC-055-DDR',
    name: 'DDR_OIL_055_2021.pdf',
    wellName: 'OIL-055',
    wellId: 'OIL-055',
    type: 'DDR',
    date: '2021-02-03',
    page: 84,
    extractedText:
      'DAILY DRILLING REPORT #84 - OIL-055\n' +
      'Depth: 3,190 m\n' +
      'Flow line restriction observed due to heavy cuttings loading in annulus. High erratic torque warning triggered at 3,192 m (24.5 kN.m). ' +
      'Circulated bottoms up twice and performed wiper trip prior to resuming drilling.',
    relevantDepth: 3190,
    highlightText:
      'Flow line restriction observed due to cuttings build up. High torque warning triggered at 3,192 m.',
    sourceMetadata: 'OIL Operational Archives / Rig OIL-3',
  },
];

export function getDocumentById(id: string): DrillingDocument | undefined {
  return MOCK_DOCUMENTS.find((d) => d.id === id);
}
