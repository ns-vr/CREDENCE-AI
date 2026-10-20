import React from 'react';
import { 
  Bot, 
  TrendingUp, 
  AlertTriangle, 
  IndianRupee, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight, 
  ExternalLink, 
  ChevronRight,
  Info,
  Activity,
  CheckCircle2,
  Clock,
  Sliders
} from 'lucide-react';
import { Agent, Alert, Transaction } from '../../types/credence';

interface OverviewPageProps {
  agents: Agent[];
  alerts: Alert[];
  transactions: Transaction[];
  onSelectAgent: (agentId: string) => void;
  onNavigateTo: (view: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  agents,
  alerts,
  transactions,
  onSelectAgent,
  onNavigateTo
}) => {
  // Aggregate KPI metrics
  const activeCount = agents.filter(a => a.status === 'active').length;
  const avgTrustScore = Math.round(agents.reduce((acc, a) => acc + a.trustScore, 0) / agents.length);
  const totalSpend = agents.reduce((acc, a) => acc + a.totalSpend90d, 0);
  const openAlertsCount = alerts.filter(a => a.status !== 'resolved').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-[var(--border-hairline)]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[var(--text-primary)]">
            Portfolio Financial Trust Overview
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Real-time behavioural telemetry across 12 SME autonomous AI agents
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigateTo('simulator')}
            className="px-3.5 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-xs sm:text-sm font-semibold text-[var(--text-primary)] hover:border-[#2F9E6E] transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Sliders className="w-4 h-4 text-[#2F9E6E]" />
            <span>Stress Simulator</span>
          </button>
          <button
            onClick={() => onNavigateTo('graph')}
            className="px-4 py-2 rounded-lg bg-[var(--brand-moss)] text-white text-xs sm:text-sm font-semibold hover:bg-[var(--brand-forest)] transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <span>Inspect Graph</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════
          ROW 1: 4 KPI CARDS WITH SPARKLINES
          ════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* KPI 1: Active Agents */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Active Agents
            </span>
            <div className="w-9 h-9 rounded-xl bg-[var(--brand-mint-mist)]/40 text-[var(--brand-moss)] flex items-center justify-center dark:bg-[#163832] dark:text-[#5FD3A0]">
              <Bot className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold font-mono-numbers text-[var(--text-primary)]">
              {activeCount}
            </span>
            <span className="text-sm text-[var(--text-secondary)]">
              / {agents.length} monitored
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm text-[#2F9E6E] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#2F9E6E]" />
            <span>9 Healthy · 2 Review · 1 Restricted</span>
          </div>
        </div>

        {/* KPI 2: Portfolio Trust Score */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Portfolio Trust Index
            </span>
            <div className="w-9 h-9 rounded-xl bg-[var(--brand-mint-mist)]/40 text-[var(--brand-moss)] flex items-center justify-center dark:bg-[#163832] dark:text-[#5FD3A0]">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold font-mono-numbers text-[var(--text-primary)]">
              {avgTrustScore}
            </span>
            <span className="text-sm text-[var(--text-secondary)] font-mono">/ 100</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs sm:text-sm text-[#2F9E6E] font-medium">
            <ArrowUpRight className="w-4 h-4" />
            <span>+4.2 pts vs 30-day baseline</span>
          </div>
        </div>

        {/* KPI 3: Open Anomaly Alerts */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Open Alerts
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#F0506E]/15 text-[#F0506E] flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold font-mono-numbers text-[#F0506E]">
              {openAlertsCount}
            </span>
            <span className="text-sm text-[var(--text-secondary)]">requiring review</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm text-[#E9B44C] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#F0506E]" />
            <span>1 Cycle · 1 Outlier · 1 Volatility</span>
          </div>
        </div>

        {/* KPI 4: Total Spend Managed */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Spend Under Mgmt
            </span>
            <div className="w-9 h-9 rounded-xl bg-[var(--brand-mint-mist)]/40 text-[var(--brand-moss)] flex items-center justify-center dark:bg-[#163832] dark:text-[#5FD3A0]">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold font-mono-numbers text-[var(--text-primary)]">
              ₹{(totalSpend / 10000000).toFixed(2)}Cr
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs sm:text-sm text-[var(--text-secondary)]">
            <span>5,040 transactions in 90d</span>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          ROW 2: SPEND VS APPROVED LIMIT & RISK GAUGE
          ════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Spend vs Approved Limit Over Time */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-bold font-heading text-[var(--text-primary)]">
                Autonomous Spend vs Approved Cap Over Time
              </h3>
              <p className="text-xs text-[var(--text-secondary)] font-mono">
                Daily actual outflows (green fill) constrained by calibrated limits (dashed line)
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-[var(--text-primary)]">
                <span className="w-3 h-3 rounded-sm bg-[#235347]" />
                Daily Spend
              </span>
              <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                <span className="w-3 h-0.5 bg-[#8EB69B] border-dashed border-b" />
                Approved Cap
              </span>
            </div>
          </div>

          {/* Simulated High-Res SVG Area Chart */}
          <div className="w-full h-64 relative bg-[var(--bg-page)]/40 rounded-xl p-3 border border-[var(--border-hairline)]">
            <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
              {/* Grid lines */}
              <line x1="0" y1="40" x2="600" y2="40" stroke="currentColor" strokeOpacity="0.08" />
              <line x1="0" y1="90" x2="600" y2="90" stroke="currentColor" strokeOpacity="0.08" />
              <line x1="0" y1="140" x2="600" y2="140" stroke="currentColor" strokeOpacity="0.08" />

              {/* Approved Limit Ceiling (Dashed line) */}
              <polyline
                fill="none"
                stroke="#8EB69B"
                strokeWidth="2"
                strokeDasharray="4 4"
                points="0,60 100,55 200,55 300,50 400,45 500,45 600,40"
              />

              {/* Gradient Area for Spend */}
              <defs>
                <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#235347" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#235347" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <polygon
                fill="url(#spendGradient)"
                points="0,180 0,110 50,115 100,105 150,120 200,98 250,102 300,85 350,92 400,78 450,84 500,72 550,76 600,68 600,180"
              />
              <polyline
                fill="none"
                stroke="#235347"
                strokeWidth="2.5"
                points="0,110 50,115 100,105 150,120 200,98 250,102 300,85 350,92 400,78 450,84 500,72 550,76 600,68"
              />

              {/* Data points */}
              {[
                { x: 200, y: 98, label: 'A-01 AWS cycle' },
                { x: 300, y: 85, label: 'Payroll release' },
                { x: 500, y: 72, label: 'ERP batch update' }
              ].map((pt, i) => (
                <circle key={i} cx={pt.x} cy={pt.y} r="4" fill="#5FD3A0" stroke="#051F20" strokeWidth="1.5" />
              ))}
            </svg>
            <div className="flex justify-between text-[10px] font-mono text-[var(--text-secondary)] mt-2">
              <span>90 Days Ago</span>
              <span>60 Days Ago</span>
              <span>30 Days Ago</span>
              <span>Today</span>
            </div>
          </div>
        </div>

        {/* Portfolio Risk Gauge */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold font-heading text-[var(--text-primary)]">
              Portfolio Trust Index
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-mono">
              Weighted behavioural confidence band
            </p>
          </div>

          <div className="flex flex-col items-center justify-center my-4">
            <div className="relative w-44 h-28 overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 100 55" className="w-full h-full">
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity="0.1"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#2F9E6E"
                  strokeWidth="8"
                  strokeDasharray="92 125"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute bottom-1 text-center">
                <span className="text-3xl font-bold font-mono-numbers text-[var(--text-primary)]">
                  74.2
                </span>
                <span className="text-[10px] text-[var(--text-secondary)] block font-mono">
                  HEALTHY CALIBRATION
                </span>
              </div>
            </div>

            <div className="mt-2 text-center text-xs text-[var(--text-secondary)]">
              <span className="text-[#2F9E6E] font-semibold">Confidence: 88.4%</span>
              <span className="block text-[11px] font-mono mt-0.5">
                Based on 5,040 verified evidence items
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[var(--bg-page)] text-[11px] text-[var(--text-secondary)] flex items-center gap-2">
            <Info className="w-4 h-4 text-[#8EB69B] shrink-0" />
            <span>Missing history never penalized as fraud (Epistemic Humility).</span>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          ROW 3: DONUT + RADAR + ACCESS BREAKDOWN
          ════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Risk Level Donut */}
        <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-sm">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-3">
            Agent Risk-Level Distribution
          </h4>
          <div className="flex items-center justify-between">
            <div className="relative w-28 h-28">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                {/* Low (green) 67% */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#2F9E6E" strokeWidth="5" strokeDasharray="67 33" strokeDashoffset="0" />
                {/* Review (amber) 17% */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#E9B44C" strokeWidth="5" strokeDasharray="17 83" strokeDashoffset="-67" />
                {/* High (coral) 16% */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#F0506E" strokeWidth="5" strokeDasharray="16 84" strokeDashoffset="-84" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-sm text-[var(--text-primary)]">
                12
              </div>
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2F9E6E]" />
                <span className="text-[var(--text-primary)]">Low: 8 (67%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E9B44C]" />
                <span className="text-[var(--text-primary)]">Review: 2 (17%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F0506E]" />
                <span className="text-[var(--text-primary)]">Restricted: 2 (16%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Evidence Quality 5-Dimension Radar */}
        <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-sm">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
            Evidence Quality Radar (5D)
          </h4>
          <div className="space-y-1.5 text-xs font-mono">
            {[
              { label: 'Freshness (Telemetry)', val: 92, color: '#2F9E6E' },
              { label: 'Coverage (All Scopes)', val: 88, color: '#2F9E6E' },
              { label: 'Verification (TPM / Bank)', val: 94, color: '#2F9E6E' },
              { label: 'Consistency (Variance)', val: 81, color: '#8EB69B' },
              { label: 'Contradiction (Penalty)', val: 8, color: '#E9B44C' }
            ].map(d => (
              <div key={d.label}>
                <div className="flex justify-between text-[11px] text-[var(--text-secondary)]">
                  <span>{d.label}</span>
                  <span className="text-[var(--text-primary)] font-bold">{d.val}%</span>
                </div>
                <div className="w-full h-1 bg-[var(--bg-page)] rounded-full overflow-hidden mt-0.5">
                  <div className="h-full rounded-full" style={{ width: `${d.val}%`, backgroundColor: d.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Access Recommendations Breakdown */}
        <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-sm">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-3">
            Access Engine Recommendations
          </h4>
          <div className="space-y-2 text-xs font-mono">
            {[
              { label: 'Maintain Limit', count: 5, color: '#8EB69B' },
              { label: 'Increase Cautiously', count: 3, color: '#2F9E6E' },
              { label: 'Require Human Dual-Sign', count: 2, color: '#E9B44C' },
              { label: 'Restrict Autonomous Spend', count: 1, color: '#F0506E' },
              { label: 'Abstain (Epistemic Humility)', count: 1, color: '#4B635C' }
            ].map(rec => (
              <div key={rec.label} className="flex items-center justify-between p-1.5 rounded-lg bg-[var(--bg-page)]">
                <span className="flex items-center gap-2 text-[var(--text-primary)]">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: rec.color }} />
                  {rec.label}
                </span>
                <span className="font-bold text-[var(--text-primary)]">{rec.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          ROW 4: ANOMALY HEATMAP & TOP VENDORS
          ════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Heatmap (Agents x 7 Days) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-bold font-heading text-[var(--text-primary)]">
                Anomaly Intensity Heatmap (7 Days)
              </h3>
              <p className="text-xs text-[var(--text-secondary)] font-mono">
                Visualizing daily variance deviations per agent
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--text-secondary)]">
              <span>Healthy</span>
              <span className="w-3 h-3 rounded bg-[#DAF1DE]" />
              <span className="w-3 h-3 rounded bg-[#8EB69B]" />
              <span className="w-3 h-3 rounded bg-[#235347]" />
              <span className="w-3 h-3 rounded bg-[#E9B44C]" />
              <span className="w-3 h-3 rounded bg-[#F0506E]" />
              <span>Anomaly</span>
            </div>
          </div>

          <div className="space-y-1.5 overflow-x-auto">
            {agents.slice(0, 7).map(a => (
              <div key={a.id} className="flex items-center gap-2 text-xs font-mono">
                <span className="w-24 truncate text-[var(--text-primary)] font-semibold shrink-0">
                  {a.code} · {a.name.split(' ')[0]}
                </span>
                <div className="flex gap-1.5 flex-1">
                  {[1, 2, 3, 4, 5, 6, 7].map(day => {
                    const isHigh = (a.id === 'agent-a04' && day >= 5) || (a.id === 'agent-a03' && day === 6);
                    const isMed = a.id === 'agent-a08' && day % 2 === 0;
                    const bg = isHigh ? '#F0506E' : isMed ? '#E9B44C' : day > 4 ? '#235347' : '#8EB69B';
                    return (
                      <div
                        key={day}
                        className="h-6 flex-1 rounded-md transition-all hover:opacity-80"
                        style={{ backgroundColor: bg }}
                        title={`${a.name}: Day ${day} deviation score`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Counterparties Treemap / Volume */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-bold font-heading text-[var(--text-primary)]">
                Top Counterparty Volumes
              </h3>
              <p className="text-xs text-[var(--text-secondary)] font-mono">
                Highlighting new or unverified vendors
              </p>
            </div>
            <button
              onClick={() => onNavigateTo('transactions')}
              className="text-xs text-[#2F9E6E] hover:underline font-mono"
            >
              All Vendors &rarr;
            </button>
          </div>

          <div className="space-y-2 text-xs font-mono">
            {[
              { name: 'Amazon Web Services APAC', vol: '₹1.24Cr', verified: true, risk: 'low' },
              { name: 'Google Cloud India Pte', vol: '₹89.0L', verified: true, risk: 'low' },
              { name: 'Razorpay Software Gateway', vol: '₹2.20Cr', verified: true, risk: 'low' },
              { name: 'Zenith FastPay Overseas Ltd', vol: '₹28.9L', verified: false, risk: 'high', isNew: true },
              { name: 'Apex Vortex Holdings (Circ)', vol: '₹38.4L', verified: false, risk: 'high' }
            ].map(cp => (
              <div key={cp.name} className="flex justify-between items-center p-2 rounded-xl bg-[var(--bg-page)] border border-[var(--border-hairline)]">
                <div className="flex items-center gap-2 truncate">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      cp.risk === 'high' ? 'bg-[#F0506E]' : 'bg-[#2F9E6E]'
                    }`}
                  />
                  <span className="text-[var(--text-primary)] truncate font-medium">
                    {cp.name}
                  </span>
                  {cp.isNew && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#E9B44C]/20 text-[#E9B44C] border border-[#E9B44C]/40 font-bold">
                      NEW VENDOR
                    </span>
                  )}
                </div>
                <span className="font-bold text-[var(--text-primary)] shrink-0 ml-2">
                  {cp.vol}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          ROW 5: GRAPH PREVIEW & LIVE ALERTS
          ════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trust Graph Preview Card */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="text-sm font-bold font-heading text-[var(--text-primary)]">
                Agent Trust Graph Snapshot
              </h3>
              <p className="text-xs text-[var(--text-secondary)] font-mono">
                Directed transaction flows and cycle detection
              </p>
            </div>
            <button
              onClick={() => onNavigateTo('graph')}
              className="text-xs text-[#2F9E6E] font-semibold hover:underline flex items-center gap-1"
            >
              <span>Full Interactive Graph</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div 
            onClick={() => onNavigateTo('graph')}
            className="w-full h-44 rounded-xl bg-[var(--bg-page)] border border-[var(--border-hairline)] flex items-center justify-center p-4 cursor-pointer hover:border-[#2F9E6E] transition-all relative overflow-hidden"
          >
            <div className="text-center space-y-1">
              <span className="inline-block px-2.5 py-1 rounded-full bg-[#F0506E]/15 text-[#F0506E] border border-[#F0506E]/30 text-xs font-mono font-bold animate-pulse">
                1 Cyclic Anomaly Intercepted (A-04 &rarr; A-05 &rarr; A-06)
              </span>
              <div className="text-xs text-[var(--text-secondary)] font-mono">
                Click to open full-screen 2D force graph with FACT vs INFERRED inspection
              </div>
            </div>
          </div>
        </div>

        {/* Live Alerts & Activity Feed */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold font-heading text-[var(--text-primary)]">
              Live Investigation Stream
            </h3>
            <span className="text-[10px] font-mono text-[var(--text-secondary)] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#2F9E6E] animate-pulse" />
              Real-time
            </span>
          </div>

          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {alerts.slice(0, 4).map(alert => (
              <div
                key={alert.id}
                className="p-3 rounded-xl bg-[var(--bg-page)] border border-[var(--border-hairline)] text-xs text-[var(--text-primary)]"
              >
                <div className="flex justify-between items-center font-semibold mb-1">
                  <span className="font-heading truncate">{alert.agentCode} · {alert.agentName}</span>
                  <span
                    className={`text-[10px] font-mono font-bold uppercase ${
                      alert.severity === 'critical'
                        ? 'text-[#F0506E]'
                        : alert.severity === 'caution'
                        ? 'text-[#E9B44C]'
                        : 'text-[#8EB69B]'
                    }`}
                  >
                    [{alert.severity.toUpperCase()}]
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] leading-snug">
                  {alert.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          ROW 6: AGENTS TABLE
          ════════════════════════════════════════ */}
      <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-sm">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h3 className="text-lg font-bold font-heading text-[var(--text-primary)]">
              Monitored AI Agents Directory
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mt-0.5">
              Select an agent to inspect behavioural breakdown, evidence provenance, and limits
            </p>
          </div>
          <button
            onClick={() => onNavigateTo('agents')}
            className="text-sm text-[#2F9E6E] hover:underline font-semibold cursor-pointer"
          >
            Manage All Agents &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border-hairline)] text-[var(--text-secondary)] uppercase text-xs font-semibold">
                <th className="pb-3">Agent</th>
                <th className="pb-3">Business Entity</th>
                <th className="pb-3 text-center">Trust Index</th>
                <th className="pb-3">Risk Tier</th>
                <th className="pb-3 font-mono">Current Limit</th>
                <th className="pb-3 font-mono">Recommended</th>
                <th className="pb-3">Confidence</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-hairline)]">
              {agents.slice(0, 8).map(agent => (
                <tr
                  key={agent.id}
                  onClick={() => onSelectAgent(agent.id)}
                  className="hover:bg-[var(--bg-page)] cursor-pointer transition-colors"
                >
                  <td className="py-3.5 pr-4">
                    <div className="font-semibold text-[var(--text-primary)] text-sm sm:text-base">
                      {agent.name}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                      {agent.code} &middot; {agent.purpose.slice(0, 42)}...
                    </div>
                  </td>
                  <td className="py-3.5 text-[var(--text-secondary)] pr-4">
                    <div className="font-medium text-[var(--text-primary)] text-xs sm:text-sm">{agent.ownerName.split('(')[0]}</div>
                    <div className="text-xs text-[var(--text-secondary)]">{agent.businessName}</div>
                  </td>
                  <td className="py-3.5 text-center px-2">
                    <span
                      className={`text-base font-bold font-mono-numbers ${
                        agent.trustScore >= 80 ? 'text-[#2F9E6E]' : agent.trustScore >= 50 ? 'text-[#E9B44C]' : 'text-[#F0506E]'
                      }`}
                    >
                      {agent.trustScore}
                    </span>
                  </td>
                  <td className="py-3.5 pr-2">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold uppercase ${
                        agent.riskTier === 'low'
                          ? 'bg-[#2F9E6E]/15 text-[#2F9E6E]'
                          : agent.riskTier === 'review'
                          ? 'bg-[#E9B44C]/15 text-[#E9B44C]'
                          : 'bg-[#F0506E]/15 text-[#F0506E]'
                      }`}
                    >
                      {agent.riskTier}
                    </span>
                  </td>
                  <td className="py-3.5 font-semibold text-[var(--text-primary)] font-mono text-xs sm:text-sm">
                    ₹{agent.currentLimit.toLocaleString()}
                  </td>
                  <td className="py-3.5 text-[#2F9E6E] font-semibold font-mono text-xs sm:text-sm">
                    ₹{agent.recommendedLimit.toLocaleString()}
                  </td>
                  <td className="py-3.5 text-[var(--text-secondary)] font-mono text-xs sm:text-sm">
                    {Math.round(agent.evidenceConfidence * 100)}%
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectAgent(agent.id);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[var(--bg-page)] text-[var(--text-primary)] hover:bg-[var(--brand-moss)] hover:text-white transition-colors text-xs sm:text-sm font-semibold cursor-pointer shadow-2xs"
                    >
                      Inspect &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
