---
sidebar_position: 1
title: Configuration Reference
---

# Configuration

![Configuration](/img/sprites/datacenter_inspection.png)


WildDuck uses [wild-config](https://github.com/zone-eu/wild-config) for TOML-based configuration with merge semantics.

## Configuration Files

The configuration is split across several TOML files in the `config/` directory:

| File | Purpose |
|------|---------|
| `default.toml` | Main configuration, includes references to other files |
| `dbs.toml` | MongoDB and Redis connection settings |
| `imap.toml` | IMAP server settings (port, host, TLS) |
| `pop3.toml` | POP3 server settings |
| `api.toml` | HTTP API server settings |
| `tls.toml` | TLS certificate paths and options |
| `dkim.toml` | DKIM signing settings |
| `acme.toml` | ACME/Let's Encrypt settings |
| `sender.toml` | Outgoing mail (submission) settings |
| `attachments.toml` | Attachment storage settings |
| `plugins.toml` | Plugin system configuration |

The main `default.toml` uses `@include` directives to pull in the other files.

## Custom Configuration

To override default settings, create a custom config file and pass it at startup:

```bash
node server.js --config=/etc/wildduck.toml
```

The custom config is **merged** with the defaults — you only need to specify values you want to change.

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

# Separate database for attachments (recommended for disk separation)
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

### Webhooks (`[webhooks]`)

```toml
[webhooks]
enabled = true   # at least one server must have this enabled
```

### ElasticSearch (`[elasticsearch]`)

```toml
[elasticsearch]
enabled = false
url = "http://127.0.0.1:9200"
user = "elastic"
pass = "supersecret"
index = "wildduck"

[elasticsearch.indexer]
enabled = false   # enable the indexing worker
```

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
retention = 30         # days to keep messages in Trash/Junk before auto-deletion
maxConnections = 15    # max concurrent connections per user
enableCompression = false  # advertise COMPRESS=DEFLATE
useProxy = false       # expect HAProxy PROXY header

[imap.setup]
hostname = "localhost" # public IMAP hostname (for client config)
secure = true
```

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

Send `SIGHUP` to the master process to reload TLS certificates from disk without restarting:

```bash
kill -HUP $(pidof wildduck)
```

This only reloads certain settings (primarily TLS certificates). Other configuration changes require a restart.
