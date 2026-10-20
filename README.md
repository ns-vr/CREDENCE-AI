# CREDENCE · Behavioural Trust & Financial Access Intelligence for AI Agents

> **Track:** AI as a Financial Participant, Direction E (Small-business Finance Assistant)  
> **Tagline:** *"Trust earned. Autonomy justified."*

---

## 1. Executive Summary

**CREDENCE** is a financial trust-assessment and access-control platform that enables SMEs and banks to safely deploy autonomous AI agents for supplier procurement, recurring invoices, and programmatic disbursements.

Instead of granting financial autonomy based on transaction volume or static credit scores, CREDENCE enforces a core principle: **an agent earns autonomy through verified, consistent behaviour over time, not transaction volume.**

### Non-Negotiable Honesty Rules (Built into UI & Engine):
1. **Persistent Sandbox Notice:** All data is **SYNTHETIC** (`SANDBOX · SYNTHETIC DATA` badge displayed persistently).
2. **Indicator, Not Proof:** Graph flags and cyclic loops are indicators for human investigation, not proof of fraud.
3. **No Autonomous Fund Movement:** CREDENCE recommends access boundaries and simulates stress outcomes. It does not move real bank funds or issue credit lines.
4. **Epistemic Humility:** Missing historical telemetry is **never** treated as proof of untrustworthiness or fraud. When evidence is thin (e.g. brand-new Agent A-12), the engine honestly returns `ABSTAIN` (human supervisor co-signing required).

---

## 2. Architecture & Design Tokens

### Dual Colour Scheme (Green Brand Constitution)
- **Daylight (Light Mode, Dashboard Default):**
  - Crisp White (`#FFFFFF`), Soft Stone (`#F3F4F6`), Hairline (`#E1E7E4`)
  - Abyss Ink (`#051F20`), Muted Pine (`#4B635C`)
  - Moss (`#235347`), Forest (`#163832`), Sage (`#8EB69B`), Mint Mist (`#DAF1DE`)
- **Deep Forest (Dark Mode & Cinematic Homepage):**
  - Abyss (`#051F20`), Pine (`#0B2B26`), Forest (`#163832`), Moss (`#235347`)
  - Sage (`#8EB69B`), Mint Mist (`#DAF1DE`), Glow Mint (`#5FD3A0`)
  - Caution Amber (`#E9B44C`), Alarm Coral (`#F0506E`) for cyclic anomaly highlights

---

## 3. Key Feature Walkthrough

### 3A. Cinematic Homepage with Three.js 3D Constellation
- **3D Constellation Scene:** Rotating constellation of agent, owner, and counterparty nodes in Sage and Mint. Animated light pulses travel along edges like transactions. A triangular cluster turns Alarm Coral (`#F0506E`), representing a cyclic loop anomaly, before being swept and resolved by a Glow Mint scan ring.
- **Interactive Adaptive Limit Dial:** Real-time spending limit dial that dynamically raises/lowers as a risk slider moves.
- **3D Tilting Evidence Passport:** Flip card displaying cryptographic SHA-256 seal and 5-dimension radar breakdown.
- **Interactive Mini-Graph:** Live directed subnetwork preview with hoverable nodes.
- **Live Synthetic Ticker:** Real-time event ticker broadcasting verified and flagged payments.

### 3B. Instant 1-Click Demo Personas
Judges can log into the console with a single click as:
- **Devika Sharma** (VP Operations / Business Owner)
- **Karan Singhal** (Chief Financial Officer / Finance Manager)
- **Sanjay Mehta** (Senior Risk & Compliance Analyst)
- **Anoop Nair** (Axis Bank SME Reviewer)
- **Platform Security Officer** (Admin)

### 3C. Complete 10-View Dashboard
1. **Overview:** 4 KPI cards with sparklines, Spend vs Approved Limit area chart, Portfolio Risk Gauge with confidence band, Anomaly Heatmap (agent × 7 days), 5D Evidence Quality Radar, Top Counterparties, Live Investigation Stream, and Agents Directory.
2. **Agents:** Detailed list of 12 synthetic agents with filterable status, trust scores, and risk tiers.
3. **Agent Detail:** Explainable SHAP-style positive/negative factor attribution, hardware TPM enclave scopes, and evidence provenance records.
4. **Transactions:** Filterable, sortable ledger of 5,040+ synthetic transactions with CSV export and side inspection drawer (Z-score deviation, FACT vs INFERRED tags).
5. **Trust Graph (Signature Feature):** Directed graph with circular flow detection (A-04 $\to$ A-05 $\to$ A-06 $\to$ A-04) in Coral, animated flow particles, layout toggles (Force / Hierarchical / Sankey), and deep forensic evidence inspection.
6. **Adaptive Access:** Dynamic limit recommendations, approval gates, and human override with mandatory logged justification.
7. **What-If Simulator:** Interactive stress testing with spend spike sliders, offshore shell vendor injections, repeated gateway failures, and stale evidence depreciation.
8. **Evidence Passport:** Exportable, printable compliance report with SHA-256 integrity hash and QR verification payload.
9. **Monitoring & Alerts:** Streaming alert workflow (`new` $\to$ `reviewing` $\to$ `resolved`) and circuit breaker threshold sliders.
10. **Privacy & Audit:** Immutable audit trail, RBAC permission matrix, field-level minimisation, and demo vs live rail isolation.

---

## 4. Run & Verification

Run the full-stack server on port 3000:
```bash
npm run dev
# or
npm run build && npm start
```
