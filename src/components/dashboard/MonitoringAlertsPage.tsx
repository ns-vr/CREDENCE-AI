import React, { useState } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Sliders, 
  Check, 
  X,
  Info
} from 'lucide-react';
import { Alert } from '../../types/credence';
import { CredenceApi } from '../../services/apiClient';

interface MonitoringAlertsPageProps {
  alerts: Alert[];
  onUpdateAlertStatus: (alertId: string, status: 'new' | 'reviewing' | 'resolved') => void;
  onSelectAgent: (agentId: string) => void;
}

export const MonitoringAlertsPage: React.FC<MonitoringAlertsPageProps> = ({
  alerts,
  onUpdateAlertStatus,
  onSelectAgent
}) => {
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Config sliders
  const [zScoreSensitivity, setZScoreSensitivity] = useState(2.5);
  const [freshnessWindowDays, setFreshnessWindowDays] = useState(60);
  const [failureThresholdPct, setFailureThresholdPct] = useState(5.0);

  const filtered = alerts.filter(a => {
    if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in text-sm font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-[var(--border-hairline)]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[var(--text-primary)]">
              Continuous Monitoring &amp; Alert Orchestration
            </h1>
            <span className="w-2.5 h-2.5 rounded-full bg-[#5FD3A0]" />
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Real-time behavioural variance detection and circuit breaker workflow
          </p>
        </div>
      </div>

      {/* Grid: Alert Feed & Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Alerts Stream */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[var(--border-hairline)]">
            <h3 className="text-base font-bold font-heading text-[var(--text-primary)]">
              Risk Events &amp; Anomaly Stream ({filtered.length})
            </h3>

            <div className="flex items-center gap-2">
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[var(--bg-page)] border border-[var(--border-hairline)] text-xs sm:text-sm font-medium cursor-pointer"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="caution">Caution</option>
                <option value="info">Info</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[var(--bg-page)] border border-[var(--border-hairline)] text-xs sm:text-sm font-medium cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="reviewing">Under Review</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filtered.map(alert => (
              <div
                key={alert.id}
                className="p-4 sm:p-5 rounded-xl bg-[var(--bg-page)] border border-[var(--border-hairline)] space-y-2.5 hover:border-[#2F9E6E]/50 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-sm font-bold text-[var(--brand-moss)] dark:text-[#5FD3A0]">
                        {alert.agentCode}
                      </span>
                      <span className="font-semibold text-sm sm:text-base text-[var(--text-primary)]">
                        {alert.agentName}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase ${
                          alert.severity === 'critical'
                            ? 'bg-[#F0506E]/20 text-[#F0506E]'
                            : alert.severity === 'caution'
                            ? 'bg-[#E9B44C]/20 text-[#E9B44C]'
                            : 'bg-[#8EB69B]/20 text-[#8EB69B]'
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </div>
                    <span className="text-xs text-[var(--text-secondary)] mt-0.5 block">
                      Rule: {alert.ruleTriggered} &middot; {alert.timestamp}
                    </span>
                  </div>

                  {/* Workflow buttons */}
                  <div className="flex items-center gap-2 text-xs">
                    {alert.status !== 'resolved' && (
                      <button
                        onClick={() => onUpdateAlertStatus(alert.id, 'resolved')}
                        className="px-3 py-1.5 rounded-lg bg-[#2F9E6E] text-white hover:bg-[#235347] font-semibold cursor-pointer shadow-2xs"
                      >
                        Resolve ✓
                      </button>
                    )}
                    {alert.status === 'new' && (
                      <button
                        onClick={() => onUpdateAlertStatus(alert.id, 'reviewing')}
                        className="px-3 py-1.5 rounded-lg border border-[var(--border-hairline)] text-[var(--text-primary)] hover:bg-[var(--bg-surface)] cursor-pointer font-medium"
                      >
                        Mark Reviewing
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                  {alert.description}
                </p>

                <div className="pt-2.5 flex justify-between items-center text-xs text-[var(--text-secondary)] border-t border-[var(--border-hairline)]">
                  <span>Evidence Trace: Hardware Attestation Log</span>
                  <button
                    onClick={() => onSelectAgent(alert.agentId)}
                    className="text-[#2F9E6E] hover:underline font-semibold cursor-pointer"
                  >
                    Inspect Agent Profile &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Threshold Governance Settings */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-sm space-y-6">
          <div className="pb-2 border-b border-[var(--border-hairline)]">
            <h3 className="text-sm font-bold font-heading text-[var(--text-primary)]">
              Circuit Breaker Thresholds
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-mono">
              Configure automated governance tolerances
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-[var(--text-primary)]">Z-Score Outlier Trigger</span>
                <span className="font-mono text-[#2F9E6E] font-bold">{zScoreSensitivity.toFixed(1)}σ</span>
              </div>
              <input
                type="range"
                min="1.5"
                max="4.0"
                step="0.1"
                value={zScoreSensitivity}
                onChange={(e) => setZScoreSensitivity(parseFloat(e.target.value))}
                className="w-full h-2 bg-[var(--bg-page)] rounded-lg appearance-none accent-[#2F9E6E]"
              />
              <span className="text-[10px] text-[var(--text-secondary)] block font-mono mt-0.5">
                Transactions deviating &gt; {zScoreSensitivity}σ require human dual-sign.
              </span>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-[var(--text-primary)]">Evidence Freshness Window</span>
                <span className="font-mono text-[#2F9E6E] font-bold">{freshnessWindowDays} Days</span>
              </div>
              <input
                type="range"
                min="14"
                max="90"
                step="1"
                value={freshnessWindowDays}
                onChange={(e) => setFreshnessWindowDays(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-[var(--bg-page)] rounded-lg appearance-none accent-[#2F9E6E]"
              />
              <span className="text-[10px] text-[var(--text-secondary)] block font-mono mt-0.5">
                Credentials unrotated &gt; {freshnessWindowDays} days trigger automatic confidence decay.
              </span>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-[var(--text-primary)]">Failure Rate Circuit Breaker</span>
                <span className="font-mono text-[#2F9E6E] font-bold">{failureThresholdPct.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="15.0"
                step="0.5"
                value={failureThresholdPct}
                onChange={(e) => setFailureThresholdPct(parseFloat(e.target.value))}
                className="w-full h-2 bg-[var(--bg-page)] rounded-lg appearance-none accent-[#2F9E6E]"
              />
              <span className="text-[10px] text-[var(--text-secondary)] block font-mono mt-0.5">
                Gateways exceeding {failureThresholdPct}% failure pause autonomous disbursements.
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--bg-page)] border border-[var(--border-hairline)] text-[11px] text-[var(--text-secondary)] flex items-start gap-2">
            <Info className="w-4 h-4 text-[#2F9E6E] shrink-0 mt-0.5" />
            <span>
              All threshold changes are cryptographically hashed and broadcast to bank monitoring endpoints.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
