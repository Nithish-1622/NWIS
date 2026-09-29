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
    <div className="space-y-4 text-[#f0edf8]">
      {/* Parameter Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        <div className="bg-[#110d1e]/90 border border-[#8968bf]/[0.2] hover:border-[#8968bf]/[0.4] p-3 rounded-xl transition-all shadow-md group">
          <div className="flex items-center justify-between text-[10px] text-[#8a8299] font-semibold tracking-wider">
            <span>TORQUE</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#8968bf]" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-mono text-xl font-extrabold text-[#f0edf8]">{telemetry.torque}</span>
            <span className="text-[10px] text-[#5a5582] font-mono">kN·m</span>
          </div>
          <div className="mt-1.5 text-[9px] text-[#8a8299] font-mono flex items-center justify-between pt-1 border-t border-[#8968bf]/[0.1]">
            <span>Var: {telemetry.torqueVariance}</span>
            {telemetry.torqueVariance > 2.0 && <span className="text-red-400 font-bold">HIGH</span>}
          </div>
        </div>

        <div className="bg-[#110d1e]/90 border border-[#8968bf]/[0.2] hover:border-[#8968bf]/[0.4] p-3 rounded-xl transition-all shadow-md group">
          <div className="flex items-center justify-between text-[10px] text-[#8a8299] font-semibold tracking-wider">
            <span>SPP (PRESS)</span>
            <Gauge className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-mono text-xl font-extrabold text-amber-300">{telemetry.spp}</span>
            <span className="text-[10px] text-[#5a5582] font-mono">psi</span>
          </div>
          <div className="mt-1.5 text-[9px] text-[#8a8299] font-mono flex items-center justify-between pt-1 border-t border-[#8968bf]/[0.1]">
            <span>Div: +{telemetry.sppDivergence}</span>
            {telemetry.sppDivergence > 100 && <span className="text-orange-400 font-bold">ALERT</span>}
          </div>
        </div>

        <div className="bg-[#110d1e]/90 border border-[#8968bf]/[0.2] hover:border-[#8968bf]/[0.4] p-3 rounded-xl transition-all shadow-md group">
          <div className="flex items-center justify-between text-[10px] text-[#8a8299] font-semibold tracking-wider">
            <span>ROP</span>
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-mono text-xl font-extrabold text-emerald-300">{telemetry.rop}</span>
            <span className="text-[10px] text-[#5a5582] font-mono">m/hr</span>
          </div>
          <div className="mt-1.5 text-[9px] text-[#8a8299] font-mono flex items-center justify-between pt-1 border-t border-[#8968bf]/[0.1]">
            <span>Target: 38</span>
            {telemetry.rop < 25 && <span className="text-amber-400 font-bold">DECAY</span>}
          </div>
        </div>

        <div className="bg-[#110d1e]/90 border border-[#8968bf]/[0.2] hover:border-[#8968bf]/[0.4] p-3 rounded-xl transition-all shadow-md group">
          <div className="flex items-center justify-between text-[10px] text-[#8a8299] font-semibold tracking-wider">
            <span>WOB</span>
            <span className="text-[10px] font-mono text-[#5a5582]">TONNES</span>
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-mono text-xl font-extrabold text-[#cec9e1]">{telemetry.wob}</span>
            <span className="text-[10px] text-[#5a5582] font-mono">t</span>
          </div>
          <div className="mt-1.5 text-[9px] text-[#8a8299] font-mono pt-1 border-t border-[#8968bf]/[0.1]">RPM: {telemetry.rpm}</div>
        </div>

        <div className="bg-[#110d1e]/90 border border-[#8968bf]/[0.2] hover:border-[#8968bf]/[0.4] p-3 rounded-xl transition-all shadow-md group">
          <div className="flex items-center justify-between text-[10px] text-[#8a8299] font-semibold tracking-wider">
            <span>ECD</span>
            <Droplets className="w-3.5 h-3.5 text-[#8968bf]" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-mono text-xl font-extrabold text-[#a98fda]">{telemetry.ecd}</span>
            <span className="text-[10px] text-[#5a5582] font-mono">SG</span>
          </div>
          <div className="mt-1.5 text-[9px] text-[#8a8299] font-mono pt-1 border-t border-[#8968bf]/[0.1]">MW: {telemetry.mudWeight} SG</div>
        </div>

        <div className="bg-[#110d1e]/90 border border-[#8968bf]/[0.2] hover:border-[#8968bf]/[0.4] p-3 rounded-xl transition-all shadow-md group">
          <div className="flex items-center justify-between text-[10px] text-[#8a8299] font-semibold tracking-wider">
            <span>FLOW IN/OUT</span>
            <Droplets className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-mono text-lg font-extrabold text-blue-300">
              {telemetry.flowIn}/{telemetry.flowOut}
            </span>
          </div>
          <div className="mt-1.5 text-[9px] text-[#8a8299] font-mono flex items-center justify-between pt-1 border-t border-[#8968bf]/[0.1]">
            <span>Diff: {telemetry.flowIn - telemetry.flowOut}</span>
            {telemetry.flowIn - telemetry.flowOut > 100 && <span className="text-red-400 font-bold">PACK</span>}
          </div>
        </div>

        <div className="bg-[#110d1e]/90 border border-[#8968bf]/[0.2] hover:border-[#8968bf]/[0.4] p-3 rounded-xl transition-all shadow-md group">
          <div className="flex items-center justify-between text-[10px] text-[#8a8299] font-semibold tracking-wider">
            <span>PIT VOLUME</span>
            <span className="text-[10px] font-mono text-[#5a5582]">m³</span>
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-mono text-xl font-extrabold text-teal-300">{telemetry.pitVolume}</span>
            <span className="text-[10px] text-[#5a5582] font-mono">m³</span>
          </div>
          <div className="mt-1.5 text-[9px] text-[#8a8299] font-mono pt-1 border-t border-[#8968bf]/[0.1]">Active Pit 1</div>
        </div>

        <div className="bg-[#110d1e]/90 border border-[#8968bf]/[0.2] hover:border-[#8968bf]/[0.4] p-3 rounded-xl transition-all shadow-md group">
          <div className="flex items-center justify-between text-[10px] text-[#8a8299] font-semibold tracking-wider">
            <span>GAS</span>
            <Flame className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-mono text-xl font-extrabold text-rose-400">{telemetry.gas}%</span>
            <span className="text-[10px] text-[#5a5582] font-mono">units</span>
          </div>
          <div className="mt-1.5 text-[9px] text-[#8a8299] font-mono pt-1 border-t border-[#8968bf]/[0.1]">Background Gas</div>
        </div>
      </div>

      {/* Synchronized Recharts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {/* Chart 1: Torque & SPP Divergence */}
        <div className="bg-[#110d1e]/90 border border-[#8968bf]/[0.2] rounded-xl p-3.5 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-[#f0edf8] uppercase tracking-wider flex items-center space-x-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#8968bf]" />
              <span>Torque & Standpipe Pressure Divergence</span>
            </h4>
            <span className="text-[10px] font-mono text-[#8968bf] bg-[#1c1469]/50 px-2 py-0.5 rounded border border-[#8968bf]/[0.3]">
              Live Trend
            </span>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(137, 104, 191, 0.12)" />
                <XAxis dataKey="time" stroke="#8a8299" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" stroke="#8968bf" tick={{ fontSize: 10 }} domain={[15, 32]} />
                <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" tick={{ fontSize: 10 }} domain={[4000, 4700]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0a0812', borderColor: 'rgba(137,104,191,0.4)', borderRadius: '8px', fontSize: '11px', color: '#f0edf8' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#cec9e1' }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="torque"
                  name="Torque (kN·m)"
                  stroke="#8968bf"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="spp"
                  name="SPP (psi)"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: ROP Degradation & WOB */}
        <div className="bg-[#110d1e]/90 border border-[#8968bf]/[0.2] rounded-xl p-3.5 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-[#f0edf8] uppercase tracking-wider flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Rate of Penetration (ROP) vs Weight on Bit (WOB)</span>
            </h4>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
              Decay Indicator
            </span>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(137, 104, 191, 0.12)" />
                <XAxis dataKey="time" stroke="#8a8299" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" stroke="#10b981" tick={{ fontSize: 10 }} domain={[10, 45]} />
                <YAxis yAxisId="right" orientation="right" stroke="#c084fc" tick={{ fontSize: 10 }} domain={[10, 20]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0a0812', borderColor: 'rgba(137,104,191,0.4)', borderRadius: '8px', fontSize: '11px', color: '#f0edf8' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#cec9e1' }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="rop"
                  name="ROP (m/hr)"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="wob"
                  name="WOB (tonnes)"
                  stroke="#c084fc"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Flow In vs Flow Out Annular Packing */}
        <div className="bg-[#110d1e]/90 border border-[#8968bf]/[0.2] rounded-xl p-3.5 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-[#f0edf8] uppercase tracking-wider flex items-center space-x-1.5">
              <Droplets className="w-3.5 h-3.5 text-blue-400" />
              <span>Flow In vs Flow Out (Annular Cuttings Restriction)</span>
            </h4>
            <span className="text-[10px] font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-500/40">
              Hydraulic Balance
            </span>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(137, 104, 191, 0.12)" />
                <XAxis dataKey="time" stroke="#8a8299" tick={{ fontSize: 10 }} />
                <YAxis stroke="#8a8299" tick={{ fontSize: 10 }} domain={[2000, 2500]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0a0812', borderColor: 'rgba(137,104,191,0.4)', borderRadius: '8px', fontSize: '11px', color: '#f0edf8' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#cec9e1' }} />
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
        <div className="bg-[#110d1e]/90 border border-[#8968bf]/[0.2] rounded-xl p-3.5 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-[#f0edf8] uppercase tracking-wider flex items-center space-x-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>ECD & Formation Gas Influx Trend</span>
            </h4>
            <span className="text-[10px] font-mono text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/40">
              Mud Weight Stability
            </span>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(137, 104, 191, 0.12)" />
                <XAxis dataKey="time" stroke="#8a8299" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" stroke="#8968bf" tick={{ fontSize: 10 }} domain={[1.15, 1.3]} />
                <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" tick={{ fontSize: 10 }} domain={[0, 6]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0a0812', borderColor: 'rgba(137,104,191,0.4)', borderRadius: '8px', fontSize: '11px', color: '#f0edf8' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#cec9e1' }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="ecd"
                  name="ECD (SG)"
                  stroke="#8968bf"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="gas"
                  name="Gas (%)"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
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

