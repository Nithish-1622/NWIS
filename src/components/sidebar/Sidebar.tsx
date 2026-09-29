'use client';

import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  Activity,
  Box,
  FileText,
  AlertTriangle,
  Bot,
  Grid,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { RiskAssessment } from '@/types/nwis';

export type NavView =
  | 'command-center'
  | 'nearby-wells'
  | 'live-simulation'
  | 'digital-twin'
  | 'historical-intelligence'
  | 'risk-alerts'
  | 'copilot'
  | 'fleet';

interface SidebarProps {
  activeView: NavView;
  onSelectView: (view: NavView) => void;
  riskAssessment: RiskAssessment;
  unacknowledgedAlertsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  riskAssessment,
  unacknowledgedAlertsCount,
}) => {
  const navItems: { id: NavView; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string | number }[] = [
    { id: 'command-center', label: 'Command Center', icon: LayoutDashboard },
    { id: 'nearby-wells', label: 'Nearby Wells', icon: MapPin, badge: '5 Wells' },
    { id: 'live-simulation', label: 'Live Simulation', icon: Activity },
    { id: 'digital-twin', label: '3D Digital Twin', icon: Box, badge: '3D' },
    { id: 'historical-intelligence', label: 'Historical Intelligence', icon: FileText, badge: '5 Docs' },
    {
      id: 'risk-alerts',
      label: 'Risk & Alerts',
      icon: AlertTriangle,
      badge: unacknowledgedAlertsCount > 0 ? unacknowledgedAlertsCount : undefined,
    },
    { id: 'copilot', label: 'NWIS AI Copilot', icon: Bot, badge: 'AI' },
    { id: 'fleet', label: 'Fleet Overview', icon: Grid, badge: '18 Rigs' },
  ];

  return (
    <aside className="w-64 bg-slate-950/95 border-r border-slate-800/80 flex flex-col justify-between p-3 select-none z-30 shrink-0">
      {/* Navigation Links */}
      <div className="space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold tracking-widest text-slate-500 uppercase flex items-center justify-between">
          <span>NAVIGATION</span>
          <span className="text-cyan-400 font-mono text-[9px]">eRTMAC v2.4</span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          const isAlertItem = item.id === 'risk-alerts' && riskAssessment.level === 'CRITICAL';

          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-950/80 to-slate-900 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-950'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? 'text-cyan-400'
                      : isAlertItem
                      ? 'text-red-400 animate-pulse'
                      : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                />
                <span className="font-semibold tracking-wide">{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded border font-bold ${
                    isAlertItem
                      ? 'bg-red-500/30 text-red-300 border-red-500/50 animate-pulse'
                      : isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Human-in-the-loop Advisory Banner */}
      <div className="mt-4 space-y-3">
        <div className="bg-gradient-to-b from-amber-950/40 to-slate-900/90 border border-amber-500/30 rounded-lg p-3 text-xs shadow-inner">
          <div className="flex items-center space-x-1.5 text-amber-400 font-bold mb-1 text-[11px] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
            <span>HUMAN-IN-THE-LOOP</span>
          </div>
          <p className="text-[10px] text-slate-300 leading-relaxed font-medium">
            NWIS operates as an <strong className="text-amber-300">advisory intelligence layer</strong>. All operational decisions & control adjustments require human driller validation.
          </p>
        </div>

        {/* Value Proposition Footer */}
        <div className="p-2.5 rounded-md bg-slate-900/60 border border-slate-800/80 text-[10px] text-slate-400 font-mono space-y-1">
          <div className="text-cyan-400 font-bold tracking-tight text-[10px] flex items-center space-x-1">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>CORE FORMULA</span>
          </div>
          <p className="text-slate-300 leading-tight">
            PAST WELLS + LIVE SENSORS + GEOLOGY = <span className="text-cyan-300 font-bold">FORESIGHT</span>
          </p>
        </div>
      </div>
    </aside>
  );
};
