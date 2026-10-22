---
sidebar_position: 1
title: Configuration Reference
---

# Configuration

![Configuration](/img/sprites/datacenter_inspection.png)


WildDuck uses [wild-config](https://github.com/zone-eu/wild-config) for TOML-based configuration with merge semantics.

## Configuration Files

The main configuration is `config/default.toml`. It includes service and feature settings from these files:

| File | Purpose |
|------|---------|
| `default.toml` | Main configuration, includes references to other files |
| `dbs.toml` | MongoDB and Redis connection settings |
| `imap.toml` | IMAP server settings (port, host, TLS) |
| `pop3.toml` | POP3 server settings |
| `lmtp.toml` | LMTP server settings |
| `api.toml` | HTTP API server settings |
| `tls.toml` | TLS certificate paths and options |
| `dkim.toml` | DKIM signing settings |
| `acme.toml` | ACME/Let's Encrypt settings |
| `sender.toml` | Outgoing mail (submission) settings |
| `attachments.toml` | Attachment storage settings |
| `metrics.toml` | Prometheus metrics listener settings |
| `mcp.toml` | Read-only MCP service settings |
| `migrations.toml` | Database and user migration settings |
| `plugins.toml` | Plugin system configuration |

The main `default.toml` uses `@include` directives to pull in the other files. Configuration is loaded through `@zone-eu/wild-config`. Use its documented environment overrides or a deployment-specific config rather than replacing only one included file.

## Custom Configuration

To override default settings, create a custom config file and pass it at startup:

```bash
node server.js --config=/etc/wildduck.toml
```

The custom config is merged with the defaults — you only need to specify values you want to change. The image's entry point explicitly loads `/wildduck/config/default.toml`. Mount a replacement config directory there when running the Docker image.

## Key Configuration Sections

### Process Settings

```toml
ident = "wildduck"   # process title
processes = 1         # number of worker processes ("cpus" for auto)
#user = "wildduck"   # downgrade privileges after start
#group = "wildduck"
```

### Database Settings (`[dbs]`)

```toml
[dbs]
# MongoDB connection URL
mongo = "mongodb://127.0.0.1:27017/wildduck"
# Redis connection URL
redis = "redis://127.0.0.1:6379/3"

# Optional separate MongoDB connection for GridFS storage
#[dbs.gridfs]
#mongo = "mongodb://127.0.0.1:27017/attachments"
```

### TOTP / 2FA (`[totp]`)

```toml
[totp]
# Encrypt TOTP seeds at rest (recommended for production)
#secret = "a secret cat"
```

### WebAuthn (`[webauthn]`)

```toml
[webauthn]
rpId = "example.com"              # your domain
rpName = "WildDuck Email Server"
challengeSize = 64
attestation = "none"
authenticatorUserVerification = "discouraged"
```

### Logging (`[log]`)

```toml
[log]
level = "silly"        # silly, verbose, info, warn, error
skipFetchLog = false   # skip logging individual FETCH responses

[log.gelf]
enabled = false        # enable GELF logging to Graylog
component = "wildduck"
[log.gelf.options]
graylogPort = 12201
graylogHostname = "127.0.0.1"
```

### Attachments (`[attachments]`)

`config/attachments.toml` selects GridFS or S3 for newly stored attachment hashes. Existing attachment records determine where their data is read. See [Attachment Storage](/docs/operations/attachment-storage) before enabling S3.

### Metrics (`[metrics]`)

Prometheus listener settings live in `config/metrics.toml` under top-level `[metrics]`. See [Monitoring](/docs/operations/monitoring).

### Webhooks (`[webhooks]`)

```toml
[webhooks]
enabled = true   # at least one server must have this enabled
```

### MCP (`[mcp]`)

The read-only MCP service is configured separately in `config/mcp.toml` and is disabled by default. See [Read-only MCP Service](/docs/security/mcp) for credentials, deployment, and client access.

### Full-Text Search (`[elasticsearch]`)

See the [Full-Text Search](/docs/concepts/full-text-search) page for configuration details and usage.

### Tasks (`[tasks]`)

```toml
[tasks]
enabled = true   # process background jobs
```

### Pwned Passwords (`[pwned]`)

```toml
[pwned]
enabled = false       # check passwords against HaveIBeenPwned
type = "softfail"     # hardfail, fail, softfail, none
```

### TLS Certificates (`[certs]`)

```toml
[certs]
# Encrypt stored TLS private keys at rest
#secret = "a secret cat"
```

### SMTP Setup (`[smtp.setup]`)

```toml
[smtp.setup]
# Public SMTP settings (used for mobileconfig files)
hostname = "localhost"
secure = false
port = 2587
```

### IMAP Service (`[imap]`)

```toml
[imap]
enabled = true         # enable IMAP service
port = 9993            # IMAP port (use 993 for production)
host = "0.0.0.0"      # bind address
secure = true          # use TLS (true for implicit TLS, false for STARTTLS)
maxMB = 25             # max message size for APPEND (MB)
maxConnections = 15    # max concurrent connections per user
socketTimeout = 1837000    # authenticated inactivity timeout (ms)
preAuthSocketTimeout = 337000 # pre-authentication timeout (ms)
maxLineLength = 16384  # command line bytes, excluding literals
maxLiterals = 1000     # literal segments per command
enableCompression = false  # advertise COMPRESS=DEFLATE
useProxy = false       # expect HAProxy PROXY header

[imap.setup]
hostname = "localhost" # public IMAP hostname (for client config)
secure = true
```

Configure mailbox retention through the user and mailbox APIs. See [Retention Policies](/docs/operations/retention-policies) for units and effects on existing messages.

### POP3 Service (`[pop3]`)

```toml
[pop3]
enabled = true         # enable POP3 service
port = 9995            # POP3 port (use 995 for production)
host = "0.0.0.0"      # bind address
secure = true          # use TLS
maxMessages = 250      # max messages shown in LIST/UIDL

[pop3.setup]
hostname = "localhost" # public POP3 hostname (for client config)
secure = true
```

### HTTP API Service (`[api]`)

```toml
[api]
enabled = true         # enable API service
port = 8080            # API port
host = "127.0.0.1"    # bind address (localhost only by default)
secure = false         # use HTTPS

[api.accessControl]
enabled = false        # require valid access tokens
secret = "a secret cat"  # HMAC secret for token validation
tokenTTL = 1209600    # token TTL in seconds (14 days, extended on use)
```

## Environment Variable Overrides

When running in Docker, configuration values can be overridden using environment variables with the `APPCONF_` prefix. The variable name maps to the config path using underscores as separators:

```bash
APPCONF_dbs_mongo="mongodb://mongo:27017/wildduck"
APPCONF_dbs_redis="redis://redis:6379/3"
APPCONF_imap_setup_hostname="mail.example.com"
```

See the [Docker documentation](/docs/operations/docker) for more details.

## Runtime Configuration

Some settings can be changed at runtime via the Settings API without restarting the server:

- `GET /settings` — list current settings
- `PUT /settings/:key` — update a setting

See [Default Values](/docs/operations/default-values) for the web-based settings interface.

## Reloading Configuration

Most configuration changes require a process restart. TLS certificates managed via the API or ACME are reloaded automatically without restarts.

:::caution
Sending `SIGHUP` to a WildDuck process generates a heap snapshot for debugging — it does **not** reload configuration or certificates.
:::
