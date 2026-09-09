[![CI](https://github.com/thirdbase1/quietpay-midnight/actions/workflows/ci.yaml/badge.svg)](https://github.com/thirdbase1/quietpay-midnight/actions)

# QuietPay - Private Payroll and Income Attestations on Midnight
> This project is built on the Midnight Network.
## One-liner
Companies run payroll where on-time payment is public but salaries stay private.
Employees prove income thresholds with ZK without revealing pay.
## Problem
Public-chain payroll exposes every salary. Income checks leak full history.
DAOs pay on-chain today, so envy and disputes hurt retention.
## Solution
Employer funds vault, posts payroll root. Employee claims with nullifier.
Conservation holds publicly. Income proof reveals only a boolean.
## Midnight integration
Compact private witnesses for secrets and amounts.
Public ledger holds root, totals, nullifiers, round state.
Circuits: fund, postRoot, claim, proveIncomeAbove, nextRound.
Lineage: midnightntwrk example-bboard plus compact-by-example Map pattern.
## How to test
1. Start proof server on port 6300.
2. Compile contract with compact 0.31.0 or later.
3. Fund 10000 mock units, post root, claim twice to see second fail.
4. Check totals show claimed versus funded with amounts hidden.
## Wave 1 scope
Single-round payroll with nullifier claims and threshold proofs.
Mock tokens only, no real value. On-chain attestation verify moves to Wave 2.
## License
Apache-2.0 for new Midnight code. See LICENSE.
## Repo guide
- Start with FILEMAP then JUDGING MAP then COUNTDOWN
- Contract details live in contracts README and COMPILE NOTES
- Demo path is VIDEO SCRIPT plus DEMO STEPS plus SHOTLIST
Status is Wave 1 draft ready for push compile and video.
