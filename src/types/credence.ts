/**
 * CREDENCE Data Models & Types
 * Behavioural Trust & Financial Access Intelligence for AI Agents
 */

export type UserRole = 
  | 'owner' 
  | 'finance_manager' 
  | 'risk_analyst' 
  | 'bank_reviewer' 
  | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  businessName: string;
  avatarUrl?: string;
  twoFactorEnabled: boolean;
}

export interface Business {
  id: string;
  name: string;
  registrationNumber: string;
  industry: string;
  monthlyDiscretionCap: number; // e.g., ₹2,500,000
  currency: string;
  enforceTwoPersonRuleAbove: number;
}

export type RiskTier = 'low' | 'review' | 'high';
export type AgentStatus = 'active' | 'provisional' | 'human_approval_required' | 'restricted';

export interface AgentPermission {
  agentId: string;
  allowedCategories: string[];
  maxSingleTransaction: number;
  monthlyCap: number;
  autoApproveVerifiedSuppliers: boolean;
  allowInternational: boolean;
  twoPersonApprovalAbove: number;
}

export interface Agent {
  id: string;
  code: string; // e.g. A-01
  name: string;
  purpose: string;
  businessId: string;
  businessName: string;
  ownerName: string;
  currentLimit: number;
  recommendedLimit: number;
  approvalThreshold: number;
  trustScore: number; // 0 - 100
  riskTier: RiskTier;
  status: AgentStatus;
  baselineTxSize: number;
  baselineDailyVolume: number;
  lastActive: string;
  createdDaysAgo: number;
  totalSpend90d: number;
  transactionCount90d: number;
  failureRate: number; // percentage, e.g. 1.2
  reversalCount: number;
  disputeCount: number;
  evidenceConfidence: number; // 0.0 - 1.0
  isBrandNew?: boolean;
}

export interface Counterparty {
  id: string;
  name: string;
  category: string;
  riskScore: number; // 0 - 100
  isVerifiedSupplier: boolean;
  firstSeenDaysAgo: number;
  totalVolume: number;
  isKnownCircular?: boolean;
}

export type TransactionStatus = 'completed' | 'failed' | 'reversed' | 'disputed' | 'flagged';
export type TransactionRisk = 'normal' | 'suspicious' | 'anomalous';

export interface Transaction {
  id: string;
  agentId: string;
  agentCode: string;
  agentName: string;
  counterpartyId: string;
  counterpartyName: string;
  category: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  riskLevel: TransactionRisk;
  flagReason?: string;
  timestamp: string;
  zScore: number;
  deviationScore: number;
  isNewCounterparty: boolean;
  requiresApproval: boolean;
}

export type EvidenceDimension = 
  | 'freshness' 
  | 'coverage' 
  | 'verification' 
  | 'consistency' 
  | 'contradiction';

export interface EvidenceItem {
  id: string;
  agentId: string;
  dimension: EvidenceDimension;
  score: number; // 0 - 100
  status: 'verified' | 'unverified' | 'stale';
  source: string;
  description: string;
  observedAt: string;
}

export type AccessDecision = 
  | 'MAINTAIN' 
  | 'INCREASE_CAUTIOUSLY' 
  | 'REQUIRE_APPROVAL' 
  | 'RESTRICT' 
  | 'ABSTAIN';

export interface FactorContribution {
  factor: string;
  contribution: number; // negative or positive
  description: string;
}

export interface Assessment {
  id: string;
  agentId: string;
  trustScore: number;
  confidence: number; // 0.0 - 1.0
  abstained: boolean;
  abstainReason?: string;
  recommendation: AccessDecision;
  recommendedLimit: number;
  previousLimit: number;
  approvalThreshold: number;
  topFactors: FactorContribution[];
  triggeredRules: string[];
  generatedAt: string;
}

export interface AccessRecommendation {
  id: string;
  agentId: string;
  agentCode: string;
  agentName: string;
  currentLimit: number;
  recommendedLimit: number;
  currentApprovalThreshold: number;
  proposedApprovalThreshold: number;
  decision: AccessDecision;
  justification: string;
  confidence: number;
  evidenceGaps: string[];
  status: 'pending' | 'approved' | 'overridden' | 'rejected';
  humanOverride?: {
    user: string;
    reason: string;
    timestamp: string;
    overriddenDecision: AccessDecision;
    customLimit: number;
  };
}

export interface GraphNode {
  id: string;
  label: string;
  subLabel?: string;
  type: 'agent' | 'owner' | 'counterparty';
  risk: RiskTier;
  trustScore?: number;
  volume?: number;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  amount: number;
  count: number;
  isSuspiciousLoop?: boolean;
  tags: ('FACT' | 'INFERRED')[];
}

export interface TrustGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  cycles: string[][];
  coordinatedClusters: string[][];
  summary: {
    totalAgents: number;
    totalCounterparties: number;
    suspiciousCyclesDetected: number;
    disclaimer: string;
  };
}

export interface Alert {
  id: string;
  agentId: string;
  agentCode: string;
  agentName: string;
  severity: 'info' | 'caution' | 'critical';
  ruleTriggered: string;
  description: string;
  amount?: number;
  timestamp: string;
  status: 'new' | 'reviewing' | 'resolved';
  disclaimer: string; // "Indicator for investigation, not proof of fraud."
}

export interface SimulationScenario {
  spendSpikeMultiplier: number; // 1.0 to 5.0
  addSuspiciousCounterparty: boolean;
  repeatedFailures: boolean;
  compromisedPermissions: boolean;
  coordinatedMultiAgent: boolean;
  staleEvidence: boolean;
}

export interface SimulationResult {
  before: {
    trustScore: number;
    confidence: number;
    riskTier: RiskTier;
    recommendation: AccessDecision;
    recommendedLimit: number;
  };
  after: {
    trustScore: number;
    confidence: number;
    riskTier: RiskTier;
    recommendation: AccessDecision;
    recommendedLimit: number;
    trustScoreDelta: number;
  };
  triggeredRules: string[];
  factors: FactorContribution[];
  graphImpact: {
    addedEdgesCount: number;
    cycleDetected: boolean;
    flaggedNodes: string[];
  };
}

export interface EvidencePassport {
  agent: Agent;
  assessment: Assessment;
  permissions: AgentPermission;
  evidenceItems: EvidenceItem[];
  behaviouralSummary: {
    total90dSpend: number;
    total90dTxCount: number;
    successRate: number;
    reversalRate: number;
    disputeRate: number;
    avgTicketSize: number;
    maxTicketSize: number;
  };
  integrityHash: string;
  qrPayload: string;
  issuedAt: string;
  limitationsNote: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  action: string;
  targetType: 'agent' | 'limit' | 'transaction' | 'system' | 'auth';
  targetId: string;
  details: string;
  ipAddress: string;
}
