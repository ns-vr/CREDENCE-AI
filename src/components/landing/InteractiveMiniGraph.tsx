import React, { useState } from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';

interface MiniNode {
  id: string;
  name: string;
  role: 'agent' | 'owner' | 'counterparty';
  x: number;
  y: number;
  risk: 'low' | 'review' | 'high';
  trustScore?: number;
}

export const InteractiveMiniGraph: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<MiniNode | null>(null);

  const nodes: MiniNode[] = [
    { id: 'n1', name: 'Nexus Corp (Owner)', role: 'owner', x: 200, y: 50, risk: 'low' },
    { id: 'n2', name: 'Nova Procurement (A-01)', role: 'agent', x: 100, y: 150, risk: 'low', trustScore: 94 },
    { id: 'n3', name: 'AWS Cloud APAC', role: 'counterparty', x: 50, y: 260, risk: 'low' },
    { id: 'n4', name: 'Delta Logistics (A-04)', role: 'agent', x: 260, y: 160, risk: 'high', trustScore: 34 },
    { id: 'n5', name: 'Starlight DSP (A-05)', role: 'agent', x: 350, y: 240, risk: 'high', trustScore: 36 },
    { id: 'n6', name: 'Zenith Disburser (A-06)', role: 'agent', x: 240, y: 280, risk: 'high', trustScore: 32 }
  ];

  const edges = [
    { from: 'n1', to: 'n2', color: '#235347', isLoop: false },
    { from: 'n2', to: 'n3', color: '#2F9E6E', isLoop: false },
    { from: 'n1', to: 'n4', color: '#235347', isLoop: false },
    // Circular loop edges between n4, n5, n6
    { from: 'n4', to: 'n5', color: '#F0506E', isLoop: true },
    { from: 'n5', to: 'n6', color: '#F0506E', isLoop: true },
    { from: 'n6', to: 'n4', color: '#F0506E', isLoop: true }
  ];

  return (
    <div className="relative w-full rounded-lg bg-[#0B2B26] border border-[#163832] p-4 overflow-hidden">
      <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#163832]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#5FD3A0]" />
          <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
            TOPOLOGY INSPECTOR // SUBNET PREVIEW
          </h4>
        </div>
        <span className="text-[10px] text-[#8EB69B] font-mono">
          [HOVER TO INSPECT]
        </span>
      </div>

      <div className="relative w-full h-[300px] bg-[#051F20] rounded border border-[#163832] flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 400 320" className="w-full h-full">
          {/* Edges */}
          {edges.map((edge, idx) => {
            const src = nodes.find(n => n.id === edge.from)!;
            const dst = nodes.find(n => n.id === edge.to)!;
            return (
              <g key={`edge-${idx}`}>
                <line
                  x1={src.x}
                  y1={src.y}
                  x2={dst.x}
                  y2={dst.y}
                  stroke={edge.color}
                  strokeWidth={edge.isLoop ? 2 : 1}
                  strokeDasharray={edge.isLoop ? '4 3' : undefined}
                />
                {edge.isLoop && (
                  <circle
                    cx={(src.x + dst.x) / 2}
                    cy={(src.y + dst.y) / 2}
                    r="2.5"
                    fill="#F0506E"
                  />
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map(node => {
            const isSelected = selectedNode?.id === node.id;
            const fill = node.risk === 'high' ? '#F0506E' : node.role === 'agent' ? '#5FD3A0' : node.role === 'owner' ? '#235347' : '#8EB69B';
            return (
              <g
                key={node.id}
                className="cursor-pointer"
                onMouseEnter={() => setSelectedNode(node)}
                onClick={() => setSelectedNode(node)}
              >
                {isSelected && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="14"
                    fill="none"
                    stroke={fill}
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                )}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="7"
                  fill={fill}
                  stroke="#051F20"
                  strokeWidth="1.5"
                />
                <text
                  x={node.x}
                  y={node.y + 16}
                  textAnchor="middle"
                  fill="#DAF1DE"
                  fontSize="9"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="600"
                >
                  {node.name.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip info */}
        {selectedNode && (
          <div className="absolute bottom-2 left-2 right-2 p-2.5 rounded bg-[#0B2B26] border border-[#163832] text-xs text-[#DAF1DE] flex items-center justify-between font-mono">
            <div>
              <span className="font-bold text-white block">{selectedNode.name}</span>
              <span className="text-[10px] text-[#8EB69B]">
                ROLE: {selectedNode.role.toUpperCase()} {selectedNode.trustScore ? `// SCORE: ${selectedNode.trustScore}/100` : ''}
              </span>
            </div>
            {selectedNode.risk === 'high' ? (
              <span className="text-[#F0506E] font-bold text-[10px] flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> [FLAGGED LOOP]
              </span>
            ) : (
              <span className="text-[#5FD3A0] font-bold text-[10px] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> [VERIFIED]
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mt-2.5 text-[10px] text-[#8EB69B] flex items-center justify-between font-mono">
        <span className="flex items-center gap-1.5 text-[#F0506E]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F0506E]" />
          Coral: Cyclic Loop Anomaly
        </span>
        <span className="flex items-center gap-1.5 text-[#5FD3A0]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#5FD3A0]" />
          Mint: Enclave Verified
        </span>
      </div>
    </div>
  );
};
