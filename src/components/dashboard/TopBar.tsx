import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  ShieldCheck, 
  AlertTriangle, 
  User, 
  LogOut, 
  ChevronDown,
  Info
} from 'lucide-react';
import { UserRole } from '../../types/credence';

interface TopBarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onSearchChange: (q: string) => void;
  onNavigateTo: (view: string) => void;
  unreadAlertsCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentRole,
  onRoleChange,
  onLogout,
  isDarkMode,
  onToggleTheme,
  onSearchChange,
  onNavigateTo,
  unreadAlertsCount
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [dateRange, setDateRange] = useState('90d');
  const [searchTerm, setSearchTerm] = useState('');

  const roleNames: Record<UserRole, { name: string; title: string }> = {
    owner: { name: 'Devika Sharma', title: 'VP Operations (Owner)' },
    finance_manager: { name: 'Karan Singhal', title: 'Chief Financial Officer' },
    risk_analyst: { name: 'Sanjay Mehta', title: 'Senior Risk Analyst' },
    bank_reviewer: { name: 'Anoop Nair', title: 'Axis Bank SME Reviewer' },
    admin: { name: 'Security Admin', title: 'Platform Security Officer' }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearchChange(e.target.value);
  };

  return (
    <header className="sticky top-0 z-30 w-full h-16 bg-[var(--bg-surface)] border-b border-[var(--border-hairline)] px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Search Input */}
      <div className="flex items-center gap-3 w-full max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[var(--text-secondary)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search agents, counterparties, transactions..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg bg-[var(--bg-page)] border border-[var(--border-hairline)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[#2F9E6E] font-sans transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3.5">
        {/* System Status indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--text-secondary)] border-r border-[var(--border-hairline)] pr-4">
          <span className="w-2 h-2 rounded-full bg-[#2F9E6E]" />
          <span className="font-medium text-[var(--text-primary)] text-xs">Monitoring Active</span>
        </div>

        {/* Date Range Picker */}
        <div className="hidden sm:flex items-center rounded-lg bg-[var(--bg-page)] p-1 border border-[var(--border-hairline)] text-xs sm:text-sm">
          {['7d', '30d', '90d'].map(range => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                dateRange === range
                  ? 'bg-[var(--brand-moss)] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Alerts Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setAlertsOpen(!alertsOpen)}
            className="relative p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-page)] border border-transparent hover:border-[var(--border-hairline)] transition-all cursor-pointer"
            title="Risk Alerts"
          >
            <Bell className="w-5 h-5" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F0506E]" />
            )}
          </button>

          {/* Alerts Dropdown */}
          {alertsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-4 shadow-2xl z-50 animate-fade-in text-xs sm:text-sm">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-[var(--border-hairline)]">
                <span className="font-bold text-[var(--text-primary)] font-heading text-sm">
                  Active Risk Alerts ({unreadAlertsCount})
                </span>
                <button
                  onClick={() => {
                    setAlertsOpen(false);
                    onNavigateTo('monitoring');
                  }}
                  className="text-[#2F9E6E] hover:underline text-xs font-medium cursor-pointer"
                >
                  View All &rarr;
                </button>
              </div>

              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                <div className="p-3 rounded-xl bg-[#F0506E]/10 border border-[#F0506E]/30 text-[var(--text-primary)]">
                  <div className="flex justify-between font-semibold text-[#F0506E] text-xs sm:text-sm">
                    <span>Cyclic Loop Flagged</span>
                    <span className="text-xs uppercase font-medium">Critical</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                    A-04 &rarr; A-05 &rarr; A-06 circular flow of ₹384k recirculated across counterparties.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#E9B44C]/10 border border-[#E9B44C]/30 text-[var(--text-primary)]">
                  <div className="flex justify-between font-semibold text-[#E9B44C] text-xs sm:text-sm">
                    <span>High Deviation Disbursement</span>
                    <span className="text-xs uppercase font-medium">Review</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                    A-03 transferred ₹289,000 to first-time supplier registered 6 days ago.
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-[var(--border-hairline)] text-xs text-[var(--text-secondary)] text-center">
                Continuous agent verification &amp; policy enforcement
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle (Daylight / Deep Forest) */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-page)] border border-transparent hover:border-[var(--border-hairline)] transition-all cursor-pointer"
          title={isDarkMode ? 'Switch to Daylight theme' : 'Switch to Deep Forest theme'}
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-[#E9B44C]" /> : <Moon className="w-5 h-5 text-[#235347]" />}
        </button>

        {/* Profile / Role Selector */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-[var(--bg-page)] border border-[var(--border-hairline)] hover:border-[#2F9E6E]/60 transition-all cursor-pointer text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-[var(--brand-moss)] text-white flex items-center justify-center font-bold text-xs shrink-0">
              {roleNames[currentRole].name.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] truncate max-w-[130px]">
                {roleNames[currentRole].name}
              </div>
              <div className="text-xs text-[var(--text-secondary)]">
                {roleNames[currentRole].title}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-3.5 shadow-2xl z-50 text-xs sm:text-sm animate-fade-in">
              <div className="pb-2.5 border-b border-[var(--border-hairline)] mb-2.5">
                <div className="font-bold text-sm text-[var(--text-primary)]">
                  {roleNames[currentRole].name}
                </div>
                <div className="text-xs text-[var(--text-secondary)]">
                  {roleNames[currentRole].title}
                </div>
              </div>

              <div className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                Switch Perspective:
              </div>
              <div className="space-y-1">
                {(['owner', 'finance_manager', 'risk_analyst', 'bank_reviewer'] as UserRole[]).map(role => (
                  <button
                    key={role}
                    onClick={() => {
                      onRoleChange(role);
                      setProfileOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors flex items-center justify-between cursor-pointer ${
                      currentRole === role
                        ? 'bg-[var(--brand-moss)] text-white font-medium'
                        : 'text-[var(--text-primary)] hover:bg-[var(--bg-page)]'
                    }`}
                  >
                    <span>{roleNames[role].title}</span>
                    {currentRole === role && <span className="text-xs font-semibold">Active</span>}
                  </button>
                ))}
              </div>

              <div className="mt-3 pt-2.5 border-t border-[var(--border-hairline)]">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-2.5 py-2 text-xs sm:text-sm text-[#F0506E] hover:bg-[#F0506E]/10 rounded-lg flex items-center gap-2 cursor-pointer font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Exit to Homepage</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
