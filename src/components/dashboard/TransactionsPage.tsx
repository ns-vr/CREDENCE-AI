import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ArrowLeftRight, 
  X, 
  FileSpreadsheet,
  Info
} from 'lucide-react';
import { Transaction } from '../../types/credence';

interface TransactionsPageProps {
  transactions: Transaction[];
  onSelectAgent: (agentId: string) => void;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({
  transactions,
  onSelectAgent
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 25;

  // Filter transactions
  let filtered = transactions.filter(t => {
    if (riskFilter !== 'all' && t.riskLevel !== riskFilter) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        t.id.toLowerCase().includes(q) ||
        t.agentName.toLowerCase().includes(q) ||
        t.counterpartyName.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleExportCsv = () => {
    const csvRows = [
      'TransactionID,AgentCode,AgentName,Counterparty,Category,AmountINR,Status,RiskLevel,FlagReason,Timestamp'
    ];
    filtered.slice(0, 1000).forEach(t => {
      csvRows.push(
        `"${t.id}","${t.agentCode}","${t.agentName}","${t.counterpartyName}","${t.category}",${t.amount},"${t.status}","${t.riskLevel}","${t.flagReason || ''}","${t.timestamp}"`
      );
    });
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `credence_transactions_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in text-sm font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-[var(--border-hairline)]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[var(--text-primary)]">
            Autonomous Transactions Ledger
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Showing {filtered.length} audited transactions across 12 monitored SME AI agents
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2 rounded-xl bg-[var(--brand-moss)] text-white hover:bg-[var(--brand-forest)] transition-all flex items-center gap-2 cursor-pointer font-semibold shadow-xs text-sm"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-sm flex flex-col md:flex-row items-center gap-4 text-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[var(--text-secondary)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search by ID, Agent name, Counterparty, or Category..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-[var(--bg-page)] border border-[var(--border-hairline)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[#2F9E6E]"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={riskFilter}
            onChange={(e) => {
              setRiskFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-sm rounded-xl bg-[var(--bg-page)] border border-[var(--border-hairline)] text-[var(--text-primary)] focus:outline-none focus:border-[#2F9E6E] cursor-pointer"
          >
            <option value="all">All Risk Levels</option>
            <option value="normal">Normal</option>
            <option value="suspicious">Suspicious</option>
            <option value="anomalous">Anomalous</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-sm rounded-xl bg-[var(--bg-page)] border border-[var(--border-hairline)] text-[var(--text-primary)] focus:outline-none focus:border-[#2F9E6E] cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="reversed">Reversed</option>
            <option value="flagged">Flagged</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border-hairline)] text-[var(--text-secondary)] uppercase text-xs font-semibold">
                <th className="pb-3 font-mono">Tx ID</th>
                <th className="pb-3">Agent</th>
                <th className="pb-3">Counterparty</th>
                <th className="pb-3">Category</th>
                <th className="pb-3 font-mono">Amount</th>
                <th className="pb-3 font-mono">Z-Score</th>
                <th className="pb-3">Risk Level</th>
                <th className="pb-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-hairline)]">
              {paginated.map(tx => (
                <tr
                  key={tx.id}
                  onClick={() => setSelectedTx(tx)}
                  className="hover:bg-[var(--bg-page)] cursor-pointer transition-colors"
                >
                  <td className="py-3 font-mono font-bold text-[var(--brand-moss)] dark:text-[#5FD3A0]">
                    {tx.id}
                  </td>
                  <td className="py-3 text-[var(--text-primary)] font-semibold">
                    {tx.agentCode} &middot; {tx.agentName.split(' ')[0]}
                  </td>
                  <td className="py-3 text-[var(--text-secondary)] max-w-[200px] truncate">
                    {tx.counterpartyName}
                  </td>
                  <td className="py-3 text-[var(--text-secondary)]">
                    {tx.category}
                  </td>
                  <td className="py-3 font-mono font-bold text-[var(--text-primary)]">
                    ₹{tx.amount.toLocaleString()}
                  </td>
                  <td className="py-3 font-mono">
                    <span
                      className={`font-semibold ${
                        tx.zScore > 2.5 ? 'text-[#F0506E]' : tx.zScore > 1.5 ? 'text-[#E9B44C]' : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      {tx.zScore.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
                        tx.riskLevel === 'anomalous'
                          ? 'bg-[#F0506E]/20 text-[#F0506E]'
                          : tx.riskLevel === 'suspicious'
                          ? 'bg-[#E9B44C]/20 text-[#E9B44C]'
                          : 'bg-[#2F9E6E]/15 text-[#2F9E6E]'
                      }`}
                    >
                      {tx.riskLevel}
                    </span>
                  </td>
                  <td className="py-3 text-right text-[var(--text-secondary)] text-xs font-mono">
                    {new Date(tx.timestamp).toLocaleDateString()} {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-[var(--border-hairline)] text-xs font-mono text-[var(--text-secondary)]">
          <div>
            Page {page} of {Math.max(1, totalPages)}
          </div>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 rounded-lg border border-[var(--border-hairline)] disabled:opacity-40 hover:bg-[var(--bg-page)]"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 rounded-lg border border-[var(--border-hairline)] disabled:opacity-40 hover:bg-[var(--bg-page)]"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Side Detail Drawer */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[var(--bg-surface)] h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-[var(--border-hairline)] text-[var(--text-primary)]">
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-[var(--border-hairline)] mb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                    Transaction Inspection
                  </span>
                  <h3 className="text-base font-bold font-mono text-[var(--brand-moss)] dark:text-[#5FD3A0]">
                    {selectedTx.id}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedTx(null)}
                  className="p-1 rounded-lg hover:bg-[var(--bg-page)] text-[var(--text-secondary)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div className="p-3 rounded-xl bg-[var(--bg-page)] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Amount:</span>
                    <span className="text-base font-bold text-[var(--text-primary)]">
                      ₹{selectedTx.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Agent:</span>
                    <span className="font-bold text-[var(--text-primary)]">
                      {selectedTx.agentName} ({selectedTx.agentCode})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Recipient:</span>
                    <span className="font-bold text-[var(--text-primary)] truncate max-w-[180px]">
                      {selectedTx.counterpartyName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Category:</span>
                    <span>{selectedTx.category}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[var(--bg-page)] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Z-Score Deviation:</span>
                    <span className="font-bold">{selectedTx.zScore.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Requires Dual-Sign:</span>
                    <span>{selectedTx.requiresApproval ? 'Yes (Threshold exceeded)' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">First-time Vendor:</span>
                    <span>{selectedTx.isNewCounterparty ? 'Yes ⚠' : 'No (Established)'}</span>
                  </div>
                </div>

                {selectedTx.flagReason && (
                  <div className="p-3 rounded-xl bg-[#F0506E]/10 border border-[#F0506E]/30 text-[#F0506E]">
                    <div className="font-bold mb-1">Investigation Flag Reason:</div>
                    <p className="text-[11px] font-sans text-[var(--text-primary)]">
                      {selectedTx.flagReason}
                    </p>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-[var(--bg-page)] border border-[var(--border-hairline)] space-y-1">
                  <div className="font-bold text-[var(--text-primary)]">Attribution Tags:</div>
                  <div className="flex gap-2 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-[var(--brand-mint-mist)]/40 text-[var(--brand-moss)] dark:text-[#5FD3A0] font-bold">
                      FACT: Raw Bank Event
                    </span>
                    {selectedTx.zScore > 2 && (
                      <span className="px-2 py-0.5 rounded bg-[#E9B44C]/20 text-[#E9B44C] font-bold">
                        INFERRED: Statistical Outlier
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border-hairline)] flex gap-2">
              <button
                onClick={() => {
                  onSelectAgent(selectedTx.agentId);
                  setSelectedTx(null);
                }}
                className="w-full py-2.5 rounded-xl bg-[var(--brand-moss)] text-white font-semibold hover:bg-[var(--brand-forest)] text-xs text-center cursor-pointer"
              >
                Inspect Agent Detail &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
