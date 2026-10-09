# Copy this file to env.sh, edit the values, then load it with: source env.sh
# env.sh is gitignored

# Ports the C++ servers listen on (must match the upstreams in deploy/nginx.conf)
export REST_PORT=8080
export WEBSOCKET_PORT=8081

# Address of the ScyllaDB node. Under Docker Compose, use the service name
# (e.g. scylla-1). Running the backend on the host, use the container's IP
# (see README for how to look it up)
export DATABASE_IP="scylla-1"

# Secret used to sign login tokens. Generate one with: openssl rand -base64 32
export JWT_SECRET="change-me"

# TLS certificate and key for the HTTPS/WSS servers
# For local development, generate them with scripts/gen-certs.sh
export SSL_CERT_PATH="./certs/chat.crt"
export SSL_KEY_PATH="./certs/chat.key"
export SSL_KEY_PASSWORD="" # Passphrase for the key, leave empty if the key has none
