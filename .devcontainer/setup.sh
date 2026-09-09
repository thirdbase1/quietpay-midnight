#!/usr/bin/env bash
set -euo pipefail
curl --proto "=https" --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh
export PATH="$HOME/.compact/bin:$PATH"
compact update 0.31.1
npm install -g npm@11
npm install --legacy-peer-deps
echo QuietPay cloud environment ready
