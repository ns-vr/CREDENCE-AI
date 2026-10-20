import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/landing/LandingPage';
import { AuthModal } from './components/auth/AuthModal';
import { TopBar } from './components/dashboard/TopBar';
import { Sidebar } from './components/dashboard/Sidebar';
import { OverviewPage } from './components/dashboard/OverviewPage';
import { AgentDetailPage } from './components/dashboard/AgentDetailPage';
import { TransactionsPage } from './components/dashboard/TransactionsPage';
import { TrustGraphPage } from './components/dashboard/TrustGraphPage';
import { AccessRecommendationsPage } from './components/dashboard/AccessRecommendationsPage';
import { SimulatorPage } from './components/dashboard/SimulatorPage';
import { EvidencePassportPage } from './components/dashboard/EvidencePassportPage';
import { MonitoringAlertsPage } from './components/dashboard/MonitoringAlertsPage';
import { PrivacyAuditPage } from './components/dashboard/PrivacyAuditPage';
import { SettingsPage } from './components/dashboard/SettingsPage';
import { Agent, Alert, Transaction, AuditLogEntry, UserRole } from './types/credence';
import { CredenceApi } from './services/apiClient';
import { SEED_AGENTS, SEED_ALERTS, SEED_TRANSACTIONS, SEED_AUDIT_LOGS, SEED_EVIDENCE_ITEMS } from './services/syntheticData';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'dashboard'>('landing');
  const [currentView, setCurrentView] = useState<string>('overview');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [currentRole, setCurrentRole] = useState<UserRole>('owner');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true); // default to Deep Forest for rich visual feel
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Core Data State
  const [agents, setAgents] = useState<Agent[]>(SEED_AGENTS);
  const [alerts, setAlerts] = useState<Alert[]>(SEED_ALERTS);
  const [transactions, setTransactions] = useState<Transaction[]>(SEED_TRANSACTIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(SEED_AUDIT_LOGS);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('agent-a01');
  const [searchQuery, setSearchQuery] = useState('');

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle live data fetch
  useEffect(() => {
    CredenceApi.getAgents().then(res => setAgents(res.agents));
    CredenceApi.getAlerts().then(res => setAlerts(res.alerts));
    CredenceApi.getTransactions().then(res => setTransactions(res.transactions));
    CredenceApi.getAuditLogs().then(res => setAuditLogs(res.logs));
  }, []);

  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleLoginSuccess = (role: UserRole) => {
    setCurrentRole(role);
    setIsAuthOpen(false);
    setCurrentScreen('dashboard');
  };

  const handleSelectAgent = (agentId: string) => {
    setSelectedAgentId(agentId);
    setCurrentView('agent-detail');
  };

  const handleUpdateAlertStatus = (alertId: string, status: 'new' | 'reviewing' | 'resolved') => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status } : a));
    CredenceApi.updateAlertStatus(alertId, status, currentRole);
  };

  const handleOverrideLimit = (agentId: string, newLimit: number, reason: string) => {
    setAgents(prev => prev.map(a => a.id === agentId ? { ...a, currentLimit: newLimit } : a));
    
    // Add audit log entry
    const newLog: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: currentRole === 'owner' ? 'Devika Sharma' : 'Karan Singhal',
      role: currentRole,
      action: 'HUMAN_ACCESS_OVERRIDE',
      targetType: 'limit',
      targetId: agentId,
      details: `Autonomous limit adjusted to ₹${newLimit.toLocaleString()}. Reason: "${reason}".`,
      ipAddress: '192.168.1.100'
    };
    setAuditLogs(prev => [newLog, ...prev]);

    CredenceApi.overrideAccess({
      agentId,
      decision: 'MAINTAIN',
      customLimit: newLimit,
      reason,
      actor: newLog.actor,
      actorRole: currentRole
    });
  };

  const handleResetData = () => {
    setAgents(SEED_AGENTS);
    setAlerts(SEED_ALERTS);
    setTransactions(SEED_TRANSACTIONS);
    setAuditLogs(SEED_AUDIT_LOGS);
  };

  const unreadAlertsCount = alerts.filter(a => a.status === 'new').length;
  const currentAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors text-sm sm:text-base">
      {currentScreen === 'landing' ? (
        <>
          <LandingPage
            onEnterApp={() => setCurrentScreen('dashboard')}
            onOpenAuth={handleOpenAuth}
          />
          <AuthModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
            initialMode={authMode}
            onLoginSuccess={handleLoginSuccess}
          />
        </>
      ) : (
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar
            currentView={currentView}
            onSelectView={(view) => setCurrentView(view)}
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          {/* Main Body */}
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <TopBar
              currentRole={currentRole}
              onRoleChange={(role) => setCurrentRole(role)}
              onLogout={() => setCurrentScreen('landing')}
              isDarkMode={isDarkMode}
              onToggleTheme={() => setIsDarkMode(!isDarkMode)}
              onSearchChange={(q) => setSearchQuery(q)}
              onNavigateTo={(view) => setCurrentView(view)}
              unreadAlertsCount={unreadAlertsCount}
            />

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              {currentView === 'overview' && (
                <OverviewPage
                  agents={agents}
                  alerts={alerts}
                  transactions={transactions}
                  onSelectAgent={handleSelectAgent}
                  onNavigateTo={(view) => setCurrentView(view)}
                />
              )}

              {currentView === 'agent-detail' && (
                <AgentDetailPage
                  agent={currentAgent}
                  transactions={transactions.filter(t => t.agentId === currentAgent.id)}
                  evidenceItems={SEED_EVIDENCE_ITEMS.filter(e => e.agentId === currentAgent.id)}
                  onBack={() => setCurrentView('agents')}
                  onOpenPassport={(id) => {
                    setSelectedAgentId(id);
                    setCurrentView('passport');
                  }}
                  onOverrideLimit={handleOverrideLimit}
                />
              )}

              {currentView === 'agents' && (
                <OverviewPage
                  agents={agents}
                  alerts={alerts}
                  transactions={transactions}
                  onSelectAgent={handleSelectAgent}
                  onNavigateTo={(view) => setCurrentView(view)}
                />
              )}

              {currentView === 'transactions' && (
                <TransactionsPage
                  transactions={transactions}
                  onSelectAgent={handleSelectAgent}
                />
              )}

              {currentView === 'graph' && (
                <TrustGraphPage
                  onSelectAgent={handleSelectAgent}
                />
              )}

              {currentView === 'access' && (
                <AccessRecommendationsPage
                  agents={agents}
                  onSelectAgent={handleSelectAgent}
                  onOverrideLimit={handleOverrideLimit}
                />
              )}

              {currentView === 'simulator' && (
                <SimulatorPage
                  agents={agents}
                  onSelectAgent={handleSelectAgent}
                />
              )}

              {currentView === 'passport' && (
                <EvidencePassportPage
                  agents={agents}
                  selectedAgentId={selectedAgentId}
                  onSelectAgent={(id) => setSelectedAgentId(id)}
                />
              )}

              {currentView === 'monitoring' && (
                <MonitoringAlertsPage
                  alerts={alerts}
                  onUpdateAlertStatus={handleUpdateAlertStatus}
                  onSelectAgent={handleSelectAgent}
                />
              )}

              {currentView === 'audit' && (
                <PrivacyAuditPage
                  auditLogs={auditLogs}
                />
              )}

              {currentView === 'settings' && (
                <SettingsPage
                  onResetData={handleResetData}
                />
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
