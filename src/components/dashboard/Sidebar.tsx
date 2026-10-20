import React from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  ArrowLeftRight, 
  Network, 
  SlidersHorizontal, 
  FlaskConical, 
  FileCheck2, 
  Activity, 
  ShieldCheck, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Cpu
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  isCollapsed,
  onToggleCollapse
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'agents', label: 'Agent Directory', icon: Bot, count: 12 },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'graph', label: 'Trust Graph', icon: Network, highlight: true },
    { id: 'access', label: 'Limit Modulation', icon: SlidersHorizontal },
    { id: 'simulator', label: 'Stress Simulator', icon: FlaskConical },
    { id: 'passport', label: 'Evidence Passport', icon: FileCheck2 },
    { id: 'monitoring', label: 'Continuous Monitor', icon: Activity, alertCount: 3 },
    { id: 'audit', label: 'Privacy & Audit', icon: ShieldCheck },
    { id: 'settings', label: 'System Parameters', icon: Settings }
  ];

  return (
    <aside
      className={`relative z-20 h-screen bg-[var(--bg-surface)] border-r border-[var(--border-hairline)] flex flex-col justify-between transition-all duration-200 ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--border-hairline)]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-[#163832] border border-[#235347] flex items-center justify-center shrink-0 text-[#5FD3A0]">
              <ShieldCheck className="w-5 h-5 text-[#5FD3A0]" />
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <span className="text-base font-bold tracking-tight font-heading text-[var(--text-primary)] block">
                  CREDENCE
                </span>
                <span className="text-xs text-[var(--text-secondary)] block tracking-normal">
                  Agent Trust &amp; Access
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-page)] transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="p-2.5 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#163832] text-white border border-[#235347]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-page)]'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-[#5FD3A0]' : 'text-[var(--text-secondary)]'
                  } ${item.highlight && !isActive ? 'text-[#2F9E6E]' : ''}`}
                />
                {!isCollapsed && (
                  <span className="flex-1 text-left truncate font-sans text-sm">{item.label}</span>
                )}
                {!isCollapsed && item.count && (
                  <span className="text-xs font-sans px-2 py-0.5 rounded-full bg-[var(--bg-page)] text-[var(--text-secondary)]">
                    {item.count}
                  </span>
                )}
                {!isCollapsed && item.alertCount && (
                  <span className="text-xs font-sans px-2 py-0.5 rounded-full bg-[#F0506E]/20 text-[#F0506E] font-semibold">
                    {item.alertCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status Panel */}
      {!isCollapsed && (
        <div className="p-3.5 m-3 rounded-xl bg-[var(--bg-page)] border border-[var(--border-hairline)] text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-2 text-[var(--text-primary)] font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-[#2F9E6E]" />
            <span className="text-xs">Policy Engine Active</span>
          </div>
          <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
            Continuous agent verification and autonomous limit controls.
          </p>
        </div>
      )}
    </aside>
  );
};
