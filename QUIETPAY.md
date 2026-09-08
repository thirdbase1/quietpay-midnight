# QuietPay — Private Payroll & Income Attestations on Midnight

> **One-liner:** Companies and DAOs run payroll on Midnight where the *fact* that everyone was paid on time is public, but *who gets what* is private — and employees can prove income to landlords and banks with a single ZK link, without revealing their salary.
>
> *This project is built on the Midnight Network.* (required ecosystem attribution)

---

## 1. The Problem

- **Salaries on public chains are naked.** Every payroll tx on an EVM chain exposes per-employee amounts to anyone with an address lookup — toxic transparency for teams, a privacy hazard for workers.
- **Employees can't prove income safely.** Renting an apartment, applying for a loan, or getting a visa requires exposing full pay history to third parties who only need a threshold ("≥ 3× rent").
- **DAOs and web3-native teams feel the pain first.** Contributor payments are on-chain by default today; salary disputes and envy directly reduce retention.
- Existing Midnight Finance dApps solve *trading* (LunarSwap, DarkPool, SilentBid, SilentLedger, RWA, ZK Loan) — **none address payment operations**: payroll, invoicing, income attestation. This is a clean category gap in `midnight-awesome-dapps` (verified Sep 2026).

## 2. The Solution

A payroll contract + wallet UI:

```
Employer funds the contract (public total: N NIGHT/DUST)
        │
        ▼
Employer posts payroll MERKLE ROOT (hashes of recipient → amount leaves; amounts stay private)
        │
        ▼
Employee clicks CLAIM → ZK proof of inclusion + per-round nullifier (anti double-claim)
   amount is private; ledger shows "a claim happened, integrity verified"
        │
        ▼
CONSERVATION PROOF: total claimed ≤ total funded — without revealing any leaf
        │
        ▼
ATTESTATION: employee generates "salary ≥ X, employed ≥ M months, verified by contract Y"
   shareable link for landlord / lender — never reveals the actual number
```

### ZK proofs

| Proof | Statement | Revealed |
|---|---|---|
| `inclusion` | "My leaf is inside the funded tree" | nothing |
| `non-double-claim` | per-round nullifier seen once only | nullifier hash |
| `conservation` | sum(private claims) ≤ public funded total | totals only |
| `income-band` | "amount ≥ threshold T, employed ≥ D days" | the boolean + issuer |
| `punctual` | "round R finalized by deadline D" | round metadata |

## 3. Why This Wins *This* Buildathon

Event: AKINDO WaveHack — "Build Privacy-First Apps on Midnight" ($12,500 USDT; W1 3,500 / W2 4,000 / W3 5,000).

| Criterion | Answer |
|---|---|
| **Engineering & implementation** | Merkle-tree claim circuit + nullifiers + dual-state design (public root/total, private leaves) — well beyond tutorial depth, built on the official ZK Loan attestation pattern so risk is bounded |
| **QA & reliability** | Money-safety invariants are property-testable: no double claim, no over-withdrawal, no root reuse, proof soundness on adversarial leaves. Exactly the "reliability" a rubric wants demonstrated, not claimed |
| **Ecosystem use case** | Payments are the highest-frequency on-chain action there is; every DAO on the ecosystem needs this monthly — recurring usage, not demo dust |
| **Adoption ease** | Employee = connect + tap claim (one action). Employer = upload CSV, sign one root. B2B2C: one company onboard = 50 users |
| **Wave iteration** | W1 core payroll → W2 attestation verification on-chain + auditor dashboard → W3 landlord flow (QuietRent) — a progress arc built for milestone-funded judging |

## 4. Architecture

```
React app (Vite+TS) ── MidnightJS SDK ── QuietPay.compact ── Midnight chain
  employer: CSV → tree   wallet connect    public: root,total,   mainnet / preview
  employee: claim        proof client      rounds, nullifiers
  share link              attest API        private: amounts, leaves
```

- Scaffold: Edda Labs `midnight-starter-template` (contracts+tests+UI)
- Wallet: `midnight-wallet-connector` (1AM / Lace); gas in DUST; tDUST faucet for dev
- Tree: fixed-depth Merkle built client-side; amounts never leave browser except as committed leaves
- Attestation W1: ECDSA/Schnorr signature from payroll contract's registered key, verified off-chain by partner portal; **W2 upgrade to on-chain verification** (honest, disclosed tradeoff)
- **Apache 2.0** (buildathon requirement for new Midnight code)

## 5. Payments — both sides

### 5a. Money flow in the product
- Mocked tokens in Wave 1 (buildathon-safe: "mocked transactions, no real-world value" per Midnight challenge guidance). NIGHT/DUST balances simulated via faucet-funded contract.
- Design supports real stablecoin payroll in later waves: employer funds USDT→bridge path; contract holds pool; conservation proof = real treasury audit.
- Revenue model (for pitch credibility): flat monthly fee per employer + attestation-verification fee paid by the *verifier* (landlord/lender), never by the employee.

### 5b. Our grant payout (AKINDO mechanics)
- 12,500 USDT pool **distributed on Ethereum**; judges score each wave; funds sent on-chain to project lead's registered wallet; resubmitting in later waves stacks funding; 10% protocol fee paid by organizer; builders retain IP.
- **Action item:** sign up personally at app.akindo.io with a valid Ethereum USDT receiving address (no temp accounts — rules penalize non-original work/identity abuse).

## 6. Build Plan → Wave 1 (submit Sep 15, 2026)

| Day | Milestone |
|---|---|
| Sep 8–9 | AKINDO registration + wallet · clone starter · devnet running with example-counter |
| Sep 9–11 | `QuietPay.compact`: fund, post-root, claim-with-nullifier; Merkle lib in TS |
| Sep 11–12 | Inclusion circuit + proof client; employee claim UI; conservation check |
| Sep 12–13 | Attestation generator (signed) + share-link viewer; property tests (double-claim, over-withdraw, root-tamper) |
| Sep 13 | README/docs, Apache-2.0, attribution sentence, public repo |
| Sep 14 | 2-min video: company pays 5 employees, one clicks proof-to-landlord · **submit a day early** |
| Sep 27+ | Wave 2: on-chain attestation verification, auditor dashboard, recurring scheduler |

## 7. Risks & Mitigations

- **Merkle circuit in Compact is new ground** → fall back to committee-signed leaves (Schnorr per employee) if circuit time-box is missed; claim story survives, integrity proof weakens — disclose either way
- **Tree rebuild when employer edits a pay period** → design for per-round roots; edits only pre-finalization
- **Attestation privacy leakage (threshold probing)** → rate-limit + issuer binding ("3× rent" bound to renter's claimed rent value), documented as threat model in README
- **Competition with ZK Loan tutorial** → QuietPay reuses the *pattern*, ships a *category nobody has built*; cite lineage in README (judges reward standing on docs)

## 8. Alternatives in the payments category (fallbacks)

1. **SilentInvoice** — private B2B invoicing: contract proves "invoice #ID is paid/overdue" without exposing price lists; adoption wedge is supply-chain finance.
2. **OpenVault** — donations with public totals, private donors (DAO treasuries + charities); simplest to build, weaker adoption flywheel.

## 9. References

- Event/rules: https://app.akindo.io/wave-hacks/jaMZjqPOBsLXvjdG · https://www.risein.com/midnight/akindo-buildathon · https://midnight.network/hackathon/buildathon
- Gap check: https://github.com/midnightntwrk/midnight-awesome-dapps
- Patterns: https://docs.midnight.network/tutorials (ZK Loan, leaderboard, battleship) · https://github.com/eddalabs/midnight-starter-template
- Grant mechanics: https://akindo.io/ FAQ
