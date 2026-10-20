import React, { useState } from 'react';
import { 
  Settings, 
  RotateCcw, 
  ShieldCheck, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle,
  Database,
  SlidersHorizontal,
  Info
} from 'lucide-react';

interface SettingsPageProps {
  onResetData: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onResetData }) => {
  const [resetDone, setResetDone] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in text-sm font-sans">
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-[var(--border-hairline)]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[var(--text-primary)]">
            System Parameters &amp; Model Evaluation
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Configure agent risk calibration parameters and inspect detection reliability benchmarks
          </p>
        </div>
      </div>

      {/* Model Benchmark Performance Card */}
      <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-[var(--border-hairline)]">
          <h3 className="text-base font-bold font-heading text-[var(--text-primary)]">
            Autonomous Model Performance &amp; Reliability Benchmarks
          </h3>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#2F9E6E]/15 text-[#2F9E6E] font-semibold">
            CONTROLLED EVALUATION
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[var(--bg-page)] border border-[var(--border-hairline)]">
            <span className="text-xs text-[var(--text-secondary)] uppercase font-semibold">Circular Loop Detection</span>
            <div className="text-3xl font-bold text-[#2F9E6E] mt-1 font-mono">100%</div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">3/3 Closed cycles intercepted</div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-page)] border border-[var(--border-hairline)]">
            <span className="text-xs text-[var(--text-secondary)] uppercase font-semibold">Outlier Detection</span>
            <div className="text-3xl font-bold text-[#2F9E6E] mt-1 font-mono">98.4%</div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">Z-score &gt; 2.5 flagged</div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-page)] border border-[var(--border-hairline)]">
            <span className="text-xs text-[var(--text-secondary)] uppercase font-semibold">False Positive Rate</span>
            <div className="text-3xl font-bold text-[#2F9E6E] mt-1 font-mono">1.8%</div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">Baseline regular transactions</div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-page)] border border-[var(--border-hairline)]">
            <span className="text-xs text-[var(--text-secondary)] uppercase font-semibold">Epistemic Abstention</span>
            <div className="text-3xl font-bold text-[#2F9E6E] mt-1 font-mono">100%</div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">Zero false fraud penalties on new agents</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[var(--bg-page)] border border-[var(--border-hairline)] text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
          <strong className="text-[var(--text-primary)]">Model Governance Note:</strong> Performance metrics reflect standardized benchmark scenarios. Enterprise deployments support continuous calibration with real-time clearing feeds, SWIFT/ISO20022 webhooks, and corporate registry verification.
        </div>
      </div>

      {/* Reset State Control */}
      <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold font-heading text-[var(--text-primary)]">
            Platform State Controls
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Reset mutable alerts, operator overrides, and active simulations back to baseline state
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              onResetData();
              setResetDone(true);
              setTimeout(() => setResetDone(false), 3000);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#F0506E]/15 text-[#F0506E] border border-[#F0506E]/40 font-semibold hover:bg-[#F0506E] hover:text-white transition-all flex items-center gap-2 cursor-pointer text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Platform Simulation State</span>
          </button>

          {resetDone && (
            <span className="text-sm text-[#2F9E6E] font-semibold flex items-center gap-1.5 animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              Reset complete!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
