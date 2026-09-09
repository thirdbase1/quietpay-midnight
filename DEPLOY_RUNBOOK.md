# QuietPay preprod deploy runbook
Run inside the repo Codespace with Docker available. Local machine stays untouched.
## 1 Provision
- Open the repo in Codespaces and wait for postCreateCommand to finish
- Start the proof server with docker compose from the cli folder
## 2 Build
- Install with legacy peer deps from the repo root
- Compile the contract so managed bindings and zk keys exist
## 3 Fund
- Run the cli preprod launcher and let it create the wallet
- Fund test NIGHT from the preprod faucet and generate test DUST
- First wallet sync can take a while so batch all writes in one session
## 4 Deploy
- Choose deploy in the cli menu and save the contract address
- Fund the vault then post the payroll root from the same session
- Run one claim plus one threshold proof and save both tx hashes
## 5 Record
- Put contract address and all three tx hashes into README and AKINDO
- Verify each hash on the public preprod explorer before submitting
