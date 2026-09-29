'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { TelemetryPoint } from '@/types/nwis';
import { Activity, Gauge, TrendingUp, AlertTriangle, Droplets, Flame } from 'lucide-react';

interface TelemetryViewProps {
  telemetry: TelemetryPoint;
  history: TelemetryPoint[];
}

export const TelemetryView: React.FC<TelemetryViewProps> = ({ telemetry, history }) => {
  // Format history for charts (take last 30 steps for crisp visibility)
  const chartData = history.slice(-30).map((pt) => ({
    time: pt.timestamp.substring(3, 8), // mm:ss
    depth: pt.depth,
    torque: pt.torque,
    spp: pt.spp,
    rop: pt.rop,
    wob: pt.wob,
    ecd: pt.ecd,
    flowIn: pt.flowIn,
    flowOut: pt.flowOut,
    pitVolume: pt.pitVolume,
    gas: pt.gas,
    torqueVariance: pt.torqueVariance,
    sppDivergence: pt.sppDivergence,
  }));

  return (
    <div className="space-y-4 text-slate-100">
      {/* Parameter Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>TORQUE</span>
            <TrendingUp className="w-3 h-3 text-cyan-400" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-mono text-lg font-bold text-cyan-300">{telemetry.torque}</span>
            <span className="text-[10px] text-slate-500 font-mono">kN·m</span>
          </div>
          <div className="mt-1 text-[9px] text-slate-400 font-mono flex items-center justify-between">
            <span>Var: {telemetry.torqueVariance}</span>
            {telemetry.torqueVariance > 2.0 && <span className="text-red-400 font-bold">HIGH</span>}
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>SPP (PRESS)</span>
            <Gauge className="w-3 h-3 text-amber-400" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-mono text-lg font-bold text-amber-300">{telemetry.spp}</span>
            <span className="text-[10px] text-slate-500 font-mono">psi</span>
          </div>
          <div className="mt-1 text-[9px] text-slate-400 font-mono flex items-center justify-between">
            <span>Div: +{telemetry.sppDivergence}</span>
            {telemetry.sppDivergence > 100 && <span className="text-orange-400 font-bold">ALERT</span>}
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>ROP</span>
            <Activity className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-mono text-lg font-bold text-emerald-300">{telemetry.rop}</span>
            <span className="text-[10px] text-slate-500 font-mono">m/hr</span>
          </div>
          <div className="mt-1 text-[9px] text-slate-400 font-mono flex items-center justify-between">
            <span>Target: 38</span>
            {telemetry.rop < 25 && <span className="text-amber-400 font-bold">DECAY</span>}
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>WOB</span>
            <span className="text-[10px] font-mono text-slate-500">TONNES</span>
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-mono text-lg font-bold text-purple-300">{telemetry.wob}</span>
            <span className="text-[10px] text-slate-500 font-mono">t</span>
          </div>
          <div className="mt-1 text-[9px] text-slate-400 font-mono">RPM: {telemetry.rpm}</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>ECD</span>
            <Droplets className="w-3 h-3 text-sky-400" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-mono text-lg font-bold text-sky-300">{telemetry.ecd}</span>
            <span className="text-[10px] text-slate-500 font-mono">SG</span>
          </div>
          <div className="mt-1 text-[9px] text-slate-400 font-mono">MW: {telemetry.mudWeight} SG</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>FLOW IN/OUT</span>
            <Droplets className="w-3 h-3 text-blue-400" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-mono text-base font-bold text-blue-300">
              {telemetry.flowIn}/{telemetry.flowOut}
            </span>
          </div>
          <div className="mt-1 text-[9px] text-slate-400 font-mono flex items-center justify-between">
            <span>Diff: {telemetry.flowIn - telemetry.flowOut}</span>
            {telemetry.flowIn - telemetry.flowOut > 100 && <span className="text-red-400 font-bold">PACK</span>}
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>PIT VOLUME</span>
            <span className="text-[10px] font-mono text-slate-500">m³</span>
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-mono text-lg font-bold text-teal-300">{telemetry.pitVolume}</span>
            <span className="text-[10px] text-slate-500 font-mono">m³</span>
          </div>
          <div className="mt-1 text-[9px] text-slate-400 font-mono">Active Pit 1</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>GAS</span>
            <Flame className="w-3 h-3 text-red-400" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-mono text-lg font-bold text-rose-400">{telemetry.gas}%</span>
            <span className="text-[10px] text-slate-500 font-mono">units</span>
          </div>
          <div className="mt-1 text-[9px] text-slate-400 font-mono">Background Gas</div>
        </div>
      </div>

      {/* Synchronized Recharts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Chart 1: Torque & SPP Divergence */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center space-x-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>Torque & Standpipe Pressure Divergence</span>
            </h4>
            <span className="text-[10px] font-mono text-cyan-400">Live Trend</span>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" stroke="#38bdf8" tick={{ fontSize: 10 }} domain={[15, 32]} />
                <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" tick={{ fontSize: 10 }} domain={[4000, 4700]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="torque"
                  name="Torque (kN·m)"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="spp"
                  name="SPP (psi)"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: ROP Degradation & WOB */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Rate of Penetration (ROP) vs Weight on Bit (WOB)</span>
            </h4>
            <span className="text-[10px] font-mono text-emerald-400">Decay Indicator</span>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" stroke="#10b981" tick={{ fontSize: 10 }} domain={[10, 45]} />
                <YAxis yAxisId="right" orientation="right" stroke="#c084fc" tick={{ fontSize: 10 }} domain={[10, 20]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="rop"
                  name="ROP (m/hr)"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="wob"
                  name="WOB (tonnes)"
                  stroke="#c084fc"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Flow In vs Flow Out Annular Packing */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center space-x-1.5">
              <Droplets className="w-3.5 h-3.5 text-blue-400" />
              <span>Flow In vs Flow Out (Annular Cuttings Restriction)</span>
            </h4>
            <span className="text-[10px] font-mono text-blue-400">Hydraulic Balance</span>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[2000, 2500]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area
                  type="monotone"
                  dataKey="flowIn"
                  name="Flow In (L/min)"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="flowOut"
                  name="Flow Out (L/min)"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: ECD & Gas Influx */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center space-x-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>ECD & Formation Gas Influx Trend</span>
            </h4>
            <span className="text-[10px] font-mono text-rose-400">Mud Weight Stability</span>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" stroke="#38bdf8" tick={{ fontSize: 10 }} domain={[1.15, 1.3]} />
                <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" tick={{ fontSize: 10 }} domain={[0, 6]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="ecd"
                  name="ECD (SG)"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="gas"
                  name="Gas (%)"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
