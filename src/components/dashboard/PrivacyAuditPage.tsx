import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  KeyRound, 
  FileCheck2, 
  Search, 
  Download, 
  AlertCircle,
  Database,
  Building
} from 'lucide-react';
import { AuditLogEntry } from '../../types/credence';

interface PrivacyAuditPageProps {
  auditLogs: AuditLogEntry[];
}

export const PrivacyAuditPage: React.FC<PrivacyAuditPageProps> = ({ auditLogs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [targetFilter, setTargetFilter] = useState('all');

  const filteredLogs = auditLogs.filter(log => {
    if (targetFilter !== 'all' && log.targetType !== targetFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        log.actor.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in text-sm font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-[var(--border-hairline)]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[var(--text-primary)]">
            Privacy Governance &amp; Immutable Audit Trail
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Field-level data minimisation, RBAC permissions matrix, and compliance logs
          </p>
        </div>
      </div>

      {/* Environment Status Grid */}
      <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-[var(--brand-mint-mist)]/30 border border-[#2F9E6E]/40 text-[#2F9E6E] dark:bg-[#163832] dark:border-[#235347] dark:text-[#5FD3A0]">
          <div className="flex justify-between items-center mb-1.5">
            <span className="font-bold font-heading text-sm sm:text-base">Active Governance Environment</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#2F9E6E] text-white font-semibold">
              CONNECTED
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-primary)]">
            Continuous behavioural audit trail covering 12 enterprise AI agents and 5,040 transactions.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-page)] border border-[var(--border-hairline)] text-[var(--text-secondary)] opacity-75">
          <div className="flex justify-between items-center mb-1.5">
            <span className="font-bold font-heading text-sm sm:text-base flex items-center gap-2 text-[var(--text-primary)]">
              <Lock className="w-4 h-4" /> Core Banking Gateway
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--border-hairline)] text-[var(--text-secondary)] font-medium">
              READY FOR WEBHOOKS
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Integrates with standard SWIFT/ISO20022 and corporate banking clearing feeds.
          </p>
        </div>
      </div>

      {/* RBAC Permissions Matrix */}
      <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-sm">
        <h3 className="text-base font-bold font-heading text-[var(--text-primary)] mb-4">
          Role-Based Access Control (RBAC) &amp; Data Minimisation Matrix
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border-hairline)] text-[var(--text-secondary)] uppercase text-xs font-semibold">
                <th className="pb-3">Role</th>
                <th className="pb-3 text-center">Agent Limits</th>
                <th className="pb-3 text-center">Raw Transaction Items</th>
                <th className="pb-3 text-center">Override Limits</th>
                <th className="pb-3 text-center">Export PDF Passports</th>
                <th className="pb-3 text-center">Audit Logs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-hairline)]">
              {[
                { role: 'Business Owner (Devika)', limits: 'Full View', tx: 'Full View', override: 'Authorized', passport: 'Authorized', audit: 'View Only' },
                { role: 'Finance Manager (Karan)', limits: 'Full View', tx: 'Full View', override: 'Authorized', passport: 'Authorized', audit: 'View Only' },
                { role: 'Risk Analyst (Sanjay)', limits: 'Full View', tx: 'Full View', override: 'Propose Only', passport: 'Authorized', audit: 'Full View' },
                { role: 'Bank Reviewer (Anoop)', limits: 'Aggregates', tx: 'Masked/Anonymized', override: 'Blocked', passport: 'Authorized (Attested)', audit: 'Export Only' },
                { role: 'System Admin', limits: 'Configuration', tx: 'Metadata Only', override: 'Blocked', passport: 'Blocked', audit: 'Full View' }
              ].map(row => (
                <tr key={row.role} className="hover:bg-[var(--bg-page)]">
                  <td className="py-3 font-semibold text-[var(--text-primary)]">{row.role}</td>
                  <td className="py-3 text-center text-[var(--text-secondary)]">{row.limits}</td>
                  <td className="py-3 text-center text-[var(--text-secondary)]">{row.tx}</td>
                  <td className="py-3 text-center font-bold text-[#2F9E6E]">{row.override}</td>
                  <td className="py-3 text-center text-[var(--text-secondary)]">{row.passport}</td>
                  <td className="py-3 text-center text-[var(--text-secondary)]">{row.audit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Immutable Audit Log Table */}
      <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold font-heading text-[var(--text-primary)]">
              Cryptographic Audit Trail ({filteredLogs.length})
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Append-only tamper-evident compliance log of all operator decisions and limit calibrations
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={targetFilter}
              onChange={(e) => setTargetFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-[var(--bg-page)] border border-[var(--border-hairline)] text-xs sm:text-sm font-medium cursor-pointer"
            >
              <option value="all">All Targets</option>
              <option value="agent">Agent</option>
              <option value="limit">Limit Change</option>
              <option value="transaction">Transaction</option>
              <option value="auth">Auth / Session</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border-hairline)] text-[var(--text-secondary)] uppercase text-xs font-semibold">
                <th className="pb-3">Timestamp</th>
                <th className="pb-3">Actor &amp; Role</th>
                <th className="pb-3">Action</th>
                <th className="pb-3">Target</th>
                <th className="pb-3">Details &amp; Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-hairline)]">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-[var(--bg-page)]">
                  <td className="py-3 text-[var(--text-secondary)] text-xs font-mono whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString()} &middot; {new Date(log.timestamp).toLocaleDateString()}
                  </td>
                  <td className="py-3 text-[var(--text-primary)] font-semibold">
                    {log.actor} <span className="text-xs text-[var(--text-secondary)] font-normal">[{log.role.toUpperCase()}]</span>
                  </td>
                  <td className="py-3 text-[#2F9E6E] font-semibold text-xs sm:text-sm font-mono">
                    {log.action}
                  </td>
                  <td className="py-3 text-[var(--text-secondary)] font-mono text-xs">
                    {log.targetType}:{log.targetId}
                  </td>
                  <td className="py-3 text-[var(--text-primary)] max-w-md text-xs sm:text-sm">
                    {log.details}
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
