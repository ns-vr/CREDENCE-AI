import React, { useState } from 'react';
import { ShieldCheck, Cpu, ArrowRightLeft, Check } from 'lucide-react';

export const EvidencePassportCard: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="perspective-1000 w-full max-w-md mx-auto h-[400px] select-none cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
      <div 
        className={`relative w-full h-full duration-500 transition-transform transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* FRONT SIDE */}
        <div className="absolute inset-0 backface-hidden rounded-lg bg-[#0B2B26] border border-[#235347] p-6 text-[#DAF1DE] flex flex-col justify-between shadow-lg">
          {/* Header */}
          <div className="flex justify-between items-start pb-3 border-b border-[#163832]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#163832] border border-[#235347] flex items-center justify-center text-[#5FD3A0]">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#8EB69B] uppercase block">
                  ATTESTED IDENTITY
                </span>
                <h4 className="text-sm font-bold font-heading text-white">
                  Nova Procurement Bot
                </h4>
              </div>
            </div>
            <div className="text-right font-mono text-[10px] text-[#5FD3A0]">
              [TIER-1 CLEARANCE]
            </div>
          </div>

          {/* Central Trust Score Stamp */}
          <div className="py-4 my-auto flex items-center justify-between">
            <div>
              <div className="text-4xl font-bold font-mono text-white">94<span className="text-sm text-[#8EB69B]">/100</span></div>
              <div className="text-[11px] font-mono text-[#8EB69B] mt-0.5">BEHAVIOURAL TRUST INDEX</div>
            </div>
            <div className="text-right text-[11px] font-mono space-y-0.5">
              <div className="text-[#DAF1DE]">85 Days Monitored</div>
              <div className="text-[#8EB69B]">₹3.84M Evaluated</div>
              <div className="text-[#5FD3A0] flex items-center justify-end gap-1 mt-1">
                <Check className="w-3 h-3" /> 0 Chargebacks
              </div>
            </div>
          </div>

          {/* Dimension Grid */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono py-1">
            <div className="p-2 rounded bg-[#051F20] border border-[#163832]">
              <div className="text-[#8EB69B] text-[9px]">FRESHNESS</div>
              <div className="text-white font-bold">98%</div>
            </div>
            <div className="p-2 rounded bg-[#051F20] border border-[#163832]">
              <div className="text-[#8EB69B] text-[9px]">COVERAGE</div>
              <div className="text-white font-bold">95%</div>
            </div>
            <div className="p-2 rounded bg-[#051F20] border border-[#163832]">
              <div className="text-[#8EB69B] text-[9px]">INTEGRITY</div>
              <div className="text-white font-bold">96%</div>
            </div>
          </div>

          {/* Footer Card */}
          <div className="pt-2 flex items-center justify-between text-xs font-mono text-[#8EB69B] border-t border-[#163832]">
            <div className="flex items-center gap-1.5 text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#5FD3A0]" />
              <span>SHA-256 ENCLAVE PROOF</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-white hover:text-[#5FD3A0] transition-colors">
              <ArrowRightLeft className="w-3 h-3" />
              <span>[CLICK TO INSPECT]</span>
            </div>
          </div>
        </div>

        {/* BACK SIDE */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-lg bg-[#051F20] border border-[#2F9E6E]/60 p-6 text-[#DAF1DE] flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#163832]">
              <span className="text-[10px] font-mono tracking-widest text-[#5FD3A0] uppercase">
                HARDWARE ENCLAVE PROOF
              </span>
              <span className="text-[10px] font-mono text-[#8EB69B]">RECORD VERIFIED</span>
            </div>
            <h5 className="text-xs font-semibold text-white mb-3 font-mono">
              TPM Attestation &amp; Clearing Webhooks
            </h5>

            <div className="space-y-1.5 text-[11px] font-mono text-[#8EB69B]">
              <div className="flex justify-between border-b border-[#163832] pb-1">
                <span>Agent Identifier</span>
                <span className="text-white">A-01-NOVA-8810</span>
              </div>
              <div className="flex justify-between border-b border-[#163832] pb-1">
                <span>Enclave Hash</span>
                <span className="text-[#5FD3A0] truncate max-w-[150px]">7f9a2e8c1b4d0e6f...</span>
              </div>
              <div className="flex justify-between border-b border-[#163832] pb-1">
                <span>Issued UTC</span>
                <span className="text-white">2026-10-20 05:00</span>
              </div>
              <div className="flex justify-between">
                <span>Access Status</span>
                <span className="text-[#5FD3A0] font-bold">INCREASE_CAUTIOUSLY</span>
              </div>
            </div>
          </div>

          {/* QR Code and Technical Seal */}
          <div className="p-3 bg-[#0B2B26] rounded-md border border-[#163832] flex items-center gap-3">
            <div className="w-12 h-12 bg-white p-1 rounded shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-full h-full text-[#051F20]" fill="currentColor">
                <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm10 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2zm2-2h2v2h-2v-2zm-6-2h2v2h-2v-2zm6-4h2v2h-2v-2zm-2 0h2v2h-2v-2z" />
              </svg>
            </div>
            <div className="text-[10px] font-mono text-[#8EB69B] leading-tight">
              <span className="text-white font-medium block">Verification Payload</span>
              Tamper-evident audit chain anchored to enterprise bank ledger.
            </div>
          </div>

          <div className="text-[10px] text-center text-[#4B635C] font-mono">
            Click anywhere to return
          </div>
        </div>
      </div>
    </div>
  );
};
