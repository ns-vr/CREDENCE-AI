import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Activity, 
  Lock, 
  Database, 
  Sliders, 
  FileCheck2, 
  Scale, 
  Eye, 
  AlertTriangle, 
  Network, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  Cpu,
  Fingerprint,
  UserCheck
} from 'lucide-react';
import { Hero3DConstellation } from './Hero3DConstellation';
import { AdaptiveDial } from './AdaptiveDial';
import { EvidencePassportCard } from './EvidencePassportCard';
import { InteractiveMiniGraph } from './InteractiveMiniGraph';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onOpenAuth }) => {
  const [tickerIndex, setTickerIndex] = useState(0);

  const tickerEvents = [
    { code: 'Agent A-01', text: 'Invoice settlement ₹42,000 to AWS APAC', status: 'Verified', color: '#5FD3A0' },
    { code: 'Agent A-02', text: 'CDN compute reservation ₹185,000 approved', status: 'Verified', color: '#5FD3A0' },
    { code: 'Agent A-03', text: 'Outlier disbursement ₹289,000 flagged for first-time supplier', status: 'Review', color: '#E9B44C' },
    { code: 'Agent A-04', text: 'Cyclic transaction flow ₹82,000 detected with A-05 & A-06', status: 'Restricted', color: '#F0506E' },
    { code: 'Agent A-07', text: 'Contractor payroll tranche ₹75,000 dual-signed', status: 'Cleared', color: '#5FD3A0' },
    { code: 'Agent A-12', text: 'New agent enrolled with zero historical baseline', status: 'Abstain', color: '#8EB69B' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % tickerEvents.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [tickerEvents.length]);

  const currentTicker = tickerEvents[tickerIndex];

  return (
    <div className="min-h-screen bg-[#051F20] text-[#DAF1DE] selection:bg-[#235347] selection:text-[#DAF1DE] relative overflow-x-hidden font-sans text-base">
      {/* Precision Grid Background */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none -z-10"
        style={{
          backgroundImage: 'linear-gradient(#DAF1DE 1px, transparent 1px), linear-gradient(to right, #DAF1DE 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      {/* Institutional Navbar */}
      <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#051F20]/90 border-b border-[#163832] px-6 sm:px-12 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#0B2B26] border border-[#235347] flex items-center justify-center text-[#5FD3A0]">
            <ShieldCheck className="w-5 h-5 text-[#5FD3A0]" />
          </div>
          <span className="text-xl font-bold tracking-tight font-heading text-white">
            CREDENCE
          </span>
          <span className="text-xs text-[#8EB69B] pl-3 border-l border-[#163832] font-medium hidden sm:inline">
            Agent Financial Access Control
          </span>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-7 text-sm text-[#8EB69B] font-medium">
          <a href="#problem" className="hover:text-white transition-colors">Risk Architecture</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">Verification Pipeline</a>
          <a href="#graph" className="hover:text-white transition-colors">Trust Graph</a>
          <a href="#adaptive-access" className="hover:text-white transition-colors">Adaptive Limits</a>
          <a href="#safeguards" className="hover:text-white transition-colors">Governance</a>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenAuth('login')}
            className="text-sm font-medium text-[#8EB69B] hover:text-white px-3 py-1.5 transition-colors cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={() => onOpenAuth('signup')}
            className="text-sm font-semibold px-4 py-2 rounded-lg bg-[#235347] text-[#DAF1DE] hover:bg-[#2F9E6E] hover:text-[#051F20] border border-[#2F9E6E]/40 transition-all cursor-pointer shadow-sm"
          >
            Open Console
          </button>
        </div>
      </nav>

      {/* ════════════════════════════════════════
          HERO SECTION
          ════════════════════════════════════════ */}
      <section className="relative min-h-[85vh] flex flex-col justify-center items-center px-6 sm:px-12 pt-12 pb-16 overflow-hidden">
        {/* Three.js 3D Constellation Canvas Background */}
        <div className="absolute inset-0 pointer-events-auto -z-0">
          <Hero3DConstellation />
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 max-w-4xl mx-auto text-center pointer-events-none mt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B2B26] border border-[#235347] text-xs font-medium text-[#8EB69B] mb-5 pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-[#5FD3A0]" />
            <span>Agent Financial Trust &amp; Access Controls</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-heading tracking-tight text-white leading-[1.08] mb-6">
            Trust earned.<br />
            Autonomy justified.
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#8EB69B] max-w-2xl mx-auto leading-relaxed mb-9 font-normal">
            Financial access intelligence and behavioural trust assessment for autonomous AI agents managing SME disbursements, vendor purchases, and invoice clearance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pointer-events-auto">
            <button
              onClick={() => onOpenAuth('signup')}
              className="w-full sm:w-auto px-7 py-3 rounded-lg bg-[#5FD3A0] text-[#051F20] font-semibold text-sm hover:bg-[#8EB69B] transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-md"
            >
              <span>Launch Platform Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#graph"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#0B2B26] text-[#DAF1DE] font-medium text-sm border border-[#235347] hover:border-[#8EB69B] transition-colors flex items-center justify-center gap-2.5"
            >
              <Network className="w-4 h-4 text-[#5FD3A0]" />
              <span>Explore Trust Graph</span>
            </a>
          </div>

          <p className="mt-8 text-xs sm:text-sm text-[#4B635C] font-medium">
            Continuous behavioural scoring · Epistemic abstention · Complete human auditability
          </p>
        </div>

        {/* Live Event Activity Strip */}
        <div className="relative z-10 w-full max-w-4xl mt-12 bg-[#0B2B26]/90 border border-[#163832] rounded-xl py-2.5 px-4 sm:px-5 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-3 truncate mr-4">
            <span className="w-2 h-2 rounded-full bg-[#5FD3A0]" />
            <span className="text-[#8EB69B] text-xs font-semibold shrink-0 uppercase tracking-wider">Live Activity:</span>
            <span className="text-[#DAF1DE] truncate font-medium">{currentTicker.code} · {currentTicker.text}</span>
          </div>
          <span 
            className="shrink-0 font-medium text-xs px-2.5 py-1 rounded-md border"
            style={{ borderColor: currentTicker.color, color: currentTicker.color, backgroundColor: `${currentTicker.color}15` }}
          >
            {currentTicker.status}
          </span>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 1: TOPOLOGY & ANOMALY DETECTION
          ════════════════════════════════════════ */}
      <section id="problem" className="py-20 px-6 sm:px-12 border-t border-[#163832] bg-[#051F20]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <div className="text-xs font-semibold text-[#5FD3A0] uppercase tracking-wider mb-2">
              Risk Architecture &amp; Anomaly Detection
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-white">
              Local transactions appear benign. Network topology exposes systemic risk.
            </h2>
            <p className="text-[#8EB69B] text-sm sm:text-base mt-3 max-w-3xl leading-relaxed">
              Autonomous agents execute micro-purchases within individual thresholds. Without directed relationship analysis, circular fund recycling and sudden distribution shifts remain undetected.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-[#0B2B26] border border-[#163832] flex flex-col justify-between">
              <div>
                <div className="inline-block px-2.5 py-1 rounded-md bg-[#F0506E]/15 border border-[#F0506E]/30 text-xs font-semibold text-[#F0506E] mb-3">
                  Circular Flow Detection
                </div>
                <h3 className="text-lg font-bold text-white font-heading mb-2">
                  Triangular Fund Recycling
                </h3>
                <p className="text-sm text-[#8EB69B] leading-relaxed">
                  Three distinct agents (A-04 Logistics, A-05 DSP, A-06 Disburser) route reciprocal ₹80k+ payments in a closed loop, inflating apparent transaction volume without underlying commercial exchange.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#163832] text-xs font-medium text-[#F0506E]">
                Algorithm: Tarjan Directed Cycle Decomposition
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[#0B2B26] border border-[#163832] flex flex-col justify-between">
              <div>
                <div className="inline-block px-2.5 py-1 rounded-md bg-[#E9B44C]/15 border border-[#E9B44C]/30 text-xs font-semibold text-[#E9B44C] mb-3">
                  Distribution Variance
                </div>
                <h3 className="text-lg font-bold text-white font-heading mb-2">
                  Baseline Variance Spikes
                </h3>
                <p className="text-sm text-[#8EB69B] leading-relaxed">
                  Agent A-03 suddenly disburses ₹289,000 (z-score: 4.2) to an unverified supplier registered 6 days prior. Traditional static caps allow this; behavioural scoring flags the distribution shift.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#163832] text-xs font-medium text-[#E9B44C]">
                Detection: Gaussian Baseline Z-Score (σ &gt; 2.5)
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[#0B2B26] border border-[#163832] flex flex-col justify-between">
              <div>
                <div className="inline-block px-2.5 py-1 rounded-md bg-[#5FD3A0]/15 border border-[#5FD3A0]/30 text-xs font-semibold text-[#5FD3A0] mb-3">
                  Epistemic Humility
                </div>
                <h3 className="text-lg font-bold text-white font-heading mb-2">
                  Zero-Evidence Abstention
                </h3>
                <p className="text-sm text-[#8EB69B] leading-relaxed">
                  When a new agent (A-12) arrives with zero transaction history, CREDENCE never penalizes it as fraudulent. The engine explicitly returns ABSTAIN: human supervisor co-signing required.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#163832] text-xs font-medium text-[#5FD3A0]">
                Policy: Missing History ≠ Negative Trust
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 2: PIPELINE ARCHITECTURE
          ════════════════════════════════════════ */}
      <section id="how-it-works" className="py-20 px-6 sm:px-12 border-t border-[#163832] bg-[#051F20]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <div className="text-xs font-semibold text-[#5FD3A0] uppercase tracking-wider mb-2">
              Assessment Pipeline
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-white">
              Deterministic 6-Stage Trust Calibration
            </h2>
            <p className="text-[#8EB69B] text-sm sm:text-base mt-3 max-w-3xl leading-relaxed">
              Translates agent identity attestation, historical transactions, and counterparty graphs into adaptive spending boundaries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                step: 'Stage 1',
                title: 'Hardware & Identity Attestation',
                desc: 'Binding of cryptographic agent identity to verified business entity and authorized financial scopes.'
              },
              {
                step: 'Stage 2',
                title: 'Evidence Provenance',
                desc: 'Continuous multi-source evidence evaluation across Freshness, Coverage, Verification, and Consistency.'
              },
              {
                step: 'Stage 3',
                title: 'Cadence & Variance Modeling',
                desc: 'Statistical deviation checks against baseline ticket sizes, failure frequencies, and supplier dispute ratios.'
              },
              {
                step: 'Stage 4',
                title: 'Uncertainty Estimation',
                desc: 'Confidence coefficient scoring. If evidence is thin or novel, the engine abstains rather than misclassifying.'
              },
              {
                step: 'Stage 5',
                title: 'Access Limit Modulation',
                desc: 'Maps trust index to 5 distinct operational actions: Maintain, Increase, Require Approval, Restrict, or Abstain.'
              },
              {
                step: 'Stage 6',
                title: 'Circuit Breaker Monitoring',
                desc: 'Real-time alert stream re-evaluates network clusters with automated payment holds for suspicious loops.'
              }
            ].map(item => (
              <div key={item.step} className="p-6 rounded-xl bg-[#0B2B26] border border-[#163832]">
                <div className="text-xs font-bold text-[#5FD3A0] uppercase mb-2">{item.step}</div>
                <h4 className="text-base font-bold text-white font-heading mb-2">{item.title}</h4>
                <p className="text-sm text-[#8EB69B] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 3: TRUST GRAPH
          ════════════════════════════════════════ */}
      <section id="graph" className="py-20 px-6 sm:px-12 border-t border-[#163832] bg-[#051F20]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs font-semibold text-[#5FD3A0] uppercase tracking-wider">
              Network Topology
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-white leading-tight">
              Real-Time Inter-Agent Trust Graph
            </h2>
            <p className="text-[#8EB69B] text-sm sm:text-base leading-relaxed">
              Autonomous agents coordinate disbursements across multiple suppliers and counterparties. CREDENCE maps relationships in a live directed multigraph with automated cycle detection.
            </p>

            <div className="space-y-2.5 text-sm text-[#DAF1DE] pt-2">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#5FD3A0] shrink-0" />
                <span>Deterministic Tarjan cycle decomposition</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#5FD3A0] shrink-0" />
                <span>Strict separation of observed facts vs statistical inferences</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#5FD3A0] shrink-0" />
                <span>Granular evidence provenance per edge</span>
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={() => onEnterApp()}
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-[#163832] text-white hover:bg-[#235347] border border-[#235347] text-sm font-semibold transition-colors cursor-pointer"
              >
                <span>Open Full Graph Console</span>
                <ChevronRight className="w-4 h-4 text-[#5FD3A0]" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <InteractiveMiniGraph />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 4: ADAPTIVE ACCESS CONTROL
          ════════════════════════════════════════ */}
      <section id="adaptive-access" className="py-20 px-6 sm:px-12 border-t border-[#163832] bg-[#051F20]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <div className="text-xs font-semibold text-[#5FD3A0] uppercase tracking-wider mb-2">
              Dynamic Controls
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-white">
              Dynamic Spending Limit Modulation
            </h2>
            <p className="text-[#8EB69B] text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
              Test how the access engine modulates autonomous ceilings and approval gates based on anomaly intensity and behavioural consistency.
            </p>
          </div>

          <div className="max-w-3xl">
            <AdaptiveDial />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 5: EVIDENCE PASSPORT
          ════════════════════════════════════════ */}
      <section className="py-20 px-6 sm:px-12 border-t border-[#163832] bg-[#051F20]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6">
            <EvidencePassportCard />
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="text-xs font-semibold text-[#5FD3A0] uppercase tracking-wider">
              Compliance Dossier
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-white leading-tight">
              Cryptographic Behavioural Passport
            </h2>
            <p className="text-[#8EB69B] text-sm sm:text-base leading-relaxed">
              Exportable compliance dossier per agent summarizing behavioural variance, evidence quality, and hardware attestation. Bank reviewers verify integrity via SHA-256 hash or QR payload without revealing internal transaction rows.
            </p>

            <div className="p-4 rounded-xl bg-[#0B2B26] border border-[#163832] text-xs sm:text-sm text-[#8EB69B] space-y-1">
              <div className="text-white font-semibold">Attestation Dossier Integrity:</div>
              <div>Immutable audit log tracking all limit changes, overrides, and operator signatures.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 6: GOVERNANCE PRINCIPLES
          ════════════════════════════════════════ */}
      <section id="safeguards" className="py-20 px-6 sm:px-12 border-t border-[#163832] bg-[#051F20]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <div className="text-xs font-semibold text-[#5FD3A0] uppercase tracking-wider mb-2">
              Governance &amp; Safeguards
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-white">
              Institutional Risk Principles
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: 'Epistemic Humility', desc: 'Missing history is never treated as fraud. When evidence is thin, the engine abstains.' },
              { title: 'Advisory Access Control', desc: 'Recommends boundaries and simulates stress. Integrates with existing corporate banking rails.' },
              { title: 'Indicator Discipline', desc: 'Graph flags are indicators for investigation, not automated accusations of misconduct.' },
              { title: 'Role-Based Minimisation', desc: 'Auditors see aggregate trust proofs while financial managers see transaction line items.' },
              { title: 'Cryptographic Integrity', desc: 'Assessments signed with hardware attestation hashes and immutable timestamps.' },
              { title: 'Factor Attribution', desc: 'Zero black box. Score breakdowns show positive and negative contributors.' },
              { title: 'Mandatory Override Reason', desc: 'Human operators cannot override an access limit without entering a logged rationale.' },
              { title: 'Deterministic Rules', desc: 'Guaranteed circuit breakers stop runaway spend loops before clearing.' }
            ].map((safeguard, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-[#0B2B26] border border-[#163832]">
                <div className="text-xs font-semibold text-[#5FD3A0] mb-2">
                  Principle {idx + 1}
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white mb-2 font-heading">{safeguard.title}</h4>
                <p className="text-xs sm:text-sm text-[#8EB69B] leading-relaxed">{safeguard.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FINAL CTA & FOOTER
          ════════════════════════════════════════ */}
      <section className="py-20 px-6 sm:px-12 border-t border-[#163832] bg-[#051F20]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-2xl sm:text-4xl font-bold font-heading text-white">
            Operational Trust Intelligence for AI Agents
          </h2>
          <p className="text-[#8EB69B] text-sm sm:text-base max-w-xl mx-auto">
            Calibrate autonomous agent permissions through observed, audited consistency.
          </p>
          <div className="pt-3">
            <button
              onClick={() => onOpenAuth('signup')}
              className="px-7 py-3 rounded-lg bg-[#5FD3A0] text-[#051F20] font-semibold text-sm hover:bg-[#8EB69B] transition-colors cursor-pointer shadow-md"
            >
              Launch Platform Console
            </button>
          </div>
        </div>
      </section>

      <footer className="py-6 px-6 sm:px-12 border-t border-[#163832] bg-[#051F20] text-xs sm:text-sm text-[#4B635C] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          CREDENCE &middot; Behavioural Trust &amp; Financial Access Intelligence
        </div>
        <div>
          Enterprise Risk &amp; Autonomous Governance
        </div>
      </footer>
    </div>
  );
};
