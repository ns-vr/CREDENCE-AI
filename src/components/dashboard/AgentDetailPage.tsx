import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Bot, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sliders, 
  FileText, 
  Check, 
  Lock, 
  FileCheck2,
  TrendingDown,
  TrendingUp,
  Cpu,
  Fingerprint
} from 'lucide-react';
import { Agent, Transaction, EvidenceItem, Assessment } from '../../types/credence';
import { CredenceRiskEngine } from '../../services/riskEngine';
import { SEED_PERMISSIONS } from '../../services/syntheticData';

interface AgentDetailPageProps {
  agent: Agent;
  transactions: Transaction[];
  evidenceItems: EvidenceItem[];
  onBack: () => void;
  onOpenPassport: (agentId: string) => void;
  onOverrideLimit: (agentId: string, newLimit: number, reason: string) => void;
}

export const AgentDetailPage: React.FC<AgentDetailPageProps> = ({
  agent,
  transactions,
  evidenceItems,
  onBack,
  onOpenPassport,
  onOverrideLimit
}) => {
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [customLimit, setCustomLimit] = useState(agent.recommendedLimit);
  const [overrideReason, setOverrideReason] = useState('');

  const permissions = SEED_PERMISSIONS.find(p => p.agentId === agent.id);
  const isCycle = ['agent-a04', 'agent-a05', 'agent-a06'].includes(agent.id);
  const assessment: Assessment = CredenceRiskEngine.assessAgent(
    agent, 
    transactions, 
    evidenceItems, 
    isCycle, 
    ['A-04', 'A-05', 'A-06']
  );

  const handleSaveOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideReason.trim()) return;
    onOverrideLimit(agent.id, customLimit, overrideReason);
    setOverrideModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in text-sm font-sans">
      {/* Back button & Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-[var(--border-hairline)]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[#2F9E6E] transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-sm text-[#2F9E6E] font-bold">
                {agent.code}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[var(--text-primary)]">
                {agent.name}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                  agent.status === 'active'
                    ? 'bg-[#2F9E6E]/15 text-[#2F9E6E]'
                    : agent.status === 'restricted'
                    ? 'bg-[#F0506E]/15 text-[#F0506E]'
                    : 'bg-[#E9B44C]/15 text-[#E9B44C]'
                }`}
              >
                {agent.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mt-0.5">
              {agent.purpose} &middot; {agent.businessName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onOpenPassport(agent.id)}
            className="px-3.5 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-primary)] hover:border-[#2F9E6E] transition-all flex items-center gap-2 cursor-pointer font-semibold text-xs sm:text-sm shadow-xs"
          >
            <FileCheck2 className="w-4 h-4 text-[#2F9E6E]" />
            <span>Generate Passport</span>
          </button>
          <button
            onClick={() => setOverrideModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[var(--brand-moss)] text-white hover:bg-[var(--brand-forest)] transition-all font-semibold cursor-pointer shadow-xs text-xs sm:text-sm"
          >
            Human Override / Approve
          </button>
        </div>
      </div>

      {/* Top Banner: Decision & Trust Score */}
      <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <span className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
            Trust Score
          </span>
          <div className="text-4xl font-bold font-mono-numbers text-[var(--text-primary)] mt-1 flex items-baseline gap-1">
            <span className={assessment.trustScore >= 80 ? 'text-[#2F9E6E]' : assessment.trustScore >= 50 ? 'text-[#E9B44C]' : 'text-[#F0506E]'}>
              {assessment.trustScore}
            </span>
            <span className="text-sm text-[var(--text-secondary)]">/ 100</span>
          </div>
          <div className="text-xs text-[var(--text-secondary)] mt-1 font-mono">
            Confidence: {Math.round(assessment.confidence * 100)}%
          </div>
        </div>

        <div>
          <span className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
            Access Recommendation
          </span>
          <div className="text-lg font-bold text-[var(--text-primary)] mt-1 font-heading">
            {assessment.recommendation.replace(/_/g, ' ')}
          </div>
          <div className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
            {assessment.abstained 
              ? 'Epistemic Abstention: Insufficient history to determine baseline.' 
              : 'Calibrated from statistical behaviour + graph.'}
          </div>
        </div>

        <div>
          <span className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
            Autonomous Spending Cap
          </span>
          <div className="text-2xl font-bold font-mono text-[var(--text-primary)] mt-1">
            ₹{assessment.recommendedLimit.toLocaleString()}
          </div>
          <div className="text-xs text-[var(--text-secondary)] mt-1 font-mono">
            Current Cap: ₹{agent.currentLimit.toLocaleString()}
          </div>
        </div>

        <div>
          <span className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
            Dual-Person Approval Gate
          </span>
          <div className="text-2xl font-bold font-mono text-[var(--text-primary)] mt-1">
            ₹{assessment.approvalThreshold.toLocaleString()}
          </div>
          <div className="text-xs text-[var(--text-secondary)] mt-1">
            Transactions above this require 2 approvals
          </div>
        </div>
      </div>

      {/* Grid: Factor Contributions (SHAP-style) & Baseline Variance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SHAP-style Explainable Contributions */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-base font-bold font-heading text-[var(--text-primary)]">
                Explainable Score Attribution (SHAP-Style)
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                Decomposing the trust score into verifiable positive and negative contributors
              </p>
            </div>
            <span className="text-xs text-[#2F9E6E] font-semibold">
              Zero Black Box
            </span>
          </div>

          <div className="space-y-3 font-mono">
            {assessment.topFactors.map((factor, i) => {
              const isPositive = factor.contribution >= 0;
              return (
                <div key={i} className="p-3 rounded-xl bg-[var(--bg-page)] border border-[var(--border-hairline)]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-[var(--text-primary)]">
                      {factor.factor}
                    </span>
                    <span
                      className={`font-bold text-xs ${
                        isPositive ? 'text-[#2F9E6E]' : 'text-[#F0506E]'
                      }`}
                    >
                      {isPositive ? `+${factor.contribution}` : factor.contribution} pts
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-normal font-sans">
                    {factor.description}
                  </p>
                </div>
              );
            })}
          </div>

          {assessment.triggeredRules.length > 0 && (
            <div className="mt-4 pt-3 border-t border-[var(--border-hairline)]">
              <span className="text-[11px] font-mono uppercase text-[#F0506E] font-bold block mb-1.5">
                Triggered Governance Circuit Rules:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {assessment.triggeredRules.map(rule => (
                  <span
                    key={rule}
                    className="px-2 py-0.5 rounded-md bg-[#F0506E]/10 text-[#F0506E] border border-[#F0506E]/30 text-[10px] font-mono"
                  >
                    {rule}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Identity & Scope Permissions */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-sm space-y-4">
          <h3 className="text-sm font-bold font-heading text-[var(--text-primary)]">
            Hardware &amp; Policy Scope Enclave
          </h3>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between p-2 rounded-lg bg-[var(--bg-page)]">
              <span className="text-[var(--text-secondary)]">TPM Enclave Binding:</span>
              <span className="text-[#2F9E6E] font-bold">Hardware-Attested ✓</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-[var(--bg-page)]">
              <span className="text-[var(--text-secondary)]">Discretionary Monthly Cap:</span>
              <span className="text-[var(--text-primary)] font-bold">₹{(permissions?.monthlyCap || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-[var(--bg-page)]">
              <span className="text-[var(--text-secondary)]">Max Single Outflow:</span>
              <span className="text-[var(--text-primary)] font-bold">₹{(permissions?.maxSingleTransaction || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-[var(--bg-page)]">
              <span className="text-[var(--text-secondary)]">Auto-Approve Verified Vendors:</span>
              <span className="text-[var(--text-primary)] font-bold">{permissions?.autoApproveVerifiedSuppliers ? 'Enabled' : 'Disabled'}</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-[var(--bg-page)]">
              <span className="text-[var(--text-secondary)]">International Remittance:</span>
              <span className="text-[var(--text-primary)] font-bold">{permissions?.allowInternational ? 'Permitted' : 'Blocked'}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--bg-page)] border border-[var(--border-hairline)] text-[11px] text-[var(--text-secondary)] space-y-1">
            <div className="font-bold text-[var(--text-primary)]">Allowed Categories:</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {permissions?.allowedCategories.map(cat => (
                <span key={cat} className="px-1.5 py-0.5 rounded bg-[var(--brand-mint-mist)]/30 text-[var(--brand-moss)] dark:text-[#5FD3A0] text-[10px] font-mono">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Evidence Items Provenance Table */}
      <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-sm">
        <h3 className="text-sm font-bold font-heading text-[var(--text-primary)] mb-3">
          Evidence Items &amp; Telemetry Provenance ({evidenceItems.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[var(--border-hairline)] text-[var(--text-secondary)] uppercase text-[10px]">
                <th className="pb-2 font-semibold">Dimension</th>
                <th className="pb-2 font-semibold">Source</th>
                <th className="pb-2 font-semibold">Observed Description</th>
                <th className="pb-2 font-semibold text-center">Score</th>
                <th className="pb-2 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-hairline)]">
              {evidenceItems.map(item => (
                <tr key={item.id} className="hover:bg-[var(--bg-page)]">
                  <td className="py-2.5 font-bold uppercase text-[var(--brand-moss)] dark:text-[#5FD3A0]">
                    {item.dimension}
                  </td>
                  <td className="py-2.5 text-[var(--text-secondary)]">
                    {item.source}
                  </td>
                  <td className="py-2.5 text-[var(--text-primary)] max-w-md font-sans">
                    {item.description}
                  </td>
                  <td className="py-2.5 text-center font-bold">
                    {item.score}%
                  </td>
                  <td className="py-2.5 text-right">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'verified'
                          ? 'bg-[#2F9E6E]/15 text-[#2F9E6E]'
                          : item.status === 'stale'
                          ? 'bg-[#E9B44C]/15 text-[#E9B44C]'
                          : 'bg-[#F0506E]/15 text-[#F0506E]'
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Human Override Modal */}
      {overrideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-2xl p-6 shadow-2xl text-[var(--text-primary)]">
            <h3 className="text-base font-bold font-heading mb-1">
              Human Override Access Limit
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mb-4 font-mono">
              All manual overrides are immutably recorded in the compliance audit log.
            </p>

            <form onSubmit={handleSaveOverride} className="space-y-4 font-sans text-xs">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                  Adjusted Autonomous Spending Limit (₹)
                </label>
                <input
                  type="number"
                  required
                  value={customLimit}
                  onChange={(e) => setCustomLimit(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-page)] border border-[var(--border-hairline)] text-[var(--text-primary)] font-mono text-sm focus:outline-none focus:border-[#2F9E6E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                  Mandatory Operational Justification
                </label>
                <textarea
                  required
                  rows={3}
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="e.g. Authorized quarterly vendor settlement after manual PO verification by VP Operations..."
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-page)] border border-[var(--border-hairline)] text-[var(--text-primary)] focus:outline-none focus:border-[#2F9E6E]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOverrideModalOpen(false)}
                  className="px-3 py-2 rounded-xl border border-[var(--border-hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[var(--brand-moss)] text-white font-semibold hover:bg-[var(--brand-forest)] cursor-pointer"
                >
                  Sign &amp; Log Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
