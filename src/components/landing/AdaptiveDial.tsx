import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

export const AdaptiveDial: React.FC = () => {
  const [riskSlider, setRiskSlider] = useState<number>(20); // 0 (safest) to 100 (high anomaly)

  // Dynamic calculations based on Credence access engine rules
  const trustScore = Math.max(10, Math.min(98, Math.round(100 - riskSlider * 0.85)));
  
  let recommendation = 'MAINTAIN';
  let limit = 500000;
  let threshold = 250000;
  let statusColor = '#2F9E6E';
  let statusLabel = 'MAINTAIN';

  if (trustScore >= 85) {
    recommendation = 'INCREASE_CAUTIOUSLY';
    limit = 625000;
    threshold = 300000;
    statusColor = '#5FD3A0';
    statusLabel = 'INCREASE (+25%)';
  } else if (trustScore >= 65) {
    recommendation = 'MAINTAIN';
    limit = 500000;
    threshold = 250000;
    statusColor = '#8EB69B';
    statusLabel = 'MAINTAIN BASELINE';
  } else if (trustScore >= 40) {
    recommendation = 'REQUIRE_APPROVAL';
    limit = 250000;
    threshold = 50000;
    statusColor = '#E9B44C';
    statusLabel = 'DUAL-SIGN REQUIRED';
  } else {
    recommendation = 'RESTRICT';
    limit = 50000;
    threshold = 0;
    statusColor = '#F0506E';
    statusLabel = 'RESTRICTED';
  }

  return (
    <div className="rounded-lg p-6 bg-[#0B2B26] border border-[#163832] flex flex-col md:flex-row items-center gap-8">
      {/* Dial SVG Instrument */}
      <div className="relative flex flex-col items-center justify-center w-52 h-52 shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle track */}
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#163832"
            strokeWidth="6"
            fill="none"
            strokeDasharray="188 62"
            strokeLinecap="butt"
          />
          {/* Active progress arc */}
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke={statusColor}
            strokeWidth="6"
            fill="none"
            strokeDasharray={`${(trustScore / 100) * 188} 250`}
            strokeLinecap="butt"
            className="transition-all duration-200 ease-out"
          />
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-bold font-mono text-white">
            {trustScore}
          </span>
          <span className="text-[10px] uppercase font-mono text-[#8EB69B] mt-0.5 tracking-wider">
            TRUST INDEX
          </span>
          <span 
            className="text-[10px] font-mono font-semibold tracking-wider mt-1.5"
            style={{ color: statusColor }}
          >
            [{statusLabel}]
          </span>
        </div>
      </div>

      {/* Controls & Metrics */}
      <div className="flex-1 w-full space-y-4">
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
            <span className="text-white flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#E9B44C]" />
              ANOMALY INTENSITY INPUT
            </span>
            <span className="text-[#8EB69B]">{riskSlider}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={riskSlider}
            onChange={(e) => setRiskSlider(Number(e.target.value))}
            className="w-full h-1.5 bg-[#163832] rounded appearance-none cursor-pointer accent-[#5FD3A0]"
          />
          <div className="flex justify-between text-[10px] text-[#4B635C] mt-1 font-mono">
            <span>0% (BENIGN)</span>
            <span>50% (DRIFT)</span>
            <span>100% (CRITICAL)</span>
          </div>
        </div>

        {/* Decision Output Matrix */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-md bg-[#051F20] border border-[#163832]">
            <div className="text-[10px] uppercase font-mono text-[#8EB69B]">Autonomous Limit</div>
            <div className="text-lg font-bold font-mono text-white mt-0.5">
              ₹{limit.toLocaleString()}
            </div>
            <div className="text-[10px] text-[#4B635C] mt-0.5 font-mono">Automated disbursement cap</div>
          </div>

          <div className="p-3 rounded-md bg-[#051F20] border border-[#163832]">
            <div className="text-[10px] uppercase font-mono text-[#8EB69B]">Approval Threshold</div>
            <div className="text-lg font-bold font-mono text-white mt-0.5">
              ₹{threshold.toLocaleString()}
            </div>
            <div className="text-[10px] text-[#4B635C] mt-0.5 font-mono">Co-sign required above this</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#8EB69B] bg-[#051F20] p-2.5 rounded-md border border-[#163832] font-mono text-[11px]">
          <ShieldCheck className="w-4 h-4 text-[#5FD3A0] shrink-0" />
          <span>
            {recommendation === 'INCREASE_CAUTIOUSLY' && 'Consistent unblemished execution justifies audited limit expansion.'}
            {recommendation === 'MAINTAIN' && 'Agent cadence adheres to historical distribution.'}
            {recommendation === 'REQUIRE_APPROVAL' && 'Variance drift detected: disbursements require human co-signing.'}
            {recommendation === 'RESTRICT' && 'Severe anomaly detected: autonomous outflow suspended.'}
          </span>
        </div>
      </div>
    </div>
  );
};
