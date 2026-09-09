# NullPay Wave 1 Playbook - adapted for QuietPay on Midnight
Study date 2026-09-09. Source is NullPay on Aleo: frontend geekofdhruv/NullPay, backend ashishexee/nullpay-backend, Leo programs v1 to v29, Aleo x AKINDO Privacy Buildathon with 10 waves of 14 day cycles.
## Wave 1 scope discipline
Wave 1 shipped one private flow only: shielded transfer plus payer and merchant receipts, working frontend, wallet integration, live link, demo video. Invoices, donations, stablecoin, oracle, SDK, and mobile each arrived as one new layer per later wave. Do the same: vault plus claim plus threshold proof, nothing more.
## Submission package per wave
Deployed program address plus transaction hashes in README and submission. Live clickable link. Short demo video of the real product. Docs and vision early, SDKs only after core is proven. Judges check the explorer, not the pitch.
## Aleo to Midnight mapping
Private Invoice and Receipt records map to private witnesses plus ClaimAmount. Public invoices mapping plus finalize checks map to public ledger plus circuit asserts. Hash commitments map to nullifier derivation plus payroll root. Expiry and status machine maps to round finalize plus nextRound. transfer_private maps to shielded claim flow. Lace wallet replaces Shield wallet.
## Application order for QuietPay
Wave 1 now: fund, postRoot, claim, proveIncomeAbove on preprod with contract address and three transaction hashes in the AKINDO submission plus 2 minute real UI video. Wave 2 next: invoice create, pay, and settle equivalents plus on-chain attestation verify. Wave 3 later: oracle conversion pattern plus SDK surface. Mobile, card, chat integrations stay out until core wins twice.
