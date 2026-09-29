import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { RiskLevel, EventCategory } from '@/types/nwis';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case 'NORMAL':
      return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60 shadow-emerald-900/20';
    case 'ELEVATED':
      return 'text-amber-400 bg-amber-950/60 border-amber-800/60 shadow-amber-900/20';
    case 'CAUTION':
      return 'text-orange-400 bg-orange-950/60 border-orange-800/60 shadow-orange-900/20';
    case 'CRITICAL':
      return 'text-red-400 bg-red-950/60 border-red-800/60 shadow-red-900/40 animate-pulse';
  }
}

export function getRiskBadgeColor(level: RiskLevel): string {
  switch (level) {
    case 'NORMAL':
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    case 'ELEVATED':
      return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    case 'CAUTION':
      return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
    case 'CRITICAL':
      return 'bg-red-500/25 text-red-300 border-red-500/50 animate-pulse';
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
