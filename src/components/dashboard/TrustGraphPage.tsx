import React, { useState } from 'react';
import { 
  Network, 
  AlertTriangle, 
  ShieldCheck, 
  Filter, 
  Layers, 
  Eye, 
  Sparkles, 
  Info,
  Maximize2,
  RefreshCw,
  GitBranch,
  CircleDollarSign
} from 'lucide-react';
import { TrustGraphData, GraphNode, GraphEdge } from '../../types/credence';
import { getTrustGraphData } from '../../services/syntheticData';

interface TrustGraphPageProps {
  onSelectAgent: (agentId: string) => void;
}

export const TrustGraphPage: React.FC<TrustGraphPageProps> = ({ onSelectAgent }) => {
  const graphData: TrustGraphData = getTrustGraphData();
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<GraphEdge | null>(null);
  const [layoutMode, setLayoutMode] = useState<'force' | 'hierarchical' | 'sankey'>('force');
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'review'>('all');
  const [minAmount, setMinAmount] = useState<number>(0);

  // Position nodes nicely on canvas
  const getNodePosition = (node: GraphNode, index: number, total: number) => {
    if (layoutMode === 'hierarchical') {
      // 3 layers: Owners on top (y=60), Agents in middle (y=200), Counterparties on bottom (y=340)
      if (node.type === 'owner') {
        const ownerNodes = graphData.nodes.filter(n => n.type === 'owner');
        const idx = ownerNodes.findIndex(n => n.id === node.id);
        const x = 120 + (idx / Math.max(1, ownerNodes.length - 1)) * 560;
        return { x, y: 70 };
      } else if (node.type === 'agent') {
        const agentNodes = graphData.nodes.filter(n => n.type === 'agent');
        const idx = agentNodes.findIndex(n => n.id === node.id);
        const x = 60 + (idx / Math.max(1, agentNodes.length - 1)) * 680;
        return { x, y: 210 };
      } else {
        const cpNodes = graphData.nodes.filter(n => n.type === 'counterparty');
        const idx = cpNodes.findIndex(n => n.id === node.id);
        const x = 50 + (idx / Math.max(1, cpNodes.length - 1)) * 700;
        return { x, y: 350 };
      }
    }

    // Force-directed layout coordinate mapping
    // Circular loop cluster placed prominently on the right
    if (node.id === 'agent-a04') return { x: 550, y: 150 };
    if (node.id === 'agent-a05') return { x: 680, y: 220 };
    if (node.id === 'agent-a06') return { x: 580, y: 300 };

    // Standard constellation positioning
    const angle = (index / total) * Math.PI * 2;
    const radius = node.type === 'owner' ? 90 : node.type === 'agent' ? 180 : 270;
    return {
      x: 380 + Math.cos(angle) * (radius * 1.1),
      y: 220 + Math.sin(angle) * (radius * 0.7)
    };
  };

  // Filter edges
  const filteredEdges = graphData.edges.filter(edge => {
    if (minAmount > 0 && edge.amount < minAmount) return false;
    if (riskFilter === 'high' && !edge.isSuspiciousLoop) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in text-sm font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-[var(--border-hairline)]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[var(--text-primary)]">
              Agent Trust &amp; Financial Access Graph
            </h1>
            <span className="px-3 py-1 rounded-full bg-[#F0506E]/15 text-[#F0506E] text-xs font-semibold border border-[#F0506E]/30">
              1 Circular Loop Flagged
            </span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Real-time directed multi-graph mapping agent-to-vendor disbursements and inter-agent flows
          </p>
        </div>

        {/* Layout Mode Toggles */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-[var(--bg-surface)] p-1 border border-[var(--border-hairline)] text-xs sm:text-sm font-medium">
            <button
              onClick={() => setLayoutMode('force')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                layoutMode === 'force'
                  ? 'bg-[var(--brand-moss)] text-white font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Force Network
            </button>
            <button
              onClick={() => setLayoutMode('hierarchical')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                layoutMode === 'hierarchical'
                  ? 'bg-[var(--brand-moss)] text-white font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Hierarchical
            </button>
            <button
              onClick={() => setLayoutMode('sankey')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                layoutMode === 'sankey'
                  ? 'bg-[var(--brand-moss)] text-white font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Sankey Flow
            </button>
          </div>
        </div>
      </div>

      {/* Network Status Header */}
      <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs sm:text-sm text-[var(--text-secondary)] gap-2 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#2F9E6E]" />
          <span className="text-[var(--text-primary)] font-semibold">Graph Network Overview:</span>
          <span>12 Agents &middot; 18 Counterparties &middot; Cycle Analysis Active</span>
        </div>
        <span className="text-[#F0506E] font-medium text-xs">
          Closed pathways highlighted in coral
        </span>
      </div>

      {/* Main Interactive Canvas & Inspection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Canvas Area */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-sm relative overflow-hidden flex flex-col justify-between">
          {/* Controls Bar above canvas */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-[var(--text-primary)] font-semibold">
                <span className="w-3 h-3 rounded-full bg-[#2F9E6E]" />
                Agents (Moss/Mint)
              </span>
              <span className="flex items-center gap-1.5 text-[var(--text-primary)] font-semibold">
                <span className="w-3 h-3 rounded-full bg-[#163832]" />
                Owners (Forest)
              </span>
              <span className="flex items-center gap-1.5 text-[var(--text-primary)] font-semibold">
                <span className="w-3 h-3 rounded-full bg-[#8EB69B]" />
                Vendors (Sage)
              </span>
              <span className="flex items-center gap-1.5 text-[#F0506E] font-bold">
                <span className="w-3 h-3 rounded-full bg-[#F0506E] animate-ping" />
                Coral Loop (Anomaly)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value as any)}
                className="px-2.5 py-1 rounded-lg bg-[var(--bg-page)] border border-[var(--border-hairline)] text-xs font-mono"
              >
                <option value="all">All Flows</option>
                <option value="high">Coral Anomalies Only</option>
              </select>
            </div>
          </div>

          {/* SVG Graph View */}
          <div className="w-full h-[480px] bg-[var(--bg-page)]/60 rounded-xl border border-[var(--border-hairline)] relative overflow-hidden">
            <svg viewBox="0 0 800 480" className="w-full h-full">
              {/* Directed Edges */}
              {filteredEdges.map(edge => {
                const srcNode = graphData.nodes.find(n => n.id === edge.source);
                const dstNode = graphData.nodes.find(n => n.id === edge.target);
                if (!srcNode || !dstNode) return null;

                const posA = getNodePosition(srcNode, 0, graphData.nodes.length);
                const posB = getNodePosition(dstNode, 1, graphData.nodes.length);
                const isSelected = selectedEdge?.id === edge.id;

                return (
                  <g
                    key={edge.id}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedEdge(edge);
                      setSelectedNode(null);
                    }}
                  >
                    <line
                      x1={posA.x}
                      y1={posA.y}
                      x2={posB.x}
                      y2={posB.y}
                      stroke={edge.isSuspiciousLoop ? '#F0506E' : isSelected ? '#5FD3A0' : '#235347'}
                      strokeWidth={edge.isSuspiciousLoop ? 3 : isSelected ? 2.5 : 1.5}
                      strokeDasharray={edge.isSuspiciousLoop ? '5 4' : undefined}
                      strokeOpacity={edge.isSuspiciousLoop ? 0.9 : 0.45}
                    />
                    {/* Animated flow particle */}
                    {edge.isSuspiciousLoop && (
                      <circle
                        cx={(posA.x + posB.x) / 2}
                        cy={(posA.y + posB.y) / 2}
                        r="4"
                        fill="#F0506E"
                        className="animate-ping"
                      />
                    )}
                  </g>
                );
              })}

              {/* Nodes */}
              {graphData.nodes.map((node, i) => {
                const pos = getNodePosition(node, i, graphData.nodes.length);
                const isSelected = selectedNode?.id === node.id;
                const isAgentInCycle = ['agent-a04', 'agent-a05', 'agent-a06'].includes(node.id);
                const fill = isAgentInCycle ? '#F0506E' : node.type === 'agent' ? '#2F9E6E' : node.type === 'owner' ? '#163832' : '#8EB69B';

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer transition-transform"
                    onClick={() => {
                      setSelectedNode(node);
                      setSelectedEdge(null);
                    }}
                  >
                    {isSelected && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="18"
                        fill="none"
                        stroke="#5FD3A0"
                        strokeWidth="2"
                        strokeDasharray="3 3"
                      />
                    )}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={node.type === 'owner' ? 14 : node.type === 'agent' ? 12 : 9}
                      fill={fill}
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                    <text
                      x={pos.x}
                      y={pos.y + 20}
                      textAnchor="middle"
                      fill="currentColor"
                      fontSize="9"
                      fontFamily="JetBrains Mono, monospace"
                      fontWeight="600"
                      className="text-[var(--text-primary)]"
                    >
                      {node.label.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right Side: Deep Evidence Inspection Panel */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-[var(--border-hairline)] mb-4">
              <h3 className="text-sm font-bold font-heading text-[var(--text-primary)]">
                Evidence &amp; Forensic Attribution
              </h3>
              <span className="text-[10px] font-mono text-[#2F9E6E] font-bold">
                PROVENANCE
              </span>
            </div>

            {selectedNode ? (
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-[var(--bg-page)]">
                  <span className="text-[10px] uppercase text-[var(--text-secondary)] block">
                    Selected Node
                  </span>
                  <div className="text-base font-bold text-[var(--text-primary)] font-heading">
                    {selectedNode.label}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                    {selectedNode.subLabel}
                  </div>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-[var(--bg-page)]">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Entity Role:</span>
                    <span className="font-bold text-[var(--text-primary)]">{selectedNode.type.toUpperCase()}</span>
                  </div>
                  {selectedNode.trustScore !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">Trust Score:</span>
                      <span className="font-bold text-[#2F9E6E]">{selectedNode.trustScore}/100</span>
                    </div>
                  )}
                  {selectedNode.volume !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">Historical Volume:</span>
                      <span className="font-bold">₹{selectedNode.volume.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {['agent-a04', 'agent-a05', 'agent-a06'].includes(selectedNode.id) && (
                  <div className="p-3 rounded-xl bg-[#F0506E]/10 border border-[#F0506E]/30 text-[#F0506E]">
                    <div className="font-bold mb-1 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Closed Circular Route Flag</span>
                    </div>
                    <p className="text-[11px] font-sans text-[var(--text-primary)]">
                      Part of 3-agent triangular routing: A-04 &rarr; A-05 &rarr; A-06 &rarr; A-04 within a 4-hour window. Recirculating ₹384k across sister entities.
                    </p>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-[var(--bg-page)] space-y-1">
                  <div className="font-bold text-[var(--text-primary)]">Observed Fact vs Inferred:</div>
                  <div className="text-[11px] font-sans text-[var(--text-secondary)]">
                    <strong className="text-[var(--text-primary)] font-mono">FACT:</strong> Raw bank transaction settlement events with cryptographic timestamps.
                    <br />
                    <strong className="text-[var(--text-primary)] font-mono">INFERRED:</strong> Pass-through arbitrage velocity calculation and coordinated community membership.
                  </div>
                </div>

                {selectedNode.type === 'agent' && (
                  <button
                    onClick={() => onSelectAgent(selectedNode.id)}
                    className="w-full py-2.5 rounded-xl bg-[var(--brand-moss)] text-white font-semibold hover:bg-[var(--brand-forest)] text-xs text-center cursor-pointer mt-2"
                  >
                    Open Agent Profile &rarr;
                  </button>
                )}
              </div>
            ) : selectedEdge ? (
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-[var(--bg-page)]">
                  <span className="text-[10px] uppercase text-[var(--text-secondary)] block">
                    Directed Flow Link
                  </span>
                  <div className="text-base font-bold text-[var(--text-primary)] font-heading">
                    ₹{selectedEdge.amount.toLocaleString()}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    {selectedEdge.count} recorded transaction events
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[var(--bg-page)] space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Source:</span>
                    <span className="font-bold">{selectedEdge.source}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Target:</span>
                    <span className="font-bold">{selectedEdge.target}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Loop Indicator:</span>
                    <span className={selectedEdge.isSuspiciousLoop ? 'text-[#F0506E] font-bold' : 'text-[#2F9E6E]'}>
                      {selectedEdge.isSuspiciousLoop ? 'Flagged Loop ⚠' : 'Normal'}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[var(--bg-page)]">
                  <span className="font-bold text-[var(--text-primary)] block mb-1">Tags:</span>
                  <div className="flex gap-2 text-[10px]">
                    {selectedEdge.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded bg-[var(--brand-mint-mist)]/40 text-[var(--brand-moss)] dark:text-[#5FD3A0] font-bold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-[var(--text-secondary)] space-y-2">
                <Network className="w-8 h-8 text-[var(--brand-moss)] dark:text-[#5FD3A0] mx-auto opacity-70" />
                <p className="font-medium text-[var(--text-primary)]">Select a node or edge</p>
                <p className="text-[11px] leading-relaxed">
                  Click any agent, owner, or counterparty on the graph to inspect evidence provenance and cycle logs.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
