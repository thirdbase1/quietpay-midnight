# AKINDO paste-ready - QuietPay Wave 1
## Title
QuietPay - Private Payroll on Midnight
## One-liner
Public proof everyone was paid, private salaries, ZK income checks.
## Description
QuietPay is a payroll vault on Midnight. Employer funds and posts a root.
Employees claim with nullifiers. Totals stay public, amounts stay private.
Verifiers see only a threshold boolean. Built with Compact circuits.
## Progress in this Wave
New QuietPay compact contract with fund, postRoot, claim, proofs.
Nullifier anti double-claim plus conservation check.
README with setup and test path, deck, demo video.
## Links to include
GitHub repo URL here after push. Add midnightntwrk topic.
Demo video URL here. Deck PDF attached.
## Eligibility notes
Mock tokens only. Apache-2.0. New Midnight code built Sep 8 to 15.
See PROGRESS STATEMENT for Wave 1 proof of work.
See JUDGING MAP for criterion evidence links.
Contact via TEAM sheet after repo push.
## Conservation guarantee
Total claimed never exceeds total funded, enforced inside every claim circuit.
Equation: claimedTotal <= fundedTotal holds after every transaction.
Each nullifier binds to one employee secret, so no salary can be claimed twice.
## Honest caveats
Wave 1 uses mock tokens with no real value.
Nullifier binding is single round, multi round binding ships in Wave 2.
Threshold proofs reveal only a boolean, amounts stay sealed.
Public claim counts may reveal team size.
No external audit yet, circuits are new code under review.
Repo https://github.com/thirdbase1/quietpay-midnight with CI green and midnightntwrk topic.
Contract address and tx hashes go here after preprod deploy.
