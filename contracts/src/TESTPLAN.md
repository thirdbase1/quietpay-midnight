# QuietPay test plan for judges
- No double claim: second claim with same nullifier must fail.
- Conservation: total claimed never exceeds total funded.
- Nullifier binding: claim nullifier must match employee secret.
- Income proof: below-threshold proof must fail, above must pass.
Run after compact compile with npm test on preprod or local devnet.
