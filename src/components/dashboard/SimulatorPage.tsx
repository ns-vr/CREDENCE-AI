import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, 
  Play, 
  RotateCcw, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  TrendingDown, 
  TrendingUp, 
  Sliders,
  CheckCircle2,
  XCircle,
  Network
} from 'lucide-react';
import { Agent, SimulationScenario, SimulationResult } from '../../types/credence';
import { CredenceApi } from '../../services/apiClient';

interface SimulatorPageProps {
  agents: Agent[];
  onSelectAgent: (agentId: string) => void;
}

export const SimulatorPage: React.FC<SimulatorPageProps> = ({ agents, onSelectAgent }) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || 'agent-a01');
  const [scenario, setScenario] = useState<SimulationScenario>({
    spendSpikeMultiplier: 1.0,
    addSuspiciousCounterparty: false,
    repeatedFailures: false,
    compromisedPermissions: false,
    coordinatedMultiAgent: false,
    staleEvidence: false
  });

  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Run simulation dynamically whenever scenario or selected agent changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    CredenceApi.runSimulation(selectedAgentId, scenario).then(res => {
      if (isMounted) {
        setSimulationResult(res);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedAgentId, scenario]);

  const handleReset = () => {
    setScenario({
      spendSpikeMultiplier: 1.0,
      addSuspiciousCounterparty: false,
      repeatedFailures: false,
      compromisedPermissions: false,
      coordinatedMultiAgent: false,
      staleEvidence: false
    });
  };

  const selectedAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  return (
    <div className="space-y-6 animate-fade-in text-sm font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-[var(--border-hairline)]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[var(--text-primary)]">
              What-If Behavioural Stress Simulator
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[var(--brand-mint-mist)]/40 text-[var(--brand-moss)] dark:text-[#5FD3A0] text-xs font-semibold">
              Dynamic Recalibration
            </span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Simulate risk perturbations to observe before-and-after trust score recalibrations and dynamic access limits
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-primary)] hover:border-[#2F9E6E] transition-all flex items-center gap-2 cursor-pointer font-semibold shadow-xs text-xs sm:text-sm"
        >
          <RotateCcw className="w-4 h-4 text-[#2F9E6E]" />
          <span>Reset Scenario</span>
        </button>
      </div>

      {/* Target Agent Selector */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="font-bold text-[var(--text-primary)] font-heading text-sm sm:text-base">
            Target Agent Under Stress:
          </span>
          <select
            value={selectedAgentId}
            onChange={(e) => setSelectedAgentId(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-[var(--bg-page)] border border-[var(--border-hairline)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[#2F9E6E] cursor-pointer"
          >
            {agents.map(a => (
              <option key={a.id} value={a.id}>
                {a.code} &middot; {a.name} (Current: {a.trustScore}/100)
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs sm:text-sm text-[var(--text-secondary)]">
          Baseline Spending Cap: <strong className="text-[var(--text-primary)] font-mono">₹{selectedAgent.currentLimit.toLocaleString()}</strong>
        </div>
      </div>

      {/* 2-Column: Left Controls vs Right Live Before/After */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Stress Controls */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-[var(--border-hairline)]">
            <h3 className="text-base font-bold font-heading text-[var(--text-primary)]">
              Simulation Stress Injections
            </h3>
            <span className="text-xs text-[var(--text-secondary)]">
              Real-time calibration
            </span>
          </div>

          {/* Spend Spike Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-sm text-[var(--text-primary)]">
                Sudden Spend Spike Multiplier
              </label>
              <span className="font-mono text-sm text-[#2F9E6E] font-bold">
                {scenario.spendSpikeMultiplier.toFixed(1)}x
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="4.0"
              step="0.5"
              value={scenario.spendSpikeMultiplier}
              onChange={(e) => setScenario({ ...scenario, spendSpikeMultiplier: parseFloat(e.target.value) })}
              className="w-full h-2 bg-[var(--bg-page)] rounded-lg appearance-none cursor-pointer accent-[#2F9E6E]"
            />
            <div className="flex justify-between text-xs text-[var(--text-secondary)]">
              <span>1.0x (Normal)</span>
              <span>2.5x (Outlier)</span>
              <span>4.0x (Extreme Surge)</span>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="space-y-3 pt-2">
            {/* Toggle 1: Suspicious Counterparty */}
            <label className="flex items-start justify-between p-3.5 rounded-xl bg-[var(--bg-page)] border border-[var(--border-hairline)] cursor-pointer hover:border-[#2F9E6E] transition-all">
              <div className="mr-3">
                <span className="font-semibold text-sm text-[var(--text-primary)] block">
                  Add Suspicious Offshore Supplier
                </span>
                <span className="text-xs text-[var(--text-secondary)] mt-0.5 block leading-normal">
                  Inject 8 high-velocity transfers to freshly incorporated shell entity
                </span>
              </div>
              <input
                type="checkbox"
                checked={scenario.addSuspiciousCounterparty}
                onChange={(e) => setScenario({ ...scenario, addSuspiciousCounterparty: e.target.checked })}
                className="mt-1 w-4 h-4 rounded border-[var(--border-hairline)] text-[#2F9E6E] focus:ring-0 cursor-pointer"
              />
            </label>

            {/* Toggle 2: Repeated Failures / Reversals */}
            <label className="flex items-start justify-between p-3.5 rounded-xl bg-[var(--bg-page)] border border-[var(--border-hairline)] cursor-pointer hover:border-[#2F9E6E] transition-all">
              <div className="mr-3">
                <span className="font-semibold text-[var(--text-primary)] block">
                  Repeated Failures &amp; Reversals
                </span>
                <span className="text-[11px] text-[var(--text-secondary)]">
                  Simulate gateway timeouts, bad account numbers, and chargeback bounce spikes
                </span>
              </div>
              <input
                type="checkbox"
                checked={scenario.repeatedFailures}
                onChange={(e) => setScenario({ ...scenario, repeatedFailures: e.target.checked })}
                className="mt-1 w-4 h-4 rounded border-[var(--border-hairline)] text-[#2F9E6E] focus:ring-0 cursor-pointer"
              />
            </label>

            {/* Toggle 3: Coordinated Multi-Agent Cycle */}
            <label className="flex items-start justify-between p-3 rounded-xl bg-[var(--bg-page)] border border-[var(--border-hairline)] cursor-pointer hover:border-[#2F9E6E] transition-all">
              <div className="mr-3">
                <span className="font-semibold text-[var(--text-primary)] block">
                  Coordinated Circular Loop Pattern
                </span>
                <span className="text-[11px] text-[var(--text-secondary)]">
                  Bind agent into closed triangular fund recirculations with sister agents
                </span>
              </div>
              <input
                type="checkbox"
                checked={scenario.coordinatedMultiAgent}
                onChange={(e) => setScenario({ ...scenario, coordinatedMultiAgent: e.target.checked })}
                className="mt-1 w-4 h-4 rounded border-[var(--border-hairline)] text-[#2F9E6E] focus:ring-0 cursor-pointer"
              />
            </label>

            {/* Toggle 4: Stale Evidence & Expired Credentials */}
            <label className="flex items-start justify-between p-3 rounded-xl bg-[var(--bg-page)] border border-[var(--border-hairline)] cursor-pointer hover:border-[#2F9E6E] transition-all">
              <div className="mr-3">
                <span className="font-semibold text-[var(--text-primary)] block">
                  Stale Evidence Telemetry
                </span>
                <span className="text-[11px] text-[var(--text-secondary)]">
                  Simulate expired mTLS certificates and telemetry gap &gt; 60 days
                </span>
              </div>
              <input
                type="checkbox"
                checked={scenario.staleEvidence}
                onChange={(e) => setScenario({ ...scenario, staleEvidence: e.target.checked })}
                className="mt-1 w-4 h-4 rounded border-[var(--border-hairline)] text-[#2F9E6E] focus:ring-0 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Right: Before vs After Recalculation Results */}
        <div className="lg:col-span-7 space-y-6">
          {simulationResult && (
            <>
              {/* Before vs After Cards */}
              <div className="grid grid-cols-2 gap-4">
                {/* BEFORE */}
                <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                      Current Baseline
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[var(--bg-page)] text-[10px] font-mono font-bold">
                      BEFORE
                    </span>
                  </div>

                  <div className="text-3xl font-bold font-mono text-[var(--text-primary)] my-2">
                    {simulationResult.before.trustScore}
                    <span className="text-xs text-[var(--text-secondary)] font-normal">/100</span>
                  </div>

                  <div className="space-y-1 font-mono text-[11px] text-[var(--text-secondary)]">
                    <div className="flex justify-between">
                      <span>Access Action:</span>
                      <strong className="text-[var(--text-primary)]">
                        {simulationResult.before.recommendation.replace(/_/g, ' ')}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Spending Limit:</span>
                      <strong className="text-[var(--text-primary)]">
                        ₹{simulationResult.before.recommendedLimit.toLocaleString()}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* AFTER */}
                <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border-2 border-[#2F9E6E]/60 shadow-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#2F9E6E] font-bold">
                      Simulated Recalibration
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#2F9E6E]/20 text-[#2F9E6E] text-[10px] font-mono font-bold">
                      AFTER STRESS
                    </span>
                  </div>

                  <div className="text-3xl font-bold font-mono text-[var(--text-primary)] my-2 flex items-baseline gap-2">
                    <span>{simulationResult.after.trustScore}</span>
                    <span
                      className={`text-sm font-bold flex items-center ${
                        simulationResult.after.trustScoreDelta >= 0 ? 'text-[#2F9E6E]' : 'text-[#F0506E]'
                      }`}
                    >
                      {simulationResult.after.trustScoreDelta >= 0 ? (
                        <TrendingUp className="w-4 h-4 mr-0.5" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-0.5" />
                      )}
                      {simulationResult.after.trustScoreDelta > 0
                        ? `+${simulationResult.after.trustScoreDelta}`
                        : simulationResult.after.trustScoreDelta} pts
                    </span>
                  </div>

                  <div className="space-y-1 font-mono text-[11px] text-[var(--text-secondary)]">
                    <div className="flex justify-between">
                      <span>New Decision:</span>
                      <strong className="text-[#F0506E]">
                        {simulationResult.after.recommendation.replace(/_/g, ' ')}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Updated Limit:</span>
                      <strong className="text-[var(--text-primary)]">
                        ₹{simulationResult.after.recommendedLimit.toLocaleString()}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Triggered Rules & Graph Impact */}
              <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-sm space-y-4">
                <h4 className="text-sm font-bold font-heading text-[var(--text-primary)]">
                  Simulated Circuit Breakers Triggered
                </h4>

                {simulationResult.triggeredRules.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {simulationResult.triggeredRules.map(rule => (
                      <span
                        key={rule}
                        className="px-2.5 py-1 rounded-lg bg-[#F0506E]/15 text-[#F0506E] border border-[#F0506E]/30 text-xs font-mono font-bold"
                      >
                        {rule}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-[var(--bg-page)] text-[11px] text-[#2F9E6E] flex items-center gap-2 font-mono">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>No negative circuit rules triggered in baseline parameters.</span>
                  </div>
                )}

                {/* Graph Impact */}
                <div className="pt-3 border-t border-[var(--border-hairline)]">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-[var(--text-secondary)]">Simulated Network Graph Impact:</span>
                    <span className="font-bold text-[var(--text-primary)]">
                      {simulationResult.graphImpact.addedEdgesCount} edges perturbed
                    </span>
                  </div>
                  {simulationResult.graphImpact.cycleDetected && (
                    <div className="mt-2 p-2.5 rounded-xl bg-[#F0506E]/10 border border-[#F0506E]/30 text-[#F0506E] text-xs font-mono">
                      ⚠ Tarjan cycle detector flagged circular flow between agents: {simulationResult.graphImpact.flaggedNodes.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
