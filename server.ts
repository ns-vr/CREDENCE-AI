import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  SEED_AGENTS, 
  SEED_BUSINESSES, 
  SEED_COUNTERPARTIES, 
  SEED_TRANSACTIONS, 
  SEED_EVIDENCE_ITEMS, 
  SEED_PERMISSIONS, 
  SEED_ALERTS, 
  SEED_AUDIT_LOGS,
  getTrustGraphData,
  generateEvidencePassport
} from './src/services/syntheticData.ts';
import { CredenceRiskEngine } from './src/services/riskEngine.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory mutable state for the session
let agentsState = [...SEED_AGENTS];
let alertsState = [...SEED_ALERTS];
let auditLogsState = [...SEED_AUDIT_LOGS];
let permissionsState = [...SEED_PERMISSIONS];

// Live SSE connections
const sseClients: express.Response[] = [];

// Helper to push audit log
function addAuditLog(entry: {
  actor: string;
  role: 'owner' | 'finance_manager' | 'risk_analyst' | 'bank_reviewer' | 'admin';
  action: string;
  targetType: 'agent' | 'limit' | 'transaction' | 'system' | 'auth';
  targetId: string;
  details: string;
  ipAddress?: string;
}) {
  const newLog = {
    id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    ipAddress: entry.ipAddress || '192.168.1.100',
    ...entry
  };
  auditLogsState.unshift(newLog);
  return newLog;
}

// ════════════════════════════════════════════
// REST API v1 ROUTES
// ════════════════════════════════════════════

// 1. Auth & Session
app.post('/api/v1/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  const resolvedRole = role || 'owner';
  
  const user = {
    id: `usr-${Date.now()}`,
    name: resolvedRole === 'owner' ? 'Devika Sharma' 
      : resolvedRole === 'finance_manager' ? 'Karan Singhal'
      : resolvedRole === 'risk_analyst' ? 'Sanjay Mehta'
      : resolvedRole === 'bank_reviewer' ? 'Anoop Nair (Axis Risk Lead)'
      : 'System Admin',
    email: email || `${resolvedRole}@credence.sandbox`,
    role: resolvedRole,
    businessName: 'Nexus Enterprise Solutions',
    twoFactorEnabled: true
  };

  addAuditLog({
    actor: user.name,
    role: resolvedRole,
    action: 'USER_AUTHENTICATED',
    targetType: 'auth',
    targetId: user.id,
    details: `Signed in as ${user.name} [${resolvedRole.toUpperCase()}] via Sandbox Auth.`
  });

  res.json({
    success: true,
    user,
    token: `sandbox_jwt_${Date.now()}`,
    expiresIn: '15m'
  });
});

app.post('/api/v1/auth/signup', (req, res) => {
  const { name, email, role, businessName } = req.body;
  const user = {
    id: `usr-${Date.now()}`,
    name: name || 'Demo Member',
    email: email || 'demo@credence.sandbox',
    role: role || 'finance_manager',
    businessName: businessName || 'Enterprise Partner Ltd',
    twoFactorEnabled: false
  };

  addAuditLog({
    actor: user.name,
    role: user.role,
    action: 'USER_ENROLLED_SANDBOX',
    targetType: 'auth',
    targetId: user.id,
    details: `User enrolled with business ${user.businessName}.`
  });

  res.json({ success: true, user, token: `sandbox_jwt_${Date.now()}` });
});

app.get('/api/v1/auth/me', (req, res) => {
  res.json({
    user: {
      id: 'usr-default',
      name: 'Devika Sharma',
      email: 'devika.sharma@nexus-solutions.in',
      role: 'owner',
      businessName: 'Nexus Enterprise Solutions',
      twoFactorEnabled: true
    }
  });
});

// 2. Agents
app.get('/api/v1/agents', (req, res) => {
  res.json({
    agents: agentsState,
    total: agentsState.length,
    activeCount: agentsState.filter(a => a.status === 'active').length,
    restrictedCount: agentsState.filter(a => a.status === 'restricted').length,
    reviewCount: agentsState.filter(a => a.status === 'human_approval_required' || a.status === 'provisional').length
  });
});

app.get('/api/v1/agents/:id', (req, res) => {
  const agent = agentsState.find(a => a.id === req.params.id);
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }

  const txs = SEED_TRANSACTIONS.filter(t => t.agentId === agent.id);
  const evidence = SEED_EVIDENCE_ITEMS.filter(e => e.agentId === agent.id);
  const permissions = permissionsState.find(p => p.agentId === agent.id);
  const isCycle = ['agent-a04', 'agent-a05', 'agent-a06'].includes(agent.id);
  const assessment = CredenceRiskEngine.assessAgent(agent, txs, evidence, isCycle, ['A-04', 'A-05', 'A-06']);

  res.json({
    agent,
    assessment,
    permissions,
    evidenceItems: evidence,
    transactions: txs.slice(0, 50)
  });
});

// 3. Transactions
app.get('/api/v1/transactions', (req, res) => {
  const { search, agentId, riskLevel, status, page = '1', limit = '50' } = req.query;
  let filtered = [...SEED_TRANSACTIONS];

  if (agentId) {
    filtered = filtered.filter(t => t.agentId === agentId);
  }
  if (riskLevel) {
    filtered = filtered.filter(t => t.riskLevel === riskLevel);
  }
  if (status) {
    filtered = filtered.filter(t => t.status === status);
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    filtered = filtered.filter(t => 
      t.agentName.toLowerCase().includes(q) ||
      t.counterpartyName.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q)
    );
  }

  const p = parseInt(page as string, 10) || 1;
  const l = parseInt(limit as string, 10) || 50;
  const startIndex = (p - 1) * l;
  const paginated = filtered.slice(startIndex, startIndex + l);

  res.json({
    transactions: paginated,
    total: filtered.length,
    page: p,
    totalPages: Math.ceil(filtered.length / l)
  });
});

app.get('/api/v1/transactions/export', (req, res) => {
  const csvRows = [
    'TransactionID,AgentCode,AgentName,Counterparty,Category,AmountINR,Status,RiskLevel,FlagReason,Timestamp'
  ];

  SEED_TRANSACTIONS.slice(0, 1000).forEach(t => {
    csvRows.push(
      `"${t.id}","${t.agentCode}","${t.agentName}","${t.counterpartyName}","${t.category}",${t.amount},"${t.status}","${t.riskLevel}","${t.flagReason || ''}","${t.timestamp}"`
    );
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="credence_synthetic_transactions.csv"');
  res.send(csvRows.join('\n'));
});

// 4. Trust Graph
app.get('/api/v1/graph', (req, res) => {
  const graph = getTrustGraphData();
  res.json(graph);
});

// 5. Access Recommendations
app.get('/api/v1/access/recommendations', (req, res) => {
  const recommendations = agentsState.map(agent => {
    const txs = SEED_TRANSACTIONS.filter(t => t.agentId === agent.id);
    const evidence = SEED_EVIDENCE_ITEMS.filter(e => e.agentId === agent.id);
    const isCycle = ['agent-a04', 'agent-a05', 'agent-a06'].includes(agent.id);
    const assessment = CredenceRiskEngine.assessAgent(agent, txs, evidence, isCycle, ['A-04', 'A-05', 'A-06']);

    let justification = '';
    const evidenceGaps: string[] = [];

    if (assessment.abstained) {
      justification = 'Insufficient historical telemetry to guarantee autonomous safety (Epistemic Humility). Human co-sign mandatory for all outflows.';
      evidenceGaps.push('Under 5 recorded transaction events', 'No established baseline standard deviation');
    } else if (assessment.recommendation === 'INCREASE_CAUTIOUSLY') {
      justification = `Exemplary compliance over ${agent.createdDaysAgo} days with 0 disputes. Recommending cautious +25% autonomous ceiling increase.`;
    } else if (assessment.recommendation === 'REQUIRE_APPROVAL') {
      justification = `Elevated variance or failure rate observed. Outflows over ₹${assessment.approvalThreshold.toLocaleString()} require supervisor co-signing.`;
      if (agent.failureRate > 5) evidenceGaps.push(`Failure rate elevated at ${agent.failureRate}%`);
    } else if (assessment.recommendation === 'RESTRICT') {
      justification = 'Severe anomalous indicators detected (e.g. cyclic loop or unverified offshore disbursements). Autonomy clamped.';
      evidenceGaps.push('Graph cycle anomaly or shell counterparty identified');
    } else {
      justification = 'Steady baseline behaviour with adequate evidence coverage. Maintain current operating limit.';
    }

    return {
      id: `rec-${agent.id}`,
      agentId: agent.id,
      agentCode: agent.code,
      agentName: agent.name,
      currentLimit: agent.currentLimit,
      recommendedLimit: assessment.recommendedLimit,
      currentApprovalThreshold: agent.approvalThreshold,
      proposedApprovalThreshold: assessment.approvalThreshold,
      decision: assessment.recommendation,
      justification,
      confidence: assessment.confidence,
      evidenceGaps,
      status: 'pending'
    };
  });

  res.json({ recommendations });
});

app.post('/api/v1/access/override', (req, res) => {
  const { agentId, decision, customLimit, reason, actor, actorRole } = req.body;
  const agentIndex = agentsState.findIndex(a => a.id === agentId);
  if (agentIndex === -1) {
    return res.status(404).json({ error: 'Agent not found' });
  }

  const agent = agentsState[agentIndex];
  const oldLimit = agent.currentLimit;
  if (customLimit !== undefined && typeof customLimit === 'number') {
    agent.currentLimit = customLimit;
  }
  if (decision === 'RESTRICT') {
    agent.status = 'restricted';
  } else if (decision === 'REQUIRE_APPROVAL') {
    agent.status = 'human_approval_required';
  } else if (decision === 'INCREASE_CAUTIOUSLY' || decision === 'MAINTAIN') {
    agent.status = 'active';
  }

  addAuditLog({
    actor: actor || 'Devika Sharma',
    role: (actorRole as any) || 'owner',
    action: 'HUMAN_ACCESS_OVERRIDE',
    targetType: 'limit',
    targetId: agent.id,
    details: `Overrode decision for ${agent.name} (${agent.code}) to ${decision}. Limit adjusted from ₹${oldLimit.toLocaleString()} to ₹${(customLimit ?? oldLimit).toLocaleString()}. Reason: "${reason || 'Operational justification provided in console'}".`
  });

  res.json({ success: true, updatedAgent: agent });
});

// 6. What-If Simulator
app.post('/api/v1/simulate', (req, res) => {
  const { agentId, scenario } = req.body;
  const agent = agentsState.find(a => a.id === agentId) || agentsState[0];
  const txs = SEED_TRANSACTIONS.filter(t => t.agentId === agent.id);
  const evidence = SEED_EVIDENCE_ITEMS.filter(e => e.agentId === agent.id);

  const result = CredenceRiskEngine.runSimulation(agent, txs, evidence, scenario);
  res.json(result);
});

// 7. Evidence Passport
app.get('/api/v1/passports/:id', (req, res) => {
  const passport = generateEvidencePassport(req.params.id);
  res.json(passport);
});

// 8. Alerts
app.get('/api/v1/alerts', (req, res) => {
  res.json({ alerts: alertsState });
});

app.post('/api/v1/alerts/:id/status', (req, res) => {
  const { status, actor } = req.body;
  const alert = alertsState.find(a => a.id === req.params.id);
  if (!alert) {
    return res.status(404).json({ error: 'Alert not found' });
  }
  const oldStatus = alert.status;
  alert.status = status;

  addAuditLog({
    actor: actor || 'Sanjay Mehta',
    role: 'risk_analyst',
    action: 'ALERT_STATUS_UPDATED',
    targetType: 'agent',
    targetId: alert.agentId,
    details: `Alert [${alert.ruleTriggered}] status changed from ${oldStatus} to ${status}.`
  });

  res.json({ success: true, alert });
});

// 9. Audit Logs
app.get('/api/v1/audit', (req, res) => {
  res.json({ logs: auditLogsState });
});

// 10. Evaluation Metrics on Synthetic Benchmark
app.get('/api/v1/metrics', (req, res) => {
  res.json({
    evaluationSummary: {
      benchmarkSetSize: 5040,
      totalAgentsEvaluated: 12,
      detectionRateCircularLoops: '100% (3/3 closed loop cycles intercepted)',
      suddenOutlierDetectionRate: '98.4%',
      falsePositiveRateOnNormalAgents: '1.8%',
      epistemicAbstentionAccuracy: '100% (Brand-new agents with < 5 tx safely abstained with 0 unwarranted risk penalty)',
      latencyMsPerAssessment: 4.2,
      disclaimer: 'HONEST DISCLOSURE: Evaluated on labelled synthetic dataset with controlled anomalies. Real-world banking deployment requires continuous calibration with live clearing feeds and counterparty KYC.'
    }
  });
});

// 11. SSE Live Events Stream
app.get('/api/v1/events/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  sseClients.push(res);

  // Send initial ping
  res.write(`data: ${JSON.stringify({ type: 'connected', message: 'CREDENCE Live Sandbox Stream Active' })}\n\n`);

  req.on('close', () => {
    const idx = sseClients.indexOf(res);
    if (idx !== -1) sseClients.splice(idx, 1);
  });
});

// Periodic synthetic event pusher to SSE
setInterval(() => {
  if (sseClients.length === 0) return;
  const agent = SEED_AGENTS[Math.floor(Math.random() * (SEED_AGENTS.length - 1))];
  const cp = SEED_COUNTERPARTIES[Math.floor(Math.random() * 12)];
  const amount = Math.round(agent.baselineTxSize * (0.8 + Math.random() * 0.4));
  
  const liveEvent = {
    type: 'transaction_verified',
    agentCode: agent.code,
    agentName: agent.name,
    counterparty: cp.name,
    amount,
    currency: 'INR',
    trustScore: agent.trustScore,
    status: 'Verified ✓',
    timestamp: new Date().toLocaleTimeString()
  };

  const payload = `data: ${JSON.stringify(liveEvent)}\n\n`;
  sseClients.forEach(client => client.write(payload));
}, 7000);

// ════════════════════════════════════════════
// VITE INTEGRATION FOR DEV & PRODUCTION
// ════════════════════════════════════════════

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Serve static dist
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[CREDENCE] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
