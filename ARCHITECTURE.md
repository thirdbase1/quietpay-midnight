# QuietPay architecture
App calls MidnightJS which calls Compact circuits on preprod.
Public state holds root totals nullifiers and round flag.
Private state holds admin secret employee secret and claim amount.
Flow is fund then postRoot then claim then proveIncomeAbove.
Threat model rate limits threshold probes to reduce leakage.
Wave 2 adds on-chain verify plus auditor view.
