import { 
  Agent, 
  Business, 
  Counterparty, 
  Transaction, 
  EvidenceItem, 
  AgentPermission, 
  Alert, 
  AuditLogEntry, 
  AccessRecommendation,
  TrustGraphData,
  EvidencePassport
} from '../types/credence';
import { CredenceRiskEngine } from './riskEngine';

// Seed Businesses
export const SEED_BUSINESSES: Business[] = [
  {
    id: 'biz-01',
    name: 'Nexus Enterprise Solutions',
    registrationNumber: 'U72900KA2021PTC148810',
    industry: 'Software & Cloud Services',
    monthlyDiscretionCap: 5000000,
    currency: 'INR',
    enforceTwoPersonRuleAbove: 500000
  },
  {
    id: 'biz-02',
    name: 'Bharat Retail Hub Pvt Ltd',
    registrationNumber: 'U52100DL2019PTC099411',
    industry: 'Omnichannel E-commerce',
    monthlyDiscretionCap: 7500000,
    currency: 'INR',
    enforceTwoPersonRuleAbove: 750000
  },
  {
    id: 'biz-03',
    name: 'SwiftLogistics Express',
    registrationNumber: 'U60200MH2020PTC210874',
    industry: 'Supply Chain & Freight',
    monthlyDiscretionCap: 3500000,
    currency: 'INR',
    enforceTwoPersonRuleAbove: 400000
  },
  {
    id: 'biz-04',
    name: 'Vanguard Media & Marketing',
    registrationNumber: 'U92100MH2022PTC334901',
    industry: 'Digital Advertising',
    monthlyDiscretionCap: 4000000,
    currency: 'INR',
    enforceTwoPersonRuleAbove: 300000
  },
  {
    id: 'biz-05',
    name: 'Starlight Financial Analytics',
    registrationNumber: 'U65999KA2023PTC412990',
    industry: 'FinTech & Wealth Management',
    monthlyDiscretionCap: 6000000,
    currency: 'INR',
    enforceTwoPersonRuleAbove: 600000
  }
];

// Seed Counterparties (60 counterparties)
const CATEGORIES = [
  'Cloud Infrastructure',
  'Software Subscriptions',
  'Office Supplies',
  'Logistics & Courier',
  'Marketing & Ads',
  'Legal & Advisory',
  'Raw Materials',
  'Payment Gateways',
  'Staff Augmentation',
  'Telecommunications'
];

export const SEED_COUNTERPARTIES: Counterparty[] = [
  { id: 'cp-01', name: 'Amazon Web Services APAC', category: 'Cloud Infrastructure', riskScore: 8, isVerifiedSupplier: true, firstSeenDaysAgo: 900, totalVolume: 12450000 },
  { id: 'cp-02', name: 'Google Cloud India Pte', category: 'Cloud Infrastructure', riskScore: 5, isVerifiedSupplier: true, firstSeenDaysAgo: 850, totalVolume: 8900000 },
  { id: 'cp-03', name: 'Microsoft Azure Services', category: 'Cloud Infrastructure', riskScore: 6, isVerifiedSupplier: true, firstSeenDaysAgo: 720, totalVolume: 6400000 },
  { id: 'cp-04', name: 'Slack Technologies LLC', category: 'Software Subscriptions', riskScore: 12, isVerifiedSupplier: true, firstSeenDaysAgo: 600, totalVolume: 780000 },
  { id: 'cp-05', name: 'Atlassian Pty Ltd', category: 'Software Subscriptions', riskScore: 10, isVerifiedSupplier: true, firstSeenDaysAgo: 580, totalVolume: 920000 },
  { id: 'cp-06', name: 'GitHub Enterprise Inc', category: 'Software Subscriptions', riskScore: 9, isVerifiedSupplier: true, firstSeenDaysAgo: 540, totalVolume: 450000 },
  { id: 'cp-07', name: 'BlueDart DHL Express', category: 'Logistics & Courier', riskScore: 14, isVerifiedSupplier: true, firstSeenDaysAgo: 480, totalVolume: 3200000 },
  { id: 'cp-08', name: 'Delhivery Surface Logistics', category: 'Logistics & Courier', riskScore: 18, isVerifiedSupplier: true, firstSeenDaysAgo: 410, totalVolume: 4100000 },
  { id: 'cp-09', name: 'Google Ads EMEA/India', category: 'Marketing & Ads', riskScore: 15, isVerifiedSupplier: true, firstSeenDaysAgo: 500, totalVolume: 7200000 },
  { id: 'cp-10', name: 'Meta Marketing Platforms', category: 'Marketing & Ads', riskScore: 19, isVerifiedSupplier: true, firstSeenDaysAgo: 490, totalVolume: 6100000 },
  { id: 'cp-11', name: 'LinkedIn Campaign Manager', category: 'Marketing & Ads', riskScore: 16, isVerifiedSupplier: true, firstSeenDaysAgo: 380, totalVolume: 1800000 },
  { id: 'cp-12', name: 'Razorpay Software Services', category: 'Payment Gateways', riskScore: 11, isVerifiedSupplier: true, firstSeenDaysAgo: 650, totalVolume: 22000000 },
  { id: 'cp-13', name: 'Stripe Payments India', category: 'Payment Gateways', riskScore: 13, isVerifiedSupplier: true, firstSeenDaysAgo: 600, totalVolume: 15400000 },
  { id: 'cp-14', name: 'Tata Communications Ltd', category: 'Telecommunications', riskScore: 10, isVerifiedSupplier: true, firstSeenDaysAgo: 700, totalVolume: 2100000 },
  { id: 'cp-15', name: 'Airtel Business Enterprise', category: 'Telecommunications', riskScore: 12, isVerifiedSupplier: true, firstSeenDaysAgo: 720, totalVolume: 1950000 },
  // Circular Flow & Shell Counterparties
  { id: 'cp-circ-01', name: 'Apex Vortex Holdings', category: 'Advisory & Arbitrage', riskScore: 84, isVerifiedSupplier: false, firstSeenDaysAgo: 38, totalVolume: 3840000, isKnownCircular: true },
  { id: 'cp-circ-02', name: 'Helios Routing Hub Ltd', category: 'Clearing Service', riskScore: 79, isVerifiedSupplier: false, firstSeenDaysAgo: 29, totalVolume: 4200000, isKnownCircular: true },
  { id: 'cp-shell-01', name: 'Zenith FastPay Overseas Ltd', category: 'Offshore Remittance', riskScore: 92, isVerifiedSupplier: false, firstSeenDaysAgo: 6, totalVolume: 2890000 }
];

// Add generic counterparties up to 60
for (let i = 16; i <= 57; i++) {
  const cat = CATEGORIES[i % CATEGORIES.length];
  SEED_COUNTERPARTIES.push({
    id: `cp-${i}`,
    name: `${cat.split(' ')[0]} Allied Solutions ${i}`,
    category: cat,
    riskScore: 15 + ((i * 7) % 45),
    isVerifiedSupplier: i % 3 !== 0,
    firstSeenDaysAgo: 50 + (i * 12),
    totalVolume: 400000 + (i * 85000)
  });
}

// 12 Distinct AI Agents
export const SEED_AGENTS: Agent[] = [
  {
    id: 'agent-a01',
    code: 'A-01',
    name: 'Nova Procurement Bot',
    purpose: 'Automated Tier-1 hardware & software supplier invoice settlement',
    businessId: 'biz-01',
    businessName: 'Nexus Enterprise Solutions',
    ownerName: 'Devika Sharma (VP Ops)',
    currentLimit: 500000,
    recommendedLimit: 625000,
    approvalThreshold: 250000,
    trustScore: 94,
    riskTier: 'low',
    status: 'active',
    baselineTxSize: 42000,
    baselineDailyVolume: 125000,
    lastActive: '12 minutes ago',
    createdDaysAgo: 85,
    totalSpend90d: 3840000,
    transactionCount90d: 412,
    failureRate: 0.4,
    reversalCount: 0,
    disputeCount: 0,
    evidenceConfidence: 0.94
  },
  {
    id: 'agent-a02',
    code: 'A-02',
    name: 'Apex Cloud Billing Runner',
    purpose: 'Manages dynamic compute instances, CDN reservations and reserved quotas',
    businessId: 'biz-01',
    businessName: 'Nexus Enterprise Solutions',
    ownerName: 'Rahul Verma (Head of DevOps)',
    currentLimit: 800000,
    recommendedLimit: 1000000,
    approvalThreshold: 400000,
    trustScore: 89,
    riskTier: 'low',
    status: 'active',
    baselineTxSize: 185000,
    baselineDailyVolume: 350000,
    lastActive: '4 minutes ago',
    createdDaysAgo: 74,
    totalSpend90d: 6890000,
    transactionCount90d: 210,
    failureRate: 0.9,
    reversalCount: 1,
    disputeCount: 0,
    evidenceConfidence: 0.91
  },
  {
    id: 'agent-a03',
    code: 'A-03',
    name: 'Vanguard Supplier Negotiator',
    purpose: 'Spot procurement for urgent warehouse supplies and ad-hoc parts',
    businessId: 'biz-02',
    businessName: 'Bharat Retail Hub Pvt Ltd',
    ownerName: 'Sanjay Mehta (Procurement Lead)',
    currentLimit: 400000,
    recommendedLimit: 150000,
    approvalThreshold: 35000,
    trustScore: 48,
    riskTier: 'review',
    status: 'human_approval_required',
    baselineTxSize: 28000,
    baselineDailyVolume: 90000,
    lastActive: '28 minutes ago',
    createdDaysAgo: 60,
    totalSpend90d: 2410000,
    transactionCount90d: 185,
    failureRate: 4.8,
    reversalCount: 4,
    disputeCount: 2,
    evidenceConfidence: 0.72
  },
  // Circular Flow Trinity: A-04, A-05, A-06
  {
    id: 'agent-a04',
    code: 'A-04',
    name: 'Delta Logistics Re-Router',
    purpose: 'Handles third-party courier subcontracts and dynamic fuel surcharges',
    businessId: 'biz-03',
    businessName: 'SwiftLogistics Express',
    ownerName: 'Arjun Das (Fleet Director)',
    currentLimit: 450000,
    recommendedLimit: 90000,
    approvalThreshold: 0,
    trustScore: 34,
    riskTier: 'high',
    status: 'restricted',
    baselineTxSize: 55000,
    baselineDailyVolume: 160000,
    lastActive: '1 hour ago',
    createdDaysAgo: 45,
    totalSpend90d: 3120000,
    transactionCount90d: 140,
    failureRate: 5.2,
    reversalCount: 6,
    disputeCount: 3,
    evidenceConfidence: 0.78
  },
  {
    id: 'agent-a05',
    code: 'A-05',
    name: 'Starlight Media Clearing Agent',
    purpose: 'Programmatic media inventory purchase and DSP balancing',
    businessId: 'biz-04',
    businessName: 'Vanguard Media & Marketing',
    ownerName: 'Priya Nambiar (VP Media)',
    currentLimit: 600000,
    recommendedLimit: 120000,
    approvalThreshold: 0,
    trustScore: 36,
    riskTier: 'high',
    status: 'restricted',
    baselineTxSize: 85000,
    baselineDailyVolume: 220000,
    lastActive: '45 minutes ago',
    createdDaysAgo: 42,
    totalSpend90d: 3950000,
    transactionCount90d: 112,
    failureRate: 6.1,
    reversalCount: 5,
    disputeCount: 4,
    evidenceConfidence: 0.76
  },
  {
    id: 'agent-a06',
    code: 'A-06',
    name: 'Zenith Consulting Disburser',
    purpose: 'Freelancer project milestone settlements and escrow releases',
    businessId: 'biz-05',
    businessName: 'Starlight Financial Analytics',
    ownerName: 'Karan Singhal (CFO)',
    currentLimit: 350000,
    recommendedLimit: 70000,
    approvalThreshold: 0,
    trustScore: 32,
    riskTier: 'high',
    status: 'restricted',
    baselineTxSize: 62000,
    baselineDailyVolume: 180000,
    lastActive: '2 hours ago',
    createdDaysAgo: 40,
    totalSpend90d: 2850000,
    transactionCount90d: 98,
    failureRate: 7.4,
    reversalCount: 8,
    disputeCount: 5,
    evidenceConfidence: 0.74
  },
  {
    id: 'agent-a07',
    code: 'A-07',
    name: 'Pulse Payroll Assistant',
    purpose: 'Contractor hourly billing reconciliation and scheduled remittances',
    businessId: 'biz-01',
    businessName: 'Nexus Enterprise Solutions',
    ownerName: 'Devika Sharma (VP Ops)',
    currentLimit: 1200000,
    recommendedLimit: 1500000,
    approvalThreshold: 600000,
    trustScore: 98,
    riskTier: 'low',
    status: 'active',
    baselineTxSize: 75000,
    baselineDailyVolume: 450000,
    lastActive: '5 minutes ago',
    createdDaysAgo: 90,
    totalSpend90d: 9400000,
    transactionCount90d: 280,
    failureRate: 0.1,
    reversalCount: 0,
    disputeCount: 0,
    evidenceConfidence: 0.98
  },
  {
    id: 'agent-a08',
    code: 'A-08',
    name: 'Kite Micro-Invoicer',
    purpose: 'Handles micro-payouts for customer cashbacks and rewards',
    businessId: 'biz-02',
    businessName: 'Bharat Retail Hub Pvt Ltd',
    ownerName: 'Rohan Gupta (Growth Lead)',
    currentLimit: 250000,
    recommendedLimit: 100000,
    approvalThreshold: 15000,
    trustScore: 42,
    riskTier: 'review',
    status: 'human_approval_required',
    baselineTxSize: 3500,
    baselineDailyVolume: 65000,
    lastActive: '18 minutes ago',
    createdDaysAgo: 68,
    totalSpend90d: 1120000,
    transactionCount90d: 840,
    failureRate: 16.8, // 16.8% high failure rate!
    reversalCount: 28,
    disputeCount: 14,
    evidenceConfidence: 0.81
  },
  {
    id: 'agent-a09',
    code: 'A-09',
    name: 'Chronos Legacy Runner',
    purpose: 'Maintains archival ERP batch synchronization and legacy EDI invoices',
    businessId: 'biz-03',
    businessName: 'SwiftLogistics Express',
    ownerName: 'Vikram Joshi (IT Director)',
    currentLimit: 300000,
    recommendedLimit: 250000,
    approvalThreshold: 50000,
    trustScore: 61,
    riskTier: 'review',
    status: 'provisional',
    baselineTxSize: 45000,
    baselineDailyVolume: 90000,
    lastActive: '3 days ago',
    createdDaysAgo: 88,
    totalSpend90d: 1650000,
    transactionCount90d: 74,
    failureRate: 2.7,
    reversalCount: 2,
    disputeCount: 1,
    evidenceConfidence: 0.42 // Stale evidence!
  },
  {
    id: 'agent-a10',
    code: 'A-10',
    name: 'Orion Ad Spender',
    purpose: 'Executes programmatic bidding on Google, Meta, and LinkedIn networks',
    businessId: 'biz-04',
    businessName: 'Vanguard Media & Marketing',
    ownerName: 'Priya Nambiar (VP Media)',
    currentLimit: 750000,
    recommendedLimit: 750000,
    approvalThreshold: 350000,
    trustScore: 81,
    riskTier: 'low',
    status: 'active',
    baselineTxSize: 95000,
    baselineDailyVolume: 280000,
    lastActive: '8 minutes ago',
    createdDaysAgo: 70,
    totalSpend90d: 5800000,
    transactionCount90d: 195,
    failureRate: 1.5,
    reversalCount: 1,
    disputeCount: 0,
    evidenceConfidence: 0.88
  },
  {
    id: 'agent-a11',
    code: 'A-11',
    name: 'Zephyr Inventory Restocker',
    purpose: 'Automated warehouse stock replenishment when SKU counts cross reorder points',
    businessId: 'biz-02',
    businessName: 'Bharat Retail Hub Pvt Ltd',
    ownerName: 'Sanjay Mehta (Procurement Lead)',
    currentLimit: 600000,
    recommendedLimit: 600000,
    approvalThreshold: 200000,
    trustScore: 76,
    riskTier: 'low',
    status: 'active',
    baselineTxSize: 68000,
    baselineDailyVolume: 210000,
    lastActive: '35 minutes ago',
    createdDaysAgo: 55,
    totalSpend90d: 3450000,
    transactionCount90d: 142,
    failureRate: 2.1,
    reversalCount: 2,
    disputeCount: 0,
    evidenceConfidence: 0.84
  },
  {
    id: 'agent-a12',
    code: 'A-12',
    name: 'Helios Junior Assistant',
    purpose: 'Experimental multi-modal assistant for vendor discovery and quote extraction',
    businessId: 'biz-01',
    businessName: 'Nexus Enterprise Solutions',
    ownerName: 'Rahul Verma (Head of DevOps)',
    currentLimit: 0,
    recommendedLimit: 0,
    approvalThreshold: 0,
    trustScore: 50,
    riskTier: 'review',
    status: 'provisional',
    baselineTxSize: 10000,
    baselineDailyVolume: 0,
    lastActive: '1 day ago',
    createdDaysAgo: 2, // BRAND NEW!
    totalSpend90d: 0,
    transactionCount90d: 0,
    failureRate: 0,
    reversalCount: 0,
    disputeCount: 0,
    evidenceConfidence: 0.18, // Epistemic humility!
    isBrandNew: true
  }
];

// Seed Agent Permissions
export const SEED_PERMISSIONS: AgentPermission[] = SEED_AGENTS.map(agent => ({
  agentId: agent.id,
  allowedCategories: [
    'Cloud Infrastructure',
    'Software Subscriptions',
    'Logistics & Courier',
    'Office Supplies'
  ],
  maxSingleTransaction: agent.currentLimit > 0 ? Math.round(agent.currentLimit * 0.4) : 10000,
  monthlyCap: agent.currentLimit > 0 ? agent.currentLimit * 4 : 50000,
  autoApproveVerifiedSuppliers: agent.trustScore >= 80,
  allowInternational: agent.trustScore >= 85,
  twoPersonApprovalAbove: agent.approvalThreshold
}));

// Seed Evidence Items for each agent
export const SEED_EVIDENCE_ITEMS: EvidenceItem[] = [
  // A-01 (Nova Procurement Bot - High trust)
  { id: 'ev-01-1', agentId: 'agent-a01', dimension: 'freshness', score: 98, status: 'verified', source: 'mTLS Telemetry Feed', description: 'Cryptographic heartbeat received < 15 minutes ago with valid TPM attestation', observedAt: '2026-10-20T05:00:00Z' },
  { id: 'ev-01-2', agentId: 'agent-a01', dimension: 'coverage', score: 95, status: 'verified', source: 'ERP Audit Trail', description: 'Complete 100% telemetry coverage across all purchase orders & invoices', observedAt: '2026-10-20T04:30:00Z' },
  { id: 'ev-01-3', agentId: 'agent-a01', dimension: 'verification', score: 96, status: 'verified', source: 'Bank Webhook & LEI', description: 'All recipient bank accounts verified via NPCI penny drop and active LEI numbers', observedAt: '2026-10-19T18:00:00Z' },
  { id: 'ev-01-4', agentId: 'agent-a01', dimension: 'consistency', score: 92, status: 'verified', source: 'Statistical Model', description: 'Zero drift from 85-day mean transaction distribution (p = 0.94)', observedAt: '2026-10-20T02:00:00Z' },
  { id: 'ev-01-5', agentId: 'agent-a01', dimension: 'contradiction', score: 2, status: 'verified', source: 'Cross-Corroboration Engine', description: 'Zero discrepancies between internal execution logs and bank statements', observedAt: '2026-10-20T01:00:00Z' },

  // A-03 (Vanguard - Anomalous surge)
  { id: 'ev-03-1', agentId: 'agent-a03', dimension: 'freshness', score: 85, status: 'verified', source: 'mTLS Heartbeat', description: 'Agent actively communicating via trusted endpoint', observedAt: '2026-10-20T04:40:00Z' },
  { id: 'ev-03-2', agentId: 'agent-a03', dimension: 'coverage', score: 70, status: 'verified', source: 'ERP Ledger', description: 'Recent invoices lacked automated 3-way matching PO documents', observedAt: '2026-10-20T03:15:00Z' },
  { id: 'ev-03-3', agentId: 'agent-a03', dimension: 'verification', score: 38, status: 'unverified', source: 'Vendor KYC Registry', description: 'Counterparty Zenith FastPay Overseas is unverified shell company registered 6 days ago', observedAt: '2026-10-19T22:00:00Z' },
  { id: 'ev-03-4', agentId: 'agent-a03', dimension: 'consistency', score: 45, status: 'unverified', source: 'Variance Engine', description: 'Disproportionate spike: single transaction of ₹289,000 against baseline of ₹28,000 (z = 4.1)', observedAt: '2026-10-19T20:00:00Z' },
  { id: 'ev-03-5', agentId: 'agent-a03', dimension: 'contradiction', score: 55, status: 'unverified', source: 'Invoice Verification AI', description: 'Vendor tax ID does not match invoice billing address records', observedAt: '2026-10-19T19:30:00Z' },

  // A-04 (Delta Logistics - Circular loop)
  { id: 'ev-04-1', agentId: 'agent-a04', dimension: 'freshness', score: 80, status: 'verified', source: 'Container Health', description: 'Agent container runtime healthy', observedAt: '2026-10-20T04:00:00Z' },
  { id: 'ev-04-2', agentId: 'agent-a04', dimension: 'coverage', score: 75, status: 'verified', source: 'API Gateway', description: 'Transaction logs complete', observedAt: '2026-10-20T03:00:00Z' },
  { id: 'ev-04-3', agentId: 'agent-a04', dimension: 'verification', score: 40, status: 'unverified', source: 'Graph Cycle Detector', description: 'Participating in recurring triangular closed loop: A-04 -> A-05 -> A-06 -> A-04 within 4-hour window', observedAt: '2026-10-20T02:00:00Z' },
  { id: 'ev-04-4', agentId: 'agent-a04', dimension: 'consistency', score: 38, status: 'unverified', source: 'Flow Velocity Engine', description: 'Fund retention time is under 180 seconds before re-disbursing (pass-through arbitrage indicator)', observedAt: '2026-10-20T01:30:00Z' },
  { id: 'ev-04-5', agentId: 'agent-a04', dimension: 'contradiction', score: 65, status: 'unverified', source: 'Contract Scanner', description: 'No business rationale found for reciprocal freight consulting between sister agents', observedAt: '2026-10-20T01:00:00Z' },

  // A-08 (Kite Micro-Invoicer - High failure rate)
  { id: 'ev-08-1', agentId: 'agent-a08', dimension: 'freshness', score: 90, status: 'verified', source: 'Payment Gateway Telemetry', description: 'Real-time gateway event webhooks streaming', observedAt: '2026-10-20T04:50:00Z' },
  { id: 'ev-08-2', agentId: 'agent-a08', dimension: 'coverage', score: 88, status: 'verified', source: 'Settlement Ledger', description: 'High volume tracking verified', observedAt: '2026-10-20T04:00:00Z' },
  { id: 'ev-08-3', agentId: 'agent-a08', dimension: 'verification', score: 50, status: 'unverified', source: 'VPA Validation Service', description: 'Multiple invalid UPI VPA handles and dormant recipient accounts targeted', observedAt: '2026-10-20T02:30:00Z' },
  { id: 'ev-08-4', agentId: 'agent-a08', dimension: 'consistency', score: 35, status: 'unverified', source: 'Error Rate Monitor', description: '16.8% failure & bounce rate exceeds allowable threshold of 3.0%', observedAt: '2026-10-20T01:45:00Z' },
  { id: 'ev-08-5', agentId: 'agent-a08', dimension: 'contradiction', score: 40, status: 'unverified', source: 'Customer Dispute Feed', description: '14 user chargeback tickets opened for duplicate loyalty disbursements', observedAt: '2026-10-19T23:00:00Z' },

  // A-09 (Chronos - Stale evidence)
  { id: 'ev-09-1', agentId: 'agent-a09', dimension: 'freshness', score: 25, status: 'stale', source: 'Legacy Agent Certificate', description: 'TLS client certificate expired 42 days ago; operating on grace renewal', observedAt: '2026-09-08T12:00:00Z' },
  { id: 'ev-09-2', agentId: 'agent-a09', dimension: 'coverage', score: 45, status: 'stale', source: 'Batch FTP Drops', description: 'Only 45% of transactions contain structured audit context', observedAt: '2026-09-12T10:00:00Z' },
  { id: 'ev-09-3', agentId: 'agent-a09', dimension: 'verification', score: 60, status: 'verified', source: 'ERP Credential Store', description: 'Static API key credentials have not been rotated in 180 days', observedAt: '2026-08-20T08:00:00Z' },
  { id: 'ev-09-4', agentId: 'agent-a09', dimension: 'consistency', score: 70, status: 'verified', source: 'Batch Timing Engine', description: 'Execution cadence consistent but lacks granular per-transaction telemetry', observedAt: '2026-10-17T06:00:00Z' },
  { id: 'ev-09-5', agentId: 'agent-a09', dimension: 'contradiction', score: 10, status: 'verified', source: 'Audit Check', description: 'No fraudulent flags, but governance compliance is outdated', observedAt: '2026-10-17T05:00:00Z' },

  // A-12 (Helios - Brand new, Epistemic Humility)
  { id: 'ev-12-1', agentId: 'agent-a12', dimension: 'freshness', score: 95, status: 'verified', source: 'Registration Event', description: 'Agent identity enrolled 48 hours ago with hardware enclave proof', observedAt: '2026-10-19T08:00:00Z' },
  { id: 'ev-12-2', agentId: 'agent-a12', dimension: 'coverage', score: 12, status: 'unverified', source: 'Execution Monitor', description: 'Zero live transactions completed; 0% statistical coverage of target domain', observedAt: '2026-10-20T04:00:00Z' },
  { id: 'ev-12-3', agentId: 'agent-a12', dimension: 'verification', score: 50, status: 'unverified', source: 'Sandbox Runner', description: 'Passed unit sandbox assertions; production autonomy not yet granted', observedAt: '2026-10-19T12:00:00Z' },
  { id: 'ev-12-4', agentId: 'agent-a12', dimension: 'consistency', score: 10, status: 'unverified', source: 'Variance Engine', description: 'Baseline distribution cannot be calculated from zero observed data points', observedAt: '2026-10-20T00:00:00Z' },
  { id: 'ev-12-5', agentId: 'agent-a12', dimension: 'contradiction', score: 0, status: 'verified', source: 'Governance Check', description: 'No known violations or sanctions hits found', observedAt: '2026-10-19T08:30:00Z' }
];

// Helper to generate 5,000+ realistic synthetic transactions
function generateSyntheticTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  const now = Date.now();
  const dayMs = 86400000;

  // Specific special transactions first
  // 1. A-03 Sudden massive spike to new shell company
  transactions.push({
    id: 'tx-a03-spike-01',
    agentId: 'agent-a03',
    agentCode: 'A-03',
    agentName: 'Vanguard Supplier Negotiator',
    counterpartyId: 'cp-shell-01',
    counterpartyName: 'Zenith FastPay Overseas Ltd',
    category: 'Offshore Remittance',
    amount: 289000,
    currency: 'INR',
    status: 'flagged',
    riskLevel: 'anomalous',
    flagReason: 'Sudden 10x ticket size deviation to newly incorporated offshore entity',
    timestamp: new Date(now - (18 * 3600000)).toISOString(),
    zScore: 4.2,
    deviationScore: 92,
    isNewCounterparty: true,
    requiresApproval: true
  });

  // 2. Circular Flow Trinity (A-04 -> A-05 -> A-06 -> A-04)
  const circularLoops = [
    { from: 'agent-a04', to: 'agent-a05', amount: 82000, hoursAgo: 4 },
    { from: 'agent-a05', to: 'agent-a06', amount: 81400, hoursAgo: 3.5 },
    { from: 'agent-a06', to: 'agent-a04', amount: 80800, hoursAgo: 3 },
    { from: 'agent-a04', to: 'agent-a05', amount: 95000, hoursAgo: 28 },
    { from: 'agent-a05', to: 'agent-a06', amount: 94200, hoursAgo: 27 },
    { from: 'agent-a06', to: 'agent-a04', amount: 93500, hoursAgo: 26 },
    { from: 'agent-a04', to: 'agent-a05', amount: 120000, hoursAgo: 52 },
    { from: 'agent-a05', to: 'agent-a06', amount: 119000, hoursAgo: 51 },
    { from: 'agent-a06', to: 'agent-a04', amount: 118200, hoursAgo: 50 }
  ];

  circularLoops.forEach((loop, idx) => {
    const srcAgent = SEED_AGENTS.find(a => a.id === loop.from)!;
    const dstAgent = SEED_AGENTS.find(a => a.id === loop.to)!;
    transactions.push({
      id: `tx-circ-${idx}`,
      agentId: srcAgent.id,
      agentCode: srcAgent.code,
      agentName: srcAgent.name,
      counterpartyId: `cp-interagent-${dstAgent.code}`,
      counterpartyName: `${dstAgent.name} (Direct Inter-Agent Vault)`,
      category: 'Inter-Agent Discretionary Payout',
      amount: loop.amount,
      currency: 'INR',
      status: 'flagged',
      riskLevel: 'anomalous',
      flagReason: 'Cyclic pass-through flow detected within 4-hour window',
      timestamp: new Date(now - (loop.hoursAgo * 3600000)).toISOString(),
      zScore: 2.8,
      deviationScore: 84,
      isNewCounterparty: false,
      requiresApproval: true
    });
  });

  // 3. Populate bulk transactions across the remaining agents over 90 days to exceed 5,000 total
  // Distribution target per agent:
  // A-01: ~412
  // A-02: ~210
  // A-03: ~184
  // A-04: ~135
  // A-05: ~108
  // A-06: ~94
  // A-07: ~280
  // A-08: ~840 (micro payments)
  // A-09: ~74
  // A-10: ~195
  // A-11: ~142
  // A-12: 0 (Brand new)
  // Additional background historical payments across verified counterparties: ~2,500
  // Total ~ 5,100 transactions!

  let txCounter = 1000;

  SEED_AGENTS.forEach(agent => {
    if (agent.isBrandNew) return;

    const count = agent.transactionCount90d;
    for (let i = 0; i < count; i++) {
      txCounter++;
      // Spread evenly over past 90 days
      const daysBack = (i / count) * 90;
      const txTime = new Date(now - (daysBack * dayMs) - (Math.random() * 36000000)).toISOString();
      
      const cpIndex = (i + txCounter) % SEED_COUNTERPARTIES.length;
      const cp = SEED_COUNTERPARTIES[cpIndex];

      // Gaussian-ish amount around baseline
      const variance = (Math.sin(i * 1.7) * 0.35);
      const amount = Math.max(500, Math.round(agent.baselineTxSize * (1 + variance)));
      const zScore = Number(Math.abs(variance * 2.2).toFixed(2));

      // Calculate failure status based on agent failure rate
      let status: 'completed' | 'failed' | 'reversed' | 'disputed' = 'completed';
      let riskLevel: 'normal' | 'suspicious' | 'anomalous' = 'normal';
      let flagReason = undefined;

      const rand = (i * 37) % 100;
      if (rand < agent.failureRate) {
        status = 'failed';
        riskLevel = 'suspicious';
        flagReason = 'Merchant clearing timeout / insufficient balance reservation';
      } else if (agent.reversalCount > 0 && (i % Math.max(1, Math.floor(count / agent.reversalCount))) === 0) {
        status = 'reversed';
        riskLevel = 'suspicious';
        flagReason = 'Automated chargeback or duplicate processing reversal';
      }

      transactions.push({
        id: `tx-${agent.code}-${txCounter}`,
        agentId: agent.id,
        agentCode: agent.code,
        agentName: agent.name,
        counterpartyId: cp.id,
        counterpartyName: cp.name,
        category: cp.category,
        amount,
        currency: 'INR',
        status,
        riskLevel,
        flagReason,
        timestamp: txTime,
        zScore,
        deviationScore: Math.round(zScore * 20),
        isNewCounterparty: cp.firstSeenDaysAgo < 15,
        requiresApproval: amount > agent.approvalThreshold && agent.approvalThreshold > 0
      });
    }
  });

  // Additional 2,400 background multi-month ledger transactions across verified businesses
  for (let k = 0; k < 2400; k++) {
    txCounter++;
    const agent = SEED_AGENTS[k % (SEED_AGENTS.length - 1)]; // exclude brand new
    const cp = SEED_COUNTERPARTIES[k % 15]; // verified core vendors
    const daysBack = (k / 2400) * 90;
    const txTime = new Date(now - (daysBack * dayMs) - (k * 180000)).toISOString();
    const amount = Math.max(1000, Math.round(agent.baselineTxSize * (0.8 + ((k % 5) * 0.1))));

    transactions.push({
      id: `tx-bg-${txCounter}`,
      agentId: agent.id,
      agentCode: agent.code,
      agentName: agent.name,
      counterpartyId: cp.id,
      counterpartyName: cp.name,
      category: cp.category,
      amount,
      currency: 'INR',
      status: 'completed',
      riskLevel: 'normal',
      timestamp: txTime,
      zScore: 0.4,
      deviationScore: 8,
      isNewCounterparty: false,
      requiresApproval: false
    });
  }

  // Sort descending by timestamp
  return transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export const SEED_TRANSACTIONS: Transaction[] = generateSyntheticTransactions();

// Pre-computed Alerts
export const SEED_ALERTS: Alert[] = [
  {
    id: 'alt-01',
    agentId: 'agent-a04',
    agentCode: 'A-04',
    agentName: 'Delta Logistics Re-Router',
    severity: 'critical',
    ruleTriggered: 'RULE_GRAPH_CIRCULAR_LOOP_DETECTED',
    description: 'Closed circular fund route detected: A-04 -> A-05 -> A-06 -> A-04 with ₹384,000 recirculated across 3 rounds within 48h.',
    amount: 384000,
    timestamp: '25 minutes ago',
    status: 'new',
    disclaimer: 'EVIDENCE TRACE: TELEMETRY ANOMALY'
  },
  {
    id: 'alt-02',
    agentId: 'agent-a03',
    agentCode: 'A-03',
    agentName: 'Vanguard Supplier Negotiator',
    severity: 'critical',
    ruleTriggered: 'RULE_NEW_COUNTERPARTY_SURGE',
    description: 'Unusual ₹289,000 single transfer (z-score: 4.2) directed to brand-new offshore counterparty Zenith FastPay Overseas.',
    amount: 289000,
    timestamp: '1 hour ago',
    status: 'new',
    disclaimer: 'EVIDENCE TRACE: TELEMETRY ANOMALY'
  },
  {
    id: 'alt-03',
    agentId: 'agent-a08',
    agentCode: 'A-08',
    agentName: 'Kite Micro-Invoicer',
    severity: 'caution',
    ruleTriggered: 'RULE_HIGH_FAILURE_REVERSAL_RATE',
    description: 'Elevated transaction failure rate of 16.8% and 28 reversals recorded over past 7 days.',
    amount: 65000,
    timestamp: '3 hours ago',
    status: 'reviewing',
    disclaimer: 'EVIDENCE TRACE: TELEMETRY ANOMALY'
  },
  {
    id: 'alt-04',
    agentId: 'agent-a09',
    agentCode: 'A-09',
    agentName: 'Chronos Legacy Runner',
    severity: 'info',
    ruleTriggered: 'RULE_STALE_EVIDENCE_DEPRECIATION',
    description: 'Agent cryptographic credentials and mTLS telemetry have aged beyond 60-day policy window.',
    timestamp: '1 day ago',
    status: 'resolved',
    disclaimer: 'EVIDENCE TRACE: TELEMETRY ANOMALY'
  },
  {
    id: 'alt-05',
    agentId: 'agent-a12',
    agentCode: 'A-12',
    agentName: 'Helios Junior Assistant',
    severity: 'info',
    ruleTriggered: 'RULE_INSUFFICIENT_HISTORY_ABSTAIN',
    description: 'Provisional agent enrolled without prior financial track record. Autonomous limit set to ₹0 until human supervisor approval.',
    timestamp: '2 days ago',
    status: 'reviewing',
    disclaimer: 'EVIDENCE TRACE: TELEMETRY ANOMALY'
  }
];

// Seed Audit Logs
export const SEED_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-101',
    timestamp: '2026-10-20T04:45:12Z',
    actor: 'system.risk_engine',
    role: 'admin',
    action: 'POLICY_EVALUATION_TRIGGERED',
    targetType: 'agent',
    targetId: 'agent-a04',
    details: 'Flagged closed cyclic transaction cluster; reduced recommended autonomous spend limit to ₹90,000.',
    ipAddress: '10.240.0.1'
  },
  {
    id: 'aud-102',
    timestamp: '2026-10-20T04:12:00Z',
    actor: 'Devika Sharma',
    role: 'owner',
    action: 'ACCESS_RECOMMENDATION_APPROVED',
    targetType: 'limit',
    targetId: 'agent-a01',
    details: 'Approved +25% autonomous limit expansion for Nova Procurement Bot following 85-day unblemished track record.',
    ipAddress: '192.168.1.45'
  },
  {
    id: 'aud-103',
    timestamp: '2026-10-19T22:30:19Z',
    actor: 'Karan Singhal',
    role: 'finance_manager',
    action: 'HUMAN_APPROVAL_DISBURSED',
    targetType: 'transaction',
    targetId: 'tx-a07-299',
    details: 'Co-signed dual-person salary payroll tranche ₹450,000 for Pulse Payroll Assistant.',
    ipAddress: '192.168.1.18'
  },
  {
    id: 'aud-104',
    timestamp: '2026-10-19T18:10:00Z',
    actor: 'Sanjay Mehta',
    role: 'risk_analyst',
    action: 'RESTRICTION_OVERRIDE_REJECTED',
    targetType: 'agent',
    targetId: 'agent-a03',
    details: 'Upheld quarantine on Vanguard Supplier Negotiator pending verified documentation from offshore counterparty.',
    ipAddress: '192.168.2.80'
  },
  {
    id: 'aud-105',
    timestamp: '2026-10-18T09:00:00Z',
    actor: 'system.identity_onboarding',
    role: 'admin',
    action: 'AGENT_PROVISIONAL_REGISTRATION',
    targetType: 'agent',
    targetId: 'agent-a12',
    details: 'Registered Helios Junior Assistant in sandbox environment with zero baseline permissions.',
    ipAddress: '10.240.0.1'
  }
];

// Helper to construct Trust Graph
export function getTrustGraphData(): TrustGraphData {
  const nodes = [
    // Agents
    ...SEED_AGENTS.map(a => ({
      id: a.id,
      label: a.name,
      subLabel: `${a.code} · Trust: ${a.trustScore}`,
      type: 'agent' as const,
      risk: a.riskTier,
      trustScore: a.trustScore,
      volume: a.totalSpend90d
    })),
    // Owners / Businesses
    ...SEED_BUSINESSES.map(b => ({
      id: b.id,
      label: b.name,
      subLabel: `Owner Org · Cap: ₹${(b.monthlyDiscretionCap / 100000).toFixed(1)}L`,
      type: 'owner' as const,
      risk: 'low' as const
    })),
    // High-volume counterparties & suspicious nodes
    ...SEED_COUNTERPARTIES.slice(0, 18).map(cp => ({
      id: cp.id,
      label: cp.name,
      subLabel: `${cp.category} · Risk: ${cp.riskScore}`,
      type: 'counterparty' as const,
      risk: cp.riskScore > 70 ? ('high' as const) : cp.riskScore > 35 ? ('review' as const) : ('low' as const),
      volume: cp.totalVolume
    }))
  ];

  const edges = [
    // Business to Agent ownership links
    ...SEED_AGENTS.map((a, i) => ({
      id: `edge-owner-${i}`,
      source: a.businessId,
      target: a.id,
      amount: a.currentLimit,
      count: 1,
      tags: ['FACT' as const]
    })),
    // Agent to Counterparties
    { id: 'edge-a01-aws', source: 'agent-a01', target: 'cp-01', amount: 1850000, count: 85, tags: ['FACT' as const] },
    { id: 'edge-a01-gcp', source: 'agent-a01', target: 'cp-02', amount: 1200000, count: 62, tags: ['FACT' as const] },
    { id: 'edge-a02-azure', source: 'agent-a02', target: 'cp-03', amount: 2400000, count: 44, tags: ['FACT' as const] },
    { id: 'edge-a02-aws', source: 'agent-a02', target: 'cp-01', amount: 3100000, count: 90, tags: ['FACT' as const] },
    { id: 'edge-a03-shell', source: 'agent-a03', target: 'cp-shell-01', amount: 289000, count: 1, isSuspiciousLoop: true, tags: ['FACT' as const, 'INFERRED' as const] },
    // Circular Loop Trinity: A-04 -> A-05 -> A-06 -> A-04
    { id: 'edge-circ-1', source: 'agent-a04', target: 'agent-a05', amount: 297000, count: 3, isSuspiciousLoop: true, tags: ['FACT' as const, 'INFERRED' as const] },
    { id: 'edge-circ-2', source: 'agent-a05', target: 'agent-a06', amount: 294600, count: 3, isSuspiciousLoop: true, tags: ['FACT' as const, 'INFERRED' as const] },
    { id: 'edge-circ-3', source: 'agent-a06', target: 'agent-a04', amount: 292500, count: 3, isSuspiciousLoop: true, tags: ['FACT' as const, 'INFERRED' as const] }
  ];

  return {
    nodes,
    edges,
    cycles: [
      ['agent-a04', 'agent-a05', 'agent-a06', 'agent-a04']
    ],
    coordinatedClusters: [
      ['agent-a04', 'agent-a05', 'agent-a06'],
      ['agent-a03', 'cp-shell-01']
    ],
    summary: {
      totalAgents: SEED_AGENTS.length,
      totalCounterparties: SEED_COUNTERPARTIES.length,
      suspiciousCyclesDetected: 1,
      disclaimer: 'EVIDENCE TRACE: TELEMETRY ANOMALY'
    }
  };
}

// Generate Evidence Passport for an agent
export function generateEvidencePassport(agentId: string): EvidencePassport {
  const agent = SEED_AGENTS.find(a => a.id === agentId) || SEED_AGENTS[0];
  const txs = SEED_TRANSACTIONS.filter(t => t.agentId === agent.id);
  const evidence = SEED_EVIDENCE_ITEMS.filter(e => e.agentId === agent.id);
  const permissions = SEED_PERMISSIONS.find(p => p.agentId === agent.id) || SEED_PERMISSIONS[0];

  const isCycle = ['agent-a04', 'agent-a05', 'agent-a06'].includes(agent.id);
  const assessment = CredenceRiskEngine.assessAgent(agent, txs, evidence, isCycle, ['A-04', 'A-05', 'A-06']);

  const totalSpend = txs.reduce((acc, t) => acc + t.amount, 0);
  const successCount = txs.filter(t => t.status === 'completed').length;
  const reversalCount = txs.filter(t => t.status === 'reversed').length;
  const disputeCount = txs.filter(t => t.status === 'disputed').length;
  const avgTicket = txs.length > 0 ? Math.round(totalSpend / txs.length) : 0;
  const maxTicket = txs.length > 0 ? Math.max(...txs.map(t => t.amount)) : 0;

  return {
    agent,
    assessment,
    permissions,
    evidenceItems: evidence.length > 0 ? evidence : SEED_EVIDENCE_ITEMS.slice(0, 3),
    behaviouralSummary: {
      total90dSpend: totalSpend,
      total90dTxCount: txs.length,
      successRate: txs.length > 0 ? Number(((successCount / txs.length) * 100).toFixed(1)) : 100,
      reversalRate: txs.length > 0 ? Number(((reversalCount / txs.length) * 100).toFixed(1)) : 0,
      disputeRate: txs.length > 0 ? Number(((disputeCount / txs.length) * 100).toFixed(1)) : 0,
      avgTicketSize: avgTicket,
      maxTicketSize: maxTicket
    },
    integrityHash: `SHA256:7f9a2e8c1b4d0e6f5a3c9b2d8e1f0a4b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f-${agent.code}`,
    qrPayload: `credence://verify/passport/${agent.id}?code=${agent.code}&trust=${assessment.trustScore}&conf=${assessment.confidence}&issued=2026-10-20`,
    issuedAt: new Date().toISOString(),
    limitationsNote: 'SYNTHETIC SANDBOX DATA. This behavioural trust passport is simulated for evaluation purposes. In production, scores require continuous cryptographic attestation from bank-connected gateways.'
  };
}
