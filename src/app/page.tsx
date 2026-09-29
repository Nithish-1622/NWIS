'use client';

import Link from 'next/link';
import {
  ShieldAlert,
  Radio,
  Layers,
  Map,
  Bot,
  Activity,
  Box,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Zap,
  TrendingUp,
  Grid,
  ChevronRight,
} from 'lucide-react';

// ─── Design tokens from Astro Build (adapted for NWIS) ───
// Primary: #551ca5 / #1c1469 / #8968bf / #5a5582 / #cec9e1

const FEATURES = [
  {
    icon: Map,
    label: 'Nearby Wells Intelligence',
    desc: 'Geospatial radar that instantly discovers offset wells within configurable radii. Every well carries its formation match, structural similarity, and historical dysfunction index.',
    accent: '#8968bf',
  },
  {
    icon: Activity,
    label: 'Live Telemetry Simulation',
    desc: 'WITS/WITSML-grade sensor stream across 14 channels — torque, SPP, ROP, ECD, flow differential and more — animated in deterministic real-time at configurable playback speeds.',
    accent: '#551ca5',
  },
  {
    icon: ShieldAlert,
    label: 'Predictive Hazard Detection',
    desc: 'Multi-evidence risk engine weighing physics, geology, historical offset patterns and ML-derived signatures to score pack-off, stuck-pipe and mud-loss precursors before onset.',
    accent: '#ef4444',
  },
  {
    icon: Layers,
    label: 'Evidence Fusion Matrix',
    desc: 'Interactive weighted breakdown: Physics 30 % · Historical Offset 25 % · ML 20 % · Geology 15 % · Rig State 5 % · Data Quality 5 %. Every alert comes with a traceable explanation.',
    accent: '#8968bf',
  },
  {
    icon: FileText,
    label: 'Document Intelligence',
    desc: 'OCR-extracted DDRs, WCRs, and fishing reports surface the exact sentence that mirrors current sensor signatures — closing the gap between archival knowledge and live wellbore behaviour.',
    accent: '#551ca5',
  },
  {
    icon: Bot,
    label: 'WellVista Copilot',
    desc: 'Context-aware AI assistant referencing live telemetry, formation, offset precedents and evidence weights to answer "why is this happening?" in natural language.',
    accent: '#8968bf',
  },
  {
    icon: Box,
    label: '3D Subsurface Digital Twin',
    desc: 'React Three Fiber scene rendering active well trajectory, offset trajectories, formation planes, fault geometry, active bit position and risk ribbon in real-time 3D.',
    accent: '#551ca5',
  },
  {
    icon: Grid,
    label: 'Fleet Intelligence Overview',
    desc: '18-rig command grid across Upper Assam basin. Filter by risk level, field, or depth. One click opens full telemetry for any rig — from NORMAL to CRITICAL at a glance.',
    accent: '#8968bf',
  },
  {
    icon: Zap,
    label: '6-Agent AI Pipeline',
    desc: 'Visualised multi-agent orchestration: Data Ingestion, Historical Offset, Physics, Geomechanical Risk, Evidence Fusion, and Decision-Support agents running in sequential consensus.',
    accent: '#551ca5',
  },
];

const FLOW_STEPS = [
  { step: '01', title: 'WellVista watches live behaviour', body: 'Sensor stream from active rig OIL-ASSAM-042 ingested via simulated WITS/WITSML at 1 Hz across 14 channels.' },
  { step: '02', title: 'Historical wells are queried', body: 'Nearby offset wells in Dibrugarh basin are ranked by formation match, trajectory similarity, and structural correlation.' },
  { step: '03', title: 'Geological context applied', body: 'Current formation (Barail, Kopili, Sylhet) informs geomechanical risk profile and expected lithology behaviour.' },
  { step: '04', title: 'Physics engine diverges', body: 'First-principles model flags torque variance, SPP divergence and annular packing — independently from ML signals.' },
  { step: '05', title: 'Risk score escalates', body: 'Multi-evidence weighted H score crosses ELEVATED → CAUTION → CRITICAL thresholds with progressive UI feedback.' },
  { step: '06', title: 'Human operator acts', body: 'Driller receives an evidence-backed advisory workflow. WellVista never controls equipment autonomously.' },
];

const BADGES = ['STUCK_PIPE', 'MUD_LOSS', 'BOREHOLE_INSTABILITY', 'BIT_BHA_DYSFUNCTION', 'WELL_CONTROL', 'TRIPPING_PROBLEM', 'DIRECTIONAL_DYSFUNCTION'];

export default function LandingPage() {
  return (
    <div
      className="min-h-dvh font-sans antialiased"
      style={{ background: 'var(--nwis-bg)', color: 'var(--nwis-text-primary)' }}
    >
      {/* ── STICKY NAV ── */}
      <header
        className="sticky top-0 z-50 border-b backdrop-blur-xl"
        style={{ background: 'rgba(10,8,18,0.85)', borderColor: 'var(--nwis-border)' }}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-6 py-3">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: 'linear-gradient(135deg,#551ca5,#1c1469)' }}
            >
              <Radio className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="text-base font-bold tracking-wide text-white">WellVista</span>
              <span
                className="ml-2 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                style={{ background: 'rgba(137,104,191,0.2)', color: '#cec9e1', border: '1px solid rgba(137,104,191,0.3)' }}
              >
                v1.0
              </span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden items-center gap-1 md:flex text-sm">
            {['Features', 'How it Works', 'Evidence Engine', 'Fleet'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                className="rounded-md px-3 py-1.5 transition-colors"
                style={{ color: 'var(--nwis-text-muted)' }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.color = '#cec9e1'; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'var(--nwis-text-muted)'; }}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all"
            style={{ background: 'linear-gradient(135deg,#551ca5,#3d2aab)' }}
          >
            <span>Open Command Center</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section
        id="hero"
        className="relative overflow-hidden px-6 pb-32 pt-24 text-center"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(85,28,165,0.22) 0%, transparent 70%)',
        }}
      >
        {/* Grid texture */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(to right,rgba(90,85,130,0.07) 1px,transparent 1px),linear-gradient(to bottom,rgba(90,85,130,0.07) 1px,transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative mx-auto max-w-4xl">
          {/* Category badge */}
          <div
            className="mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest"
            style={{ borderColor: 'rgba(137,104,191,0.4)', color: '#8968bf', background: 'rgba(28,20,105,0.4)' }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-500" />
            </span>
            Oil India Limited · eRTMAC Companion · Subsurface Intelligence
          </div>

          {/* H1 */}
          <h1
            className="mb-6 text-balance"
            style={{ fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.02em', color: '#f0edf8' }}
          >
            Drilling intelligence that{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg,#8968bf,#cec9e1,#551ca5)' }}
            >
              predicts risk before it happens
            </span>
          </h1>

          {/* Sub */}
          <p
            className="mx-auto mb-12 max-w-2xl text-lg"
            style={{ color: 'var(--nwis-text-secondary)', fontWeight: 300, lineHeight: 1.7 }}
          >
            WellVista fuses live wellbore telemetry, nearby offset well history, geological formation intelligence,
            and physics-first anomaly detection into a single advisory layer for the drilling engineer.
          </p>

          {/* Value prop pill */}
          <div
            className="mx-auto mb-12 flex flex-wrap items-center justify-center gap-3 rounded-xl border px-6 py-4 text-xs font-mono"
            style={{ borderColor: 'var(--nwis-border)', background: 'rgba(21,17,42,0.8)', maxWidth: '640px' }}
          >
            {['PAST WELLS', '+', 'LIVE SENSORS', '+', 'GEOLOGY', '+', 'PHYSICS', '=', 'FORESIGHT'].map((t, i) => (
              <span
                key={i}
                style={{
                  color: t === '=' ? '#8968bf' : t === '+' ? '#5a5582' : '#cec9e1',
                  fontWeight: t === '=' || t === 'FORESIGHT' ? 700 : 400,
                  fontSize: t === 'FORESIGHT' ? '0.85rem' : undefined,
                }}
              >
                {t}
              </span>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg,#551ca5,#1c1469)', boxShadow: '0 0 32px rgba(85,28,165,0.35)' }}
            >
              <Radio className="h-4 w-4 animate-pulse" />
              Launch Command Center
            </Link>
            <a
              href="#features"
              className="flex items-center gap-2 rounded-lg border px-6 py-3 text-sm font-semibold transition-all hover:border-purple-500"
              style={{ borderColor: 'var(--nwis-border-strong)', color: '#cec9e1' }}
            >
              Explore Features
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Hero mock telemetry strip */}
        <div
          className="mx-auto mt-20 grid max-w-4xl grid-cols-4 gap-3 rounded-xl border p-4 text-left text-xs font-mono"
          style={{ borderColor: 'var(--nwis-border)', background: 'rgba(21,17,42,0.9)' }}
        >
          {[
            { label: 'ACTIVE WELL', value: 'OIL-ASSAM-042', sub: 'Dibrugarh High, Assam', accent: '#8968bf' },
            { label: 'DEPTH', value: '3,212 m', sub: 'TVD 3,188 m', accent: '#cec9e1' },
            { label: 'FORMATION', value: 'Kopili Shale', sub: 'HIGH RISK INTERVAL', accent: '#ef4444' },
            { label: 'HAZARD SCORE', value: '87 %', sub: 'CRITICAL — PACK-OFF', accent: '#ef4444' },
          ].map((m) => (
            <div key={m.label} className="rounded-lg border p-3" style={{ borderColor: 'rgba(137,104,191,0.15)' }}>
              <div style={{ color: 'var(--nwis-text-faint)', fontSize: '9px', fontWeight: 600, letterSpacing: '0.1em' }}>{m.label}</div>
              <div className="mt-1 text-sm font-bold" style={{ color: m.accent }}>{m.value}</div>
              <div style={{ color: 'var(--nwis-text-muted)', fontSize: '10px' }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DYSFUNCTION TAXONOMY BADGE STRIP ── */}
      <div className="border-y py-4" style={{ borderColor: 'var(--nwis-border)', background: 'rgba(21,17,42,0.5)' }}>
        <div className="flex flex-wrap items-center justify-center gap-2 px-6">
          <span className="mr-2 text-xs uppercase tracking-widest" style={{ color: 'var(--nwis-text-faint)' }}>Detects:</span>
          {BADGES.map((b) => (
            <span
              key={b}
              className="rounded border px-2.5 py-1 text-[10px] font-mono font-bold uppercase"
              style={{ borderColor: 'rgba(137,104,191,0.25)', color: '#8968bf', background: 'rgba(85,28,165,0.12)' }}
            >
              {b.replace(/_/g, '_')}
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURES GRID ── */}
      <section id="features" className="px-6 py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: '#8968bf' }}>Capabilities</p>
            <h2 style={{ fontWeight: 300, color: '#f0edf8' }}>
              Nine integrated intelligence layers
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base" style={{ color: 'var(--nwis-text-secondary)', fontWeight: 300 }}>
              Every module is connected. Telemetry informs the risk engine. The risk engine queries historical wells.
              Historical wells surface OCR documents. Documents close the loop back to telemetry patterns.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.label}
                  className="group relative rounded-xl border p-6 transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    borderColor: 'var(--nwis-border)',
                    background: 'var(--nwis-bg-panel)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(137,104,191,0.45)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(28,20,105,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--nwis-border)';
                    (e.currentTarget as HTMLElement).style.background = 'var(--nwis-bg-panel)';
                  }}
                >
                  <div
                    className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ background: `rgba(85,28,165,0.25)`, border: '1px solid rgba(137,104,191,0.3)' }}
                  >
                    <Icon className="h-5 w-5" style={{ color: f.accent }} />
                  </div>
                  <h3 className="mb-2 font-semibold" style={{ color: '#f0edf8', fontSize: '0.9rem' }}>{f.label}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--nwis-text-secondary)', fontWeight: 300 }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        id="how-it-works"
        className="px-6 py-24"
        style={{ background: 'linear-gradient(180deg,rgba(28,20,105,0.12) 0%,transparent 100%)' }}
      >
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: '#8968bf' }}>Intelligence Flow</p>
            <h2 style={{ fontWeight: 300, color: '#f0edf8' }}>How WellVista predicts risk</h2>
            <p className="mx-auto mt-4 max-w-xl text-base" style={{ color: 'var(--nwis-text-secondary)', fontWeight: 300 }}>
              A six-stage deterministic pipeline — from raw sensor ingestion to human-reviewed advisory — runs every simulation step.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FLOW_STEPS.map((s, i) => (
              <div
                key={s.step}
                className="relative rounded-xl border p-6"
                style={{ borderColor: 'var(--nwis-border)', background: 'var(--nwis-bg-panel)' }}
              >
                {i < FLOW_STEPS.length - 1 && (
                  <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 lg:block">
                    <ArrowRight className="h-4 w-4" style={{ color: '#5a5582' }} />
                  </div>
                )}
                <div
                  className="mb-4 text-2xl font-bold"
                  style={{ color: 'rgba(137,104,191,0.5)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}
                >
                  {s.step}
                </div>
                <h3 className="mb-2 font-semibold" style={{ color: '#cec9e1', fontSize: '0.875rem' }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--nwis-text-muted)', fontWeight: 300 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EVIDENCE ENGINE ── */}
      <section id="evidence-engine" className="px-6 py-24">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: '#8968bf' }}>Multi-Factor Risk Model</p>
            <h2 style={{ fontWeight: 300, color: '#f0edf8' }}>Evidence Fusion Matrix</h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: 'var(--nwis-text-secondary)', fontWeight: 300 }}>
              WellVista never produces a black-box alert. Every risk score is decomposed into six independently computed evidence streams,
              each weighted and explained. Click any contribution to see its underlying sensor logs and historical citations.
            </p>
            <div className="mt-8 space-y-2">
              <div
                className="rounded-lg border p-3 text-xs font-mono"
                style={{ borderColor: 'rgba(137,104,191,0.3)', background: 'rgba(21,17,42,0.8)', color: '#cec9e1' }}
              >
                H_hazard = 0.30·Physics + 0.25·Offset + 0.20·ML + 0.15·Geology + 0.05·RigState + 0.05·DataQuality
              </div>
            </div>
            <Link
              href="/dashboard"
              className="mt-8 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all"
              style={{ background: 'linear-gradient(135deg,#551ca5,#3d2aab)' }}
            >
              Try the live evidence matrix
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Evidence visual */}
          <div
            className="rounded-xl border p-6 font-mono text-xs"
            style={{ borderColor: 'var(--nwis-border)', background: 'var(--nwis-bg-panel)' }}
          >
            <div className="mb-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--nwis-text-faint)' }}>
              Live Evidence Contributions — Step 52 (Critical Zone)
            </div>
            {[
              { cat: 'Physics', w: 30, score: 89, status: 'CRITICAL' },
              { cat: 'Historical Offset', w: 25, score: 92, status: 'CRITICAL' },
              { cat: 'Machine Learning', w: 20, score: 85, status: 'CRITICAL' },
              { cat: 'Geology', w: 15, score: 94, status: 'CRITICAL' },
              { cat: 'Rig State', w: 5, score: 70, status: 'ELEVATED' },
              { cat: 'Data Quality', w: 5, score: 95, status: 'OK' },
            ].map((ev) => (
              <div key={ev.cat} className="mb-3">
                <div className="mb-1 flex items-center justify-between">
                  <span style={{ color: '#cec9e1' }}>{ev.cat}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className="rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase"
                      style={{
                        color: ev.status === 'CRITICAL' ? '#f87171' : ev.status === 'ELEVATED' ? '#fbbf24' : '#4ade80',
                        borderColor: ev.status === 'CRITICAL' ? 'rgba(239,68,68,0.3)' : ev.status === 'ELEVATED' ? 'rgba(251,191,36,0.3)' : 'rgba(74,222,128,0.3)',
                        background: ev.status === 'CRITICAL' ? 'rgba(239,68,68,0.1)' : ev.status === 'ELEVATED' ? 'rgba(251,191,36,0.1)' : 'rgba(74,222,128,0.1)',
                      }}
                    >{ev.status}</span>
                    <span style={{ color: '#8968bf' }}>{ev.score}/100</span>
                  </div>
                </div>
                <div className="relative h-1.5 overflow-hidden rounded-full" style={{ background: 'rgba(90,85,130,0.25)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${ev.score}%`,
                      background: ev.score > 80 ? 'linear-gradient(90deg,#7040c8,#ef4444)' : '#551ca5',
                    }}
                  />
                </div>
                <div className="mt-0.5 text-[10px]" style={{ color: 'var(--nwis-text-faint)' }}>{ev.w}% weight</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HUMAN IN THE LOOP ── */}
      <section
        className="px-6 py-16"
        style={{ background: 'rgba(28,20,105,0.15)', borderTop: '1px solid var(--nwis-border)', borderBottom: '1px solid var(--nwis-border)' }}
      >
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-8">
          <div className="flex items-start gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
              style={{ background: 'rgba(85,28,165,0.25)', border: '1px solid rgba(137,104,191,0.3)' }}
            >
              <CheckCircle2 className="h-6 w-6" style={{ color: '#8968bf' }} />
            </div>
            <div>
              <h3 className="mb-1 text-base font-semibold" style={{ color: '#f0edf8' }}>ADVISORY — HUMAN DECISION REQUIRED</h3>
              <p className="max-w-lg text-sm" style={{ color: 'var(--nwis-text-secondary)', fontWeight: 300 }}>
                WellVista operates exclusively as a drilling intelligence advisory layer. No equipment control is autonomous.
                Every recommendation requires human driller validation. Safety-critical decisions remain with the operator.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-mono">
            {[
              { check: true, text: 'No autonomous rig control' },
              { check: true, text: 'Every alert is explained' },
              { check: true, text: 'Driller acknowledgement required' },
              { check: true, text: 'Simulation clearly labelled' },
            ].map((i) => (
              <div key={i.text} className="flex items-center gap-2" style={{ color: 'var(--nwis-text-secondary)' }}>
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: '#8968bf' }} />
                {i.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FLEET STRIP ── */}
      <section id="fleet" className="px-6 py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: '#8968bf' }}>Fleet Monitor</p>
            <h2 style={{ fontWeight: 300, color: '#f0edf8' }}>18 rigs across Upper Assam basin</h2>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-9">
            {[
              { id: 'RIG-01', status: 'CRITICAL' }, { id: 'RIG-02', status: 'NORMAL' }, { id: 'RIG-03', status: 'ELEVATED' },
              { id: 'RIG-04', status: 'NORMAL' }, { id: 'RIG-05', status: 'CAUTION' }, { id: 'RIG-06', status: 'NORMAL' },
              { id: 'RIG-07', status: 'NORMAL' }, { id: 'RIG-08', status: 'NORMAL' }, { id: 'RIG-09', status: 'ELEVATED' },
              { id: 'RIG-10', status: 'NORMAL' }, { id: 'RIG-11', status: 'NORMAL' }, { id: 'RIG-12', status: 'NORMAL' },
              { id: 'RIG-13', status: 'CAUTION' }, { id: 'RIG-14', status: 'ELEVATED' }, { id: 'RIG-15', status: 'NORMAL' },
              { id: 'RIG-16', status: 'NORMAL' }, { id: 'RIG-17', status: 'NORMAL' }, { id: 'RIG-18', status: 'NORMAL' },
            ].map((r) => {
              const col = r.status === 'CRITICAL' ? '#ef4444' : r.status === 'ELEVATED' ? '#eab308' : r.status === 'CAUTION' ? '#f97316' : '#22c55e';
              return (
                <div
                  key={r.id}
                  className="rounded-lg border p-2 text-center text-[10px] font-mono"
                  style={{ borderColor: `${col}30`, background: `${col}0d` }}
                >
                  <div style={{ color: '#cec9e1' }}>{r.id}</div>
                  <div className="mt-0.5 font-bold" style={{ color: col, fontSize: '9px' }}>{r.status}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA FOOTER ── */}
      <section className="px-6 pb-32 pt-16 text-center">
        <div
          className="mx-auto max-w-2xl rounded-2xl border p-12"
          style={{
            borderColor: 'rgba(137,104,191,0.35)',
            background: 'linear-gradient(135deg,rgba(85,28,165,0.2),rgba(28,20,105,0.4))',
            boxShadow: '0 0 80px rgba(85,28,165,0.15)',
          }}
        >
          <h2 className="mb-4" style={{ fontWeight: 700, color: '#f0edf8', letterSpacing: '-0.02em' }}>
            Ready to experience drilling foresight?
          </h2>
          <p className="mb-8 text-base" style={{ color: '#cec9e1', fontWeight: 300 }}>
            Launch the WellVista platform. Start the simulation. Drill into Kopili Shale. Watch the evidence build.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-3 rounded-xl px-8 py-4 text-base font-bold text-white transition-all hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg,#551ca5,#1c1469)', boxShadow: '0 0 40px rgba(85,28,165,0.4)' }}
          >
            <Radio className="h-5 w-5 animate-pulse" />
            Launch WellVista Command Center
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t px-6 py-8" style={{ borderColor: 'var(--nwis-border)' }}>
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-6 w-6 items-center justify-center rounded"
              style={{ background: 'linear-gradient(135deg,#551ca5,#1c1469)' }}
            >
              <Radio className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-bold tracking-wide text-white">WellVista</span>
            <span className="text-xs" style={{ color: 'var(--nwis-text-faint)' }}>Subsurface Intelligence & Decision Support · Oil India Limited</span>
          </div>
          <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--nwis-text-faint)' }}>
            <span
              className="rounded border px-2 py-0.5 font-mono font-bold uppercase"
              style={{ borderColor: 'rgba(137,104,191,0.25)', color: '#8968bf' }}
            >
              PROTOTYPE SIMULATION
            </span>
            <span>Design adapted from Astro Build via Inspo MCP</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
