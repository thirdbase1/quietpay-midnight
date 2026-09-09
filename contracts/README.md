# QuietPay contract
Compact payroll vault with nullifier claims and threshold proofs.
## Ledgers
- Admin key, totals, payroll root, round counter, nullifier map
## Circuits
- fund, postRoot, claim, proveIncomeAbove, nextRound, plus read helpers
## Witnesses
- Admin secret, employee secret, and claim amount stay private
## Compile
- Run proof server on port 6300, then npm run compact in this folder
## Tests
- See src TESTPLAN for the four invariants
