#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/.."
if [[ ! -f .env ]] && [[ -f env.example ]]; then
  cp env.example .env
  echo "[dev-flask] Created .env from env.example — add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET."
fi
export PYTHONPATH=.
if [[ -f .venv/bin/activate ]]; then
  # shellcheck source=/dev/null
  source .venv/bin/activate
fi
exec python3 -m backend.app
