import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { RiskLevel, EventCategory } from '@/types/nwis';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case 'NORMAL':
      return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40';
    case 'ELEVATED':
      return 'text-amber-400 bg-amber-950/40 border-amber-700/40';
    case 'CAUTION':
      return 'text-orange-400 bg-orange-950/40 border-orange-700/40';
    case 'CRITICAL':
      return 'text-red-400 bg-red-950/50 border-red-700/50 animate-critical';
  }
}

export function getRiskBadgeColor(level: RiskLevel): string {
  switch (level) {
    case 'NORMAL':
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-600/30';
    case 'ELEVATED':
      return 'bg-amber-500/15 text-amber-300 border-amber-600/30';
    case 'CAUTION':
      return 'bg-orange-500/15 text-orange-300 border-orange-600/30';
    case 'CRITICAL':
      return 'bg-red-500/20 text-red-300 border-red-600/40 animate-critical';
  }
}

export function getEventCategoryLabel(cat: EventCategory): string {
  switch (cat) {
    case 'STUCK_PIPE':
      return 'Stuck Pipe / Pack-Off';
    case 'MUD_LOSS':
      return 'Mud Loss / Circulation Loss';
    case 'WELL_CONTROL':
      return 'Well Control / Kick';
    case 'BOREHOLE_INSTABILITY':
      return 'Borehole Instability';
    case 'BIT_BHA_DYSFUNCTION':
      return 'Bit / BHA Dysfunction';
    case 'TRIPPING_PROBLEM':
      return 'Tripping Problem / Tight Hole';
    case 'CEMENTING_PROBLEM':
      return 'Cementing Problem';
    case 'DIRECTIONAL_DYSFUNCTION':
      return 'Directional Dysfunction';
  }
}
