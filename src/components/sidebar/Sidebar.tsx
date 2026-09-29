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
    <aside
      className="w-64 flex flex-col justify-between p-3 select-none z-30 shrink-0"
      style={{
        background: 'rgba(10,8,18,0.96)',
        borderRight: '1px solid rgba(137,104,191,0.15)',
      }}
    >
      {/* Navigation Links */}
      <div className="space-y-1">
        <div
          className="px-3 py-2 text-[10px] font-bold tracking-widest uppercase flex items-center justify-between"
          style={{ color: 'rgba(90,85,130,0.7)' }}
        >
          <span>NAVIGATION</span>
          <span className="font-mono text-[9px]" style={{ color: '#8968bf' }}>eRTMAC v2.4</span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          const isAlertItem = item.id === 'risk-alerts' && riskAssessment.level === 'CRITICAL';

          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 group"
              style={{
                background: isActive
                  ? 'linear-gradient(90deg, rgba(85,28,165,0.25), rgba(28,20,105,0.2))'
                  : 'transparent',
                border: isActive
                  ? '1px solid rgba(137,104,191,0.35)'
                  : '1px solid transparent',
                color: isActive ? '#cec9e1' : 'rgba(137,104,191,0.6)',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(85,28,165,0.1)';
                  (e.currentTarget as HTMLElement).style.color = '#cec9e1';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = 'rgba(137,104,191,0.6)';
                }
              }}
            >
              <div className="flex items-center space-x-2.5">
                <span
                  style={{
                    color: isActive
                      ? '#8968bf'
                      : isAlertItem
                      ? '#ef4444'
                      : 'inherit',
                  }}
                >
                  <Icon className="w-4 h-4" />
                </span>
                <span className="font-semibold tracking-wide">{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold"
                  style={{
                    background: isAlertItem
                      ? 'rgba(239,68,68,0.2)'
                      : isActive
                      ? 'rgba(137,104,191,0.2)'
                      : 'rgba(28,20,105,0.4)',
                    color: isAlertItem
                      ? '#f87171'
                      : isActive
                      ? '#8968bf'
                      : 'rgba(90,85,130,0.8)',
                    border: isAlertItem
                      ? '1px solid rgba(239,68,68,0.3)'
                      : '1px solid rgba(137,104,191,0.2)',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom panels */}
      <div className="mt-4 space-y-3">
        {/* Human-in-the-loop Advisory Banner */}
        <div
          className="rounded-lg p-3 text-xs"
          style={{
            background: 'linear-gradient(180deg, rgba(85,28,165,0.15), rgba(10,8,18,0.8))',
            border: '1px solid rgba(137,104,191,0.25)',
          }}
        >
          <div
            className="flex items-center space-x-1.5 font-bold mb-1 text-[11px] uppercase tracking-wider"
            style={{ color: '#8968bf' }}
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>HUMAN-IN-THE-LOOP</span>
          </div>
          <p className="text-[10px] leading-relaxed font-medium" style={{ color: '#cec9e1' }}>
            NWIS operates as an <strong style={{ color: '#8968bf' }}>advisory intelligence layer</strong>. All operational decisions require human driller validation.
          </p>
        </div>

        {/* Value Proposition */}
        <div
          className="p-2.5 rounded-md text-[10px] font-mono space-y-1"
          style={{
            background: 'rgba(28,20,105,0.2)',
            border: '1px solid rgba(137,104,191,0.15)',
            color: 'rgba(206,201,225,0.5)',
          }}
        >
          <div className="font-bold tracking-tight text-[10px] flex items-center space-x-1" style={{ color: '#8968bf' }}>
            <Zap className="w-3 h-3" />
            <span>CORE FORMULA</span>
          </div>
          <p style={{ color: '#cec9e1' }}>
            PAST WELLS + LIVE SENSORS + GEOLOGY = <span className="font-bold" style={{ color: '#8968bf' }}>FORESIGHT</span>
          </p>
        </div>
      </div>
    </aside>
  );
};
