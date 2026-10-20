import { 
  Agent, 
  Transaction, 
  EvidenceItem, 
  Assessment, 
  AccessDecision, 
  FactorContribution, 
  RiskTier,
  SimulationScenario,
  SimulationResult
} from '../types/credence';

/**
 * CREDENCE Risk & Trust Assessment Engine
 * Transparent, statistical + rules-based engine with zero black box.
 * Computes behavioural trust, evidence confidence, graph cycle penalties,
 * and adaptive autonomous financial access recommendations.
 */

export class CredenceRiskEngine {
  /**
   * Evaluates evidence quality score (0 - 100)
   */
  static evaluateEvidenceQuality(items: EvidenceItem[]): {
    freshness: number;
    coverage: number;
    verification: number;
    consistency: number;
    contradiction: number;
    overall: number;
  } {
    if (!items || items.length === 0) {
      return { freshness: 20, coverage: 15, verification: 25, consistency: 20, contradiction: 0, overall: 16 };
    }

    const byDim = (dim: string) => {
      const match = items.filter(i => i.dimension === dim);
      if (match.length === 0) return 30;
      return match.reduce((acc, curr) => acc + curr.score, 0) / match.length;
    };

    const freshness = byDim('freshness');
    const coverage = byDim('coverage');
    const verification = byDim('verification');
    const consistency = byDim('consistency');
    const contradiction = byDim('contradiction');

    // Contradiction acts as a penalty
    const base = (freshness * 0.25) + (coverage * 0.25) + (verification * 0.3) + (consistency * 0.2);
    const overall = Math.max(5, Math.min(100, Math.round(base - (contradiction * 0.25))));

    return { freshness, coverage, verification, consistency, contradiction, overall };
  }

  /**
   * Main assessment evaluation for an agent
   */
  static assessAgent(
    agent: Agent,
    agentTransactions: Transaction[],
    evidenceItems: EvidenceItem[],
    isPartOfCycle: boolean = false,
    cyclePeers: string[] = []
  ): Assessment {
    const evidenceQuality = this.evaluateEvidenceQuality(evidenceItems);
    const factors: FactorContribution[] = [];
    const triggeredRules: string[] = [];

    // Check if brand new agent (Epistemic Humility Rule)
    if (agent.isBrandNew || agentTransactions.length < 5 || agent.createdDaysAgo < 5) {
      factors.push({
        factor: 'Brand-New Agent Status',
        contribution: 0,
        description: 'Insufficient observed transaction history to determine behavioural trust.'
      });
      factors.push({
        factor: 'Provisional Sandbox Stage',
        contribution: 0,
        description: 'Baseline distribution not yet established.'
      });

      return {
        id: `assess-${agent.id}-${Date.now()}`,
        agentId: agent.id,
        trustScore: 50,
        confidence: 0.18,
        abstained: true,
        abstainReason: 'Insufficient historical evidence (epistemic uncertainty). Missing history is never penalized as fraud, but requires human supervisor approval prior to granting autonomy.',
        recommendation: 'ABSTAIN',
        recommendedLimit: 0,
        previousLimit: agent.currentLimit,
        approvalThreshold: 0,
        topFactors: factors,
        triggeredRules: ['RULE_INSUFFICIENT_HISTORY_ABSTAIN', 'RULE_PROVISIONAL_RESTRICTION'],
        generatedAt: new Date().toISOString()
      };
    }

    // 1. Transaction Success / Failure / Reversal Behaviour
    const totalTx = agentTransactions.length;
    const completedTx = agentTransactions.filter(t => t.status === 'completed').length;
    const failedTx = agentTransactions.filter(t => t.status === 'failed').length;
    const reversedTx = agentTransactions.filter(t => t.status === 'reversed').length;
    const disputedTx = agentTransactions.filter(t => t.status === 'disputed').length;

    const failureRate = (failedTx / totalTx) * 100;
    const reversalRate = ((reversedTx + disputedTx) / totalTx) * 100;

    let score = 75; // Neutral starting base

    // Factor 1: Success Rate
    if (failureRate < 2.0 && reversalRate === 0) {
      score += 15;
      factors.push({
        factor: 'High Payment Execution Integrity',
        contribution: +15,
        description: `98%+ completion rate with 0 disputes across ${totalTx} transactions.`
      });
    } else if (failureRate > 10.0 || reversalRate > 4.0) {
      const penalty = Math.min(30, Math.round(failureRate * 1.5 + reversalRate * 3));
      score -= penalty;
      factors.push({
        factor: 'Elevated Reversals & Failed Handshakes',
        contribution: -penalty,
        description: `${failureRate.toFixed(1)}% failure rate and ${reversedTx + disputedTx} reversed/disputed payments.`
      });
      triggeredRules.push('RULE_HIGH_FAILURE_REVERSAL_RATE');
    }

    // Factor 2: Amount Variance and Z-Score Outliers
    const highZScoreTx = agentTransactions.filter(t => t.zScore > 2.5);
    if (highZScoreTx.length > 0) {
      const penalty = Math.min(22, highZScoreTx.length * 6);
      score -= penalty;
      factors.push({
        factor: 'Ticket-Size Baseline Deviation',
        contribution: -penalty,
        description: `${highZScoreTx.length} transactions exhibited anomalous ticket size (z-score > 2.5).`
      });
      triggeredRules.push('RULE_ZSCORE_DEVIATION_SPIKE');
    } else {
      score += 8;
      factors.push({
        factor: 'Consistent Ticket Sizing',
        contribution: +8,
        description: 'Transactions closely adhere to historical baseline distribution.'
      });
    }

    // Factor 3: Counterparty Trust & Unverified Entities
    const newCounterpartyTx = agentTransactions.filter(t => t.isNewCounterparty);
    const newCounterpartyRatio = newCounterpartyTx.length / totalTx;
    if (newCounterpartyRatio > 0.35) {
      score -= 16;
      factors.push({
        factor: 'Sudden Flow to Unverified Counterparties',
        contribution: -16,
        description: `${Math.round(newCounterpartyRatio * 100)}% of transactions directed to first-time or untrusted vendors.`
      });
      triggeredRules.push('RULE_NEW_COUNTERPARTY_SURGE');
    }

    // Factor 4: Graph Cycle / Circular Flow Anomaly
    if (isPartOfCycle) {
      score -= 28;
      factors.push({
        factor: 'Graph Anomaly: Closed Circular Flow Loop',
        contribution: -28,
        description: `Detected in rapid closed cyclic fund transfers with agents ${cyclePeers.join(', ')}.`
      });
      triggeredRules.push('RULE_GRAPH_CIRCULAR_LOOP_DETECTED');
    }

    // Factor 5: Evidence Quality & Telemetry Freshness
    if (evidenceQuality.freshness < 40) {
      score -= 12;
      factors.push({
        factor: 'Stale Evidence & Expired Credentials',
        contribution: -12,
        description: 'Telemetry and credential verification has aged beyond 60-day confidence window.'
      });
      triggeredRules.push('RULE_STALE_EVIDENCE_DEPRECIATION');
    } else if (evidenceQuality.overall > 80) {
      score += 10;
      factors.push({
        factor: 'Verified Telemetry & High Coverage',
        contribution: +10,
        description: 'Continuous cryptographic heartbeat and complete policy audit trails.'
      });
    }

    // Bound Trust Score
    const finalTrustScore = Math.max(5, Math.min(100, Math.round(score)));

    // Confidence Calculation: function of evidence quality + transaction volume
    const volumeFactor = Math.min(1.0, totalTx / 40);
    const confidence = Number((((evidenceQuality.overall / 100) * 0.6) + (volumeFactor * 0.4)).toFixed(2));

    // Access Recommendation Mapping
    let recommendation: AccessDecision = 'MAINTAIN';
    let recommendedLimit = agent.currentLimit;
    let approvalThreshold = agent.approvalThreshold;

    if (confidence < 0.45) {
      recommendation = 'ABSTAIN';
      recommendedLimit = agent.currentLimit;
      triggeredRules.push('RULE_CONFIDENCE_BELOW_THRESHOLD_ABSTAIN');
    } else if (finalTrustScore >= 82 && isPartOfCycle === false && highZScoreTx.length === 0) {
      recommendation = 'INCREASE_CAUTIOUSLY';
      recommendedLimit = Math.round(agent.currentLimit * 1.25);
      approvalThreshold = Math.round(agent.currentLimit * 0.5);
    } else if (finalTrustScore >= 65) {
      recommendation = 'MAINTAIN';
      recommendedLimit = agent.currentLimit;
    } else if (finalTrustScore >= 45) {
      recommendation = 'REQUIRE_APPROVAL';
      recommendedLimit = Math.round(agent.currentLimit * 0.7);
      approvalThreshold = Math.round(agent.baselineTxSize * 0.8);
      triggeredRules.push('RULE_REQUIRE_HUMAN_DUAL_SIGN');
    } else {
      recommendation = 'RESTRICT';
      recommendedLimit = Math.round(agent.currentLimit * 0.2);
      approvalThreshold = 0;
      triggeredRules.push('RULE_EXCESSIVE_RISK_RESTRICTION');
    }

    return {
      id: `assess-${agent.id}-${Date.now()}`,
      agentId: agent.id,
      trustScore: finalTrustScore,
      confidence,
      abstained: false,
      recommendation,
      recommendedLimit,
      previousLimit: agent.currentLimit,
      approvalThreshold,
      topFactors: factors,
      triggeredRules,
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Run What-If Simulation
   */
  static runSimulation(
    agent: Agent,
    transactions: Transaction[],
    evidence: EvidenceItem[],
    scenario: SimulationScenario
  ): SimulationResult {
    // Current Baseline Assessment
    const baseAssessment = this.assessAgent(agent, transactions, evidence, false, []);
    
    // Create mutated synthetic transactions
    let mutatedTransactions: Transaction[] = transactions.map(t => ({
      ...t,
      amount: scenario.spendSpikeMultiplier > 1 ? Math.round(t.amount * scenario.spendSpikeMultiplier) : t.amount,
      zScore: scenario.spendSpikeMultiplier > 1.5 ? t.zScore + (scenario.spendSpikeMultiplier * 1.2) : t.zScore
    }));

    if (scenario.addSuspiciousCounterparty) {
      // Inject 8 high-value transfers to unverified overseas shell company
      const injected: Transaction[] = Array.from({ length: 8 }, (_, i) => ({
        id: `sim-tx-inj-${i}`,
        agentId: agent.id,
        agentCode: agent.code,
        agentName: agent.name,
        counterpartyId: 'cp-dark-nexus',
        counterpartyName: 'AeroLux Global Shell LLC',
        category: 'Uncategorized Payout',
        amount: Math.round(agent.baselineTxSize * 3.8),
        currency: 'INR',
        status: 'completed',
        riskLevel: 'suspicious',
        flagReason: 'Sudden high-velocity payment to freshly registered shell vendor',
        timestamp: new Date(Date.now() - (i * 3600000)).toISOString(),
        zScore: 3.4,
        deviationScore: 88,
        isNewCounterparty: true,
        requiresApproval: true
      }));
      mutatedTransactions = [...injected, ...mutatedTransactions];
    }

    if (scenario.repeatedFailures) {
      mutatedTransactions = mutatedTransactions.map((t, idx) => {
        if (idx % 3 === 0) {
          return {
            ...t,
            status: 'failed' as const,
            flagReason: 'Card authorization rejected by merchant gateway'
          };
        }
        if (idx % 7 === 0) {
          return {
            ...t,
            status: 'reversed' as const,
            flagReason: 'Duplicate clearing dispute detected'
          };
        }
        return t;
      });
    }

    // Mutate evidence
    let mutatedEvidence = [...evidence];
    if (scenario.staleEvidence) {
      mutatedEvidence = mutatedEvidence.map(e => ({
        ...e,
        score: Math.max(10, Math.round(e.score * 0.35)),
        status: 'stale' as const
      }));
    }

    const isCycle = scenario.coordinatedMultiAgent;
    const cyclePeers = isCycle ? ['A-04 (Delta)', 'A-05 (Starlight)'] : [];

    const simAssessment = this.assessAgent(
      agent,
      mutatedTransactions,
      mutatedEvidence,
      isCycle,
      cyclePeers
    );

    const getTier = (score: number, rec: AccessDecision): RiskTier => {
      if (rec === 'RESTRICT' || score < 50) return 'high';
      if (rec === 'REQUIRE_APPROVAL' || score < 75) return 'review';
      return 'low';
    };

    return {
      before: {
        trustScore: baseAssessment.trustScore,
        confidence: baseAssessment.confidence,
        riskTier: getTier(baseAssessment.trustScore, baseAssessment.recommendation),
        recommendation: baseAssessment.recommendation,
        recommendedLimit: baseAssessment.recommendedLimit
      },
      after: {
        trustScore: simAssessment.trustScore,
        confidence: simAssessment.confidence,
        riskTier: getTier(simAssessment.trustScore, simAssessment.recommendation),
        recommendation: simAssessment.recommendation,
        recommendedLimit: simAssessment.recommendedLimit,
        trustScoreDelta: simAssessment.trustScore - baseAssessment.trustScore
      },
      triggeredRules: simAssessment.triggeredRules,
      factors: simAssessment.topFactors,
      graphImpact: {
        addedEdgesCount: scenario.addSuspiciousCounterparty ? 8 : (scenario.coordinatedMultiAgent ? 6 : 0),
        cycleDetected: scenario.coordinatedMultiAgent,
        flaggedNodes: scenario.coordinatedMultiAgent 
          ? [agent.id, 'agent-a04', 'agent-a05'] 
          : (scenario.addSuspiciousCounterparty ? [agent.id, 'cp-dark-nexus'] : [])
      }
    };
  }
}
