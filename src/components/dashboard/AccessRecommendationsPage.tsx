import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  FileCheck2, 
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Scale
} from 'lucide-react';
import { Agent, AccessRecommendation } from '../../types/credence';
import { generateEvidencePassport } from '../../services/syntheticData';

interface AccessRecommendationsPageProps {
  agents: Agent[];
  onSelectAgent: (agentId: string) => void;
  onOverrideLimit: (agentId: string, newLimit: number, reason: string) => void;
}

export const AccessRecommendationsPage: React.FC<AccessRecommendationsPageProps> = ({
  agents,
  onSelectAgent,
  onOverrideLimit
}) => {
  const [selectedAgentForOverride, setSelectedAgentForOverride] = useState<Agent | null>(null);
  const [customLimit, setCustomLimit] = useState<number>(0);
  const [overrideReason, setOverrideReason] = useState<string>('');

  const handleOpenOverride = (agent: Agent) => {
    setSelectedAgentForOverride(agent);
    setCustomLimit(agent.recommendedLimit);
    setOverrideReason('');
  };

  const handleSubmitOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgentForOverride || !overrideReason.trim()) return;
    onOverrideLimit(selectedAgentForOverride.id, customLimit, overrideReason);
    setSelectedAgentForOverride(null);
  };

  return (
    <div className="space-y-6 animate-fade-in text-sm font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-[var(--border-hairline)]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[var(--text-primary)]">
            Adaptive Access &amp; Autonomy Recommendations
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Calibrating spending limits from verified consistency &middot; Human supervisor dual-sign required for overrides
          </p>
        </div>
      </div>

      {/* Grid of Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map(agent => {
          const passport = generateEvidencePassport(agent.id);
          const assessment = passport.assessment;
          const isHighTrust = assessment.trustScore >= 80;
          const isAbstained = assessment.abstained;
          const isRestricted = assessment.recommendation === 'RESTRICT';

          return (
            <div
              key={agent.id}
              className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-sm flex flex-col justify-between hover:border-[#2F9E6E]/60 transition-all"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="font-mono text-xs text-[#2F9E6E] font-bold">
                      {agent.code}
                    </span>
                    <h3 className="text-base font-bold font-heading text-[var(--text-primary)] mt-0.5">
                      {agent.name}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      {agent.businessName}
                    </p>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
                      isRestricted
                        ? 'bg-[#F0506E]/15 text-[#F0506E]'
                        : isAbstained
                        ? 'bg-[var(--text-secondary)]/20 text-[var(--text-secondary)]'
                        : isHighTrust
                        ? 'bg-[#2F9E6E]/15 text-[#2F9E6E]'
                        : 'bg-[#E9B44C]/15 text-[#E9B44C]'
                    }`}
                  >
                    {assessment.recommendation.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Score and Limits */}
                <div className="grid grid-cols-2 gap-3 my-3 p-3.5 rounded-xl bg-[var(--bg-page)] font-mono">
                  <div>
                    <span className="text-xs text-[var(--text-secondary)] uppercase font-semibold">
                      Current Active
                    </span>
                    <div className="text-base font-bold text-[var(--text-primary)] mt-0.5">
                      ₹{agent.currentLimit.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-[var(--text-secondary)] uppercase font-semibold">
                      Recommended
                    </span>
                    <div className="text-base font-bold text-[#2F9E6E] mt-0.5">
                      ₹{assessment.recommendedLimit.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-[var(--text-secondary)]">
                  <div className="flex justify-between">
                    <span>Trust Index:</span>
                    <span className="font-bold text-[var(--text-primary)] font-mono">{assessment.trustScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Evidence Confidence:</span>
                    <span className="font-bold text-[var(--text-primary)] font-mono">{Math.round(assessment.confidence * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dual-Sign Gate:</span>
                    <span className="font-bold text-[var(--text-primary)] font-mono">₹{assessment.approvalThreshold.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-3.5 p-3 rounded-xl bg-[var(--bg-page)] text-xs sm:text-sm leading-relaxed text-[var(--text-primary)] border border-[var(--border-hairline)]">
                  {isAbstained && (
                    <span className="text-[#8EB69B]">
                      <strong>Epistemic Abstention:</strong> Missing historical telemetry is not fraud, but limits cannot be safely automated.
                    </span>
                  )}
                  {assessment.recommendation === 'INCREASE_CAUTIOUSLY' && (
                    <span className="text-[#2F9E6E]">
                      Consistently unblemished execution over {agent.createdDaysAgo} days earns +25% autonomous ceiling increase.
                    </span>
                  )}
                  {assessment.recommendation === 'MAINTAIN' && (
                    <span>
                      Operating reliably within expected standard deviations. Maintain baseline limit.
                    </span>
                  )}
                  {assessment.recommendation === 'REQUIRE_APPROVAL' && (
                    <span className="text-[#E9B44C]">
                      Elevated reversal rate or vendor variance observed. Outflows require supervisor co-signing.
                    </span>
                  )}
                  {assessment.recommendation === 'RESTRICT' && (
                    <span className="text-[#F0506E]">
                      Critical cyclic loop detected. Autonomous permissions paused pending review.
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[var(--border-hairline)]">
                <button
                  onClick={() => onSelectAgent(agent.id)}
                  className="flex-1 py-1.5 rounded-lg border border-[var(--border-hairline)] text-[var(--text-primary)] hover:bg-[var(--bg-page)] text-center font-medium"
                >
                  Detail
                </button>
                <button
                  onClick={() => handleOpenOverride(agent)}
                  className="flex-1 py-1.5 rounded-lg bg-[var(--brand-moss)] text-white hover:bg-[var(--brand-forest)] text-center font-medium cursor-pointer shadow-sm"
                >
                  Override Limit
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Human Override Modal */}
      {selectedAgentForOverride && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-2xl p-6 shadow-2xl text-[var(--text-primary)]">
            <h3 className="text-base font-bold font-heading mb-1">
              Override Autonomous Limit · {selectedAgentForOverride.code}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mb-4 font-mono">
              Adjusting limits requires a logged rationale recorded in the immutable audit trail.
            </p>

            <form onSubmit={handleSubmitOverride} className="space-y-4 font-sans text-xs">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                  New Autonomous Spending Limit (₹)
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
                  Reason for Override
                </label>
                <textarea
                  required
                  rows={3}
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="e.g. Authorized special inventory seasonal surge after checking warehouse supply agreement..."
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-page)] border border-[var(--border-hairline)] text-[var(--text-primary)] focus:outline-none focus:border-[#2F9E6E]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAgentForOverride(null)}
                  className="px-3 py-2 rounded-xl border border-[var(--border-hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[var(--brand-moss)] text-white font-semibold hover:bg-[var(--brand-forest)] cursor-pointer"
                >
                  Confirm &amp; Log Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
