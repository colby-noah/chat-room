#!/usr/bin/env bash
# Generates a self-signed certificate for local development
set -euo pipefail
mkdir -p certs
openssl req -x509 -newkey rsa:2048 -nodes -days 365 \
    -keyout certs/chat.key -out certs/chat.crt \
    -subj "/CN=localhost" \
    -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
echo "Wrote certs/chat.crt and certs/chat.key"
