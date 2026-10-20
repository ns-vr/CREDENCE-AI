import React, { useState } from 'react';
import { 
  FileCheck2, 
  Printer, 
  Download, 
  ShieldCheck, 
  Cpu, 
  CheckCircle2, 
  Lock, 
  QrCode,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { Agent, EvidencePassport } from '../../types/credence';
import { generateEvidencePassport } from '../../services/syntheticData';

interface EvidencePassportPageProps {
  agents: Agent[];
  selectedAgentId?: string;
  onSelectAgent: (id: string) => void;
}

export const EvidencePassportPage: React.FC<EvidencePassportPageProps> = ({
  agents,
  selectedAgentId,
  onSelectAgent
}) => {
  const [currentAgentId, setCurrentAgentId] = useState<string>(selectedAgentId || agents[0]?.id || 'agent-a01');
  const passport: EvidencePassport = generateEvidencePassport(currentAgentId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in text-sm font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-[var(--border-hairline)] print:hidden">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[var(--text-primary)]">
              Agent Evidence &amp; Trust Passport
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#2F9E6E]/15 text-[#2F9E6E] text-xs font-semibold">
              SHA-256 Attested
            </span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Exportable compliance dossier for bank credit underwriters and executive audits
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={currentAgentId}
            onChange={(e) => setCurrentAgentId(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[#2F9E6E] cursor-pointer"
          >
            {agents.map(a => (
              <option key={a.id} value={a.id}>
                {a.code} &middot; {a.name}
              </option>
            ))}
          </select>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-[var(--brand-moss)] text-white hover:bg-[var(--brand-forest)] transition-all flex items-center gap-2 cursor-pointer font-semibold shadow-xs text-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Document Sheet */}
      <div className="max-w-4xl mx-auto p-8 sm:p-10 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-xl text-[var(--text-primary)] print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="flex justify-between items-start pb-6 border-b-2 border-[var(--brand-moss)]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--brand-moss)] text-white flex items-center justify-center font-bold shrink-0">
              <ShieldCheck className="w-8 h-8 text-[#5FD3A0]" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-[#2F9E6E] font-bold block mb-0.5">
                CREDENCE BEHAVIOURAL TRUST ATTESTATION
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[var(--text-primary)]">
                {passport.agent.name}
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                Agent ID: {passport.agent.code} &middot; Organization: {passport.agent.businessName}
              </p>
            </div>
          </div>

          <div className="text-right text-xs sm:text-sm">
            <div className="text-xs text-[var(--text-secondary)] uppercase font-medium">ISSUED AT</div>
            <div className="font-semibold text-[var(--text-primary)]">{new Date(passport.issuedAt).toLocaleDateString()}</div>
            <div className="text-xs text-[#2F9E6E] font-semibold mt-1">STATUS: CRYPTOGRAPHICALLY ATTESTED</div>
          </div>
        </div>

        {/* Passport Score Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-6 p-6 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-hairline)]">
          <div>
            <span className="text-xs uppercase text-[var(--text-secondary)] font-semibold">Trust Index</span>
            <div className="text-4xl font-bold font-mono text-[var(--brand-moss)] dark:text-[#5FD3A0] mt-1">
              {passport.assessment.trustScore}<span className="text-lg text-[var(--text-secondary)]">/100</span>
            </div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">
              Confidence Score: {Math.round(passport.assessment.confidence * 100)}%
            </div>
          </div>

          <div>
            <span className="text-xs uppercase text-[var(--text-secondary)] font-semibold">Recommended Policy</span>
            <div className="text-lg sm:text-xl font-bold font-heading text-[var(--text-primary)] mt-1">
              {passport.assessment.recommendation.replace(/_/g, ' ')}
            </div>
            <div className="text-xs text-[var(--text-secondary)] mt-1 font-mono">
              Limit: ₹{passport.assessment.recommendedLimit.toLocaleString()}
            </div>
          </div>

          <div>
            <span className="text-xs uppercase text-[var(--text-secondary)] font-semibold">Dual-Sign Threshold</span>
            <div className="text-lg sm:text-xl font-bold font-mono text-[var(--text-primary)] mt-1">
              ₹{passport.assessment.approvalThreshold.toLocaleString()}
            </div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">
              Requires 2 verified approvers
            </div>
          </div>
        </div>

        {/* 90-Day Behavioural Statistics */}
        <div className="mb-6 space-y-3">
          <h4 className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-bold">
            1. 90-Day Behavioural Performance
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
            <div className="p-3.5 rounded-xl bg-[var(--bg-page)] border border-[var(--border-hairline)]">
              <span className="text-xs text-[var(--text-secondary)] block">Total Outflows</span>
              <div className="font-bold text-base text-[var(--text-primary)] mt-1 font-mono">
                ₹{(passport.behaviouralSummary.total90dSpend / 100000).toFixed(1)}L
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-[var(--bg-page)] border border-[var(--border-hairline)]">
              <span className="text-xs text-[var(--text-secondary)] block">Total Transactions</span>
              <div className="font-bold text-base text-[var(--text-primary)] mt-1 font-mono">
                {passport.behaviouralSummary.total90dTxCount}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-[var(--bg-page)] border border-[var(--border-hairline)]">
              <span className="text-xs text-[var(--text-secondary)] block">Completion Rate</span>
              <div className="font-bold text-base text-[#2F9E6E] mt-1 font-mono">
                {passport.behaviouralSummary.successRate}%
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-[var(--bg-page)] border border-[var(--border-hairline)]">
              <span className="text-xs text-[var(--text-secondary)] block">Reversal / Dispute Rate</span>
              <div className="font-bold text-base text-[var(--text-primary)] mt-1 font-mono">
                {passport.behaviouralSummary.reversalRate}%
              </div>
            </div>
          </div>
        </div>

        {/* Evidence Dimensions */}
        <div className="mb-6 space-y-3">
          <h4 className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-bold">
            2. Verified Evidence Sources &amp; Telemetry
          </h4>
          <div className="space-y-2">
            {passport.evidenceItems.map(item => (
              <div key={item.id} className="p-3 rounded-xl bg-[var(--bg-page)] border border-[var(--border-hairline)] flex justify-between items-center text-xs sm:text-sm">
                <div>
                  <span className="font-bold uppercase text-[var(--brand-moss)] dark:text-[#5FD3A0] mr-2">
                    [{item.dimension}]
                  </span>
                  <span className="text-[var(--text-primary)]">{item.description}</span>
                </div>
                <div className="text-right shrink-0 ml-3 font-mono font-bold text-[var(--text-primary)]">
                  {item.score}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integrity Hash & QR Verification */}
        <div className="mt-8 pt-6 border-t-2 border-[var(--border-hairline)] flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="space-y-1.5 text-xs text-[var(--text-secondary)]">
            <div>
              <strong className="text-[var(--text-primary)]">Cryptographic Attestation Hash:</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-[var(--bg-page)] text-[#2F9E6E] break-all select-all font-mono text-xs">
              {passport.integrityHash}
            </div>
            <div className="text-xs pt-1 leading-relaxed">
              {passport.limitationsNote}
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border border-[var(--border-hairline)] text-center shrink-0 shadow-xs">
            <svg viewBox="0 0 24 24" className="w-16 h-16 text-[#051F20] mx-auto" fill="currentColor">
              <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm10 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2zm2-2h2v2h-2v-2zm-6-2h2v2h-2v-2zm6-4h2v2h-2v-2zm-2 0h2v2h-2v-2z" />
            </svg>
            <span className="text-xs font-mono text-black font-semibold block mt-1">
              SCAN TO VERIFY
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
