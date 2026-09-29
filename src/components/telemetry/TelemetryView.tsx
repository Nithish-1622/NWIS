'use client';

import React, { useState, useMemo } from 'react';
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
  ReferenceLine,
} from 'recharts';
import { TelemetryPoint } from '@/types/nwis';
import { Activity, Gauge, TrendingUp, Droplets, Flame, BarChart3, LineChart as LineChartIcon } from 'lucide-react';

interface TelemetryViewProps {
  telemetry: TelemetryPoint;
  history: TelemetryPoint[];
}

export const TelemetryView: React.FC<TelemetryViewProps> = ({ telemetry, history }) => {
  const [viewMode, setViewMode] = useState<'LOG_TRACKS' | 'TIME_SERIES'>('LOG_TRACKS');
  const [timeWindow, setTimeWindow] = useState<number>(30);

  // Format history for charts
  const chartData = useMemo(() => {
    return history.slice(-timeWindow).map((pt) => ({
      time: pt.timestamp.substring(3, 8),
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
  }, [history, timeWindow]);

  return (
    <div className="space-y-3.5 text-[#f0edf8]">
      {/* Telemetry Stream Status & View Mode Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#110d1e]/80 border border-[#8968bf]/[0.18] rounded-xl px-3.5 py-2 text-xs backdrop-blur-sm shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white tracking-wide">WITSML Stream 042</span>
          </div>
          <span className="text-[#8a8299] font-mono text-[11px] hidden sm:inline">
            Rate: 10 Hz • Packet Delay: 120ms • Quality: 99.8%
          </span>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          {/* Time Window Selector */}
          <div className="flex items-center rounded-lg bg-[#0a0812] border border-[#8968bf]/[0.2] p-0.5">
            {[15, 30, 60].map((w) => (
              <button
                key={w}
                onClick={() => setTimeWindow(w)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                  timeWindow === w
                    ? 'bg-[#551ca5]/50 text-white'
                    : 'text-[#8a8299] hover:text-[#cec9e1]'
                }`}
              >
                {w} pts
              </button>
            ))}
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center rounded-lg bg-[#0a0812] border border-[#8968bf]/[0.2] p-0.5">
            <button
              onClick={() => setViewMode('LOG_TRACKS')}
              className={`px-2.5 py-1 rounded-md flex items-center space-x-1.5 transition-all text-[11px] font-semibold ${
                viewMode === 'LOG_TRACKS'
                  ? 'bg-[#551ca5]/50 text-white border border-[#8968bf]/[0.5] shadow-sm'
                  : 'text-[#8a8299] hover:text-[#cec9e1]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-[#8968bf]" />
              <span>Multi-Track Log</span>
            </button>
            <button
              onClick={() => setViewMode('TIME_SERIES')}
              className={`px-2.5 py-1 rounded-md flex items-center space-x-1.5 transition-all text-[11px] font-semibold ${
                viewMode === 'TIME_SERIES'
                  ? 'bg-[#551ca5]/50 text-white border border-[#8968bf]/[0.5] shadow-sm'
                  : 'text-[#8a8299] hover:text-[#cec9e1]'
              }`}
            >
              <LineChartIcon className="w-3.5 h-3.5 text-[#8968bf]" />
              <span>Time-Series Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Parameter KPI Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        <div className="bg-[#110d1e]/90 border border-[#8968bf]/[0.2] p-2.5 rounded-xl shadow-sm">
          <div className="text-[10px] text-[#8a8299] font-medium tracking-wider flex items-center justify-between">
            <span>TORQUE</span>
            <TrendingUp className="w-3 h-3 text-[#8968bf]" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-mono text-lg font-bold text-[#f0edf8]">{telemetry.torque}</span>
            <span className="text-[10px] text-[#5a5582] font-mono">kN·m</span>
          </div>
          <div className="mt-1 text-[9px] text-[#8a8299] font-mono flex items-center justify-between pt-1 border-t border-[#8968bf]/[0.1]">
            <span>Var: {telemetry.torqueVariance}</span>
            {telemetry.torqueVariance > 2.0 && <span className="text-red-400 font-bold">HIGH</span>}
          </div>
        </div>

        <div className="bg-[#110d1e]/90 border border-[#8968bf]/[0.2] p-2.5 rounded-xl shadow-sm">
          <div className="text-[10px] text-[#8a8299] font-medium tracking-wider flex items-center justify-between">
            <span>SPP</span>
            <Gauge className="w-3 h-3 text-amber-400" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-mono text-lg font-bold text-amber-300">{telemetry.spp}</span>
            <span className="text-[10px] text-[#5a5582] font-mono">psi</span>
          </div>
          <div className="mt-1 text-[9px] text-[#8a8299] font-mono flex items-center justify-between pt-1 border-t border-[#8968bf]/[0.1]">
            <span>Div: +{telemetry.sppDivergence}</span>
            {telemetry.sppDivergence > 100 && <span className="text-orange-400 font-bold">ALERT</span>}
          </div>
        </div>

        <div className="bg-[#110d1e]/90 border border-[#8968bf]/[0.2] p-2.5 rounded-xl shadow-sm">
          <div className="text-[10px] text-[#8a8299] font-medium tracking-wider flex items-center justify-between">
            <span>ROP</span>
            <Activity className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-mono text-lg font-bold text-emerald-300">{telemetry.rop}</span>
            <span className="text-[10px] text-[#5a5582] font-mono">m/hr</span>
          </div>
          <div className="mt-1 text-[9px] text-[#8a8299] font-mono flex items-center justify-between pt-1 border-t border-[#8968bf]/[0.1]">
            <span>Target: 38</span>
            {telemetry.rop < 25 && <span className="text-amber-400 font-bold">DECAY</span>}
          </div>
        </div>

        <div className="bg-[#110d1e]/90 border border-[#8968bf]/[0.2] p-2.5 rounded-xl shadow-sm">
          <div className="text-[10px] text-[#8a8299] font-medium tracking-wider">
            <span>WOB / RPM</span>
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-mono text-lg font-bold text-[#cec9e1]">{telemetry.wob}</span>
            <span className="text-[10px] text-[#5a5582] font-mono">{telemetry.rpm} rpm</span>
          </div>
          <div className="mt-1 text-[9px] text-[#8a8299] font-mono pt-1 border-t border-[#8968bf]/[0.1]">Bit Load: Tonnes</div>
        </div>

        <div className="bg-[#110d1e]/90 border border-[#8968bf]/[0.2] p-2.5 rounded-xl shadow-sm">
          <div className="text-[10px] text-[#8a8299] font-medium tracking-wider flex items-center justify-between">
            <span>ECD</span>
            <Droplets className="w-3 h-3 text-[#8968bf]" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-mono text-lg font-bold text-[#8968bf]">{telemetry.ecd}</span>
            <span className="text-[10px] text-[#5a5582] font-mono">SG</span>
          </div>
          <div className="mt-1 text-[9px] text-[#8a8299] font-mono pt-1 border-t border-[#8968bf]/[0.1]">MW: {telemetry.mudWeight} SG</div>
        </div>

        <div className="bg-[#110d1e]/90 border border-[#8968bf]/[0.2] p-2.5 rounded-xl shadow-sm">
          <div className="text-[10px] text-[#8a8299] font-medium tracking-wider flex items-center justify-between">
            <span>FLOW IN/OUT</span>
            <Droplets className="w-3 h-3 text-blue-400" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-mono text-base font-bold text-blue-300">
              {telemetry.flowIn}/{telemetry.flowOut}
            </span>
          </div>
          <div className="mt-1 text-[9px] text-[#8a8299] font-mono flex items-center justify-between pt-1 border-t border-[#8968bf]/[0.1]">
            <span>Diff: {telemetry.flowIn - telemetry.flowOut}</span>
            {telemetry.flowIn - telemetry.flowOut > 100 && <span className="text-red-400 font-bold">PACK</span>}
          </div>
        </div>

        <div className="bg-[#110d1e]/90 border border-[#8968bf]/[0.2] p-2.5 rounded-xl shadow-sm">
          <div className="text-[10px] text-[#8a8299] font-medium tracking-wider">
            <span>PIT VOLUME</span>
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-mono text-lg font-bold text-teal-300">{telemetry.pitVolume}</span>
            <span className="text-[10px] text-[#5a5582] font-mono">m³</span>
          </div>
          <div className="mt-1 text-[9px] text-[#8a8299] font-mono pt-1 border-t border-[#8968bf]/[0.1]">Active Pit Tank 1</div>
        </div>

        <div className="bg-[#110d1e]/90 border border-[#8968bf]/[0.2] p-2.5 rounded-xl shadow-sm">
          <div className="text-[10px] text-[#8a8299] font-medium tracking-wider flex items-center justify-between">
            <span>GAS</span>
            <Flame className="w-3 h-3 text-red-400" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-mono text-lg font-bold text-rose-400">{telemetry.gas}%</span>
            <span className="text-[10px] text-[#5a5582] font-mono">units</span>
          </div>
          <div className="mt-1 text-[9px] text-[#8a8299] font-mono pt-1 border-t border-[#8968bf]/[0.1]">Background Gas</div>
        </div>
      </div>

      {/* VIEW MODE 1: Industry-Standard Multi-Track Well Log Plot */}
      {viewMode === 'LOG_TRACKS' ? (
        <div className="bg-[#110d1e]/95 border border-[#8968bf]/[0.22] rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#8968bf]/[0.15]">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Synchronized 4-Track Well Log Monitor
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1c1469]/80 text-[#8968bf] border border-[#8968bf]/[0.35]">
                Depth-Indexed Track Layout
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#8a8299]">
              Formation: <strong className="text-red-400">{telemetry.formation}</strong> (Overpressure Risk Zone)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Track 1: Mechanical Drilling Efficiency (ROP & WOB) */}
            <div className="bg-[#0a0812]/90 border border-[#8968bf]/[0.2] rounded-xl p-3">
              <div className="text-[11px] font-mono font-bold text-emerald-400 pb-1.5 border-b border-[#8968bf]/[0.15] flex justify-between">
                <span>Track 1: ROP / WOB</span>
                <span className="text-[#8a8299]">m/hr · t</span>
              </div>
              <div className="h-64 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(137, 104, 191, 0.1)" />
                    <XAxis dataKey="time" stroke="#8a8299" tick={{ fontSize: 9 }} />
                    <YAxis yAxisId="left" stroke="#10b981" tick={{ fontSize: 9 }} domain={[10, 45]} />
                    <YAxis yAxisId="right" orientation="right" stroke="#c084fc" tick={{ fontSize: 9 }} domain={[10, 20]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0a0812', borderColor: 'rgba(137,104,191,0.4)', fontSize: '10px' }} />
                    <Line yAxisId="left" type="monotone" dataKey="rop" stroke="#10b981" strokeWidth={2} dot={false} name="ROP" />
                    <Line yAxisId="right" type="monotone" dataKey="wob" stroke="#c084fc" strokeWidth={1.5} dot={false} name="WOB" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Track 2: Mechanical Dysfunction (Torque & SPP with Hazard Thresholds) */}
            <div className="bg-[#0a0812]/90 border border-[#8968bf]/[0.2] rounded-xl p-3">
              <div className="text-[11px] font-mono font-bold text-[#8968bf] pb-1.5 border-b border-[#8968bf]/[0.15] flex justify-between">
                <span>Track 2: Torque & SPP</span>
                <span className="text-amber-400">Hazard Divergence</span>
              </div>
              <div className="h-64 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(137, 104, 191, 0.1)" />
                    <XAxis dataKey="time" stroke="#8a8299" tick={{ fontSize: 9 }} />
                    <YAxis yAxisId="left" stroke="#8968bf" tick={{ fontSize: 9 }} domain={[15, 32]} />
                    <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" tick={{ fontSize: 9 }} domain={[4000, 4700]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0a0812', borderColor: 'rgba(137,104,191,0.4)', fontSize: '10px' }} />
                    <ReferenceLine yAxisId="right" y={4550} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'SPP Max', fill: '#ef4444', fontSize: 9 }} />
                    <Line yAxisId="left" type="monotone" dataKey="torque" stroke="#8968bf" strokeWidth={2.5} dot={false} name="Torque" />
                    <Line yAxisId="right" type="monotone" dataKey="spp" stroke="#f59e0b" strokeWidth={2.5} dot={false} name="SPP" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Track 3: Hydraulic Balance (Flow In vs Flow Out Annular Restriction) */}
            <div className="bg-[#0a0812]/90 border border-[#8968bf]/[0.2] rounded-xl p-3">
              <div className="text-[11px] font-mono font-bold text-blue-400 pb-1.5 border-b border-[#8968bf]/[0.15] flex justify-between">
                <span>Track 3: Flow Differential</span>
                <span className="text-[#8a8299]">L/min</span>
              </div>
              <div className="h-64 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(137, 104, 191, 0.1)" />
                    <XAxis dataKey="time" stroke="#8a8299" tick={{ fontSize: 9 }} />
                    <YAxis stroke="#8a8299" tick={{ fontSize: 9 }} domain={[2000, 2500]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0a0812', borderColor: 'rgba(137,104,191,0.4)', fontSize: '10px' }} />
                    <Area type="monotone" dataKey="flowIn" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} name="Flow In" />
                    <Area type="monotone" dataKey="flowOut" stroke="#ef4444" fill="#ef4444" fillOpacity={0.25} strokeWidth={2} name="Flow Out" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Track 4: Pressure & Formation Gas Influx */}
            <div className="bg-[#0a0812]/90 border border-[#8968bf]/[0.2] rounded-xl p-3">
              <div className="text-[11px] font-mono font-bold text-rose-400 pb-1.5 border-b border-[#8968bf]/[0.15] flex justify-between">
                <span>Track 4: ECD & Gas Influx</span>
                <span className="text-[#8a8299]">SG · %</span>
              </div>
              <div className="h-64 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(137, 104, 191, 0.1)" />
                    <XAxis dataKey="time" stroke="#8a8299" tick={{ fontSize: 9 }} />
                    <YAxis yAxisId="left" stroke="#8968bf" tick={{ fontSize: 9 }} domain={[1.15, 1.3]} />
                    <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" tick={{ fontSize: 9 }} domain={[0, 6]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0a0812', borderColor: 'rgba(137,104,191,0.4)', fontSize: '10px' }} />
                    <Line yAxisId="left" type="monotone" dataKey="ecd" stroke="#8968bf" strokeWidth={2} dot={false} name="ECD" />
                    <Line yAxisId="right" type="monotone" dataKey="gas" stroke="#f43f5e" strokeWidth={2} dot={false} name="Gas" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* VIEW MODE 2: Time-Series Grid Overview */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
          <div className="bg-[#110d1e]/90 border border-[#8968bf]/[0.2] rounded-xl p-3.5 shadow-md">
            <h4 className="text-xs font-bold text-[#f0edf8] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#8968bf]" />
              <span>Torque & Standpipe Pressure (Live Window)</span>
            </h4>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(137, 104, 191, 0.12)" />
                  <XAxis dataKey="time" stroke="#8a8299" tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="left" stroke="#8968bf" tick={{ fontSize: 10 }} domain={[15, 32]} />
                  <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" tick={{ fontSize: 10 }} domain={[4000, 4700]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0a0812', borderColor: 'rgba(137,104,191,0.4)', borderRadius: '8px', fontSize: '11px', color: '#f0edf8' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#cec9e1' }} />
                  <Line yAxisId="left" type="monotone" dataKey="torque" name="Torque (kN·m)" stroke="#8968bf" strokeWidth={2.5} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="spp" name="SPP (psi)" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#110d1e]/90 border border-[#8968bf]/[0.2] rounded-xl p-3.5 shadow-md">
            <h4 className="text-xs font-bold text-[#f0edf8] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>ROP Degradation vs WOB Formation Resistance</span>
            </h4>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(137, 104, 191, 0.12)" />
                  <XAxis dataKey="time" stroke="#8a8299" tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="left" stroke="#10b981" tick={{ fontSize: 10 }} domain={[10, 45]} />
                  <YAxis yAxisId="right" orientation="right" stroke="#c084fc" tick={{ fontSize: 10 }} domain={[10, 20]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0a0812', borderColor: 'rgba(137,104,191,0.4)', borderRadius: '8px', fontSize: '11px', color: '#f0edf8' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#cec9e1' }} />
                  <Line yAxisId="left" type="monotone" dataKey="rop" name="ROP (m/hr)" stroke="#10b981" strokeWidth={2.5} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="wob" name="WOB (tonnes)" stroke="#c084fc" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


