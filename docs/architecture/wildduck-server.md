---
sidebar_position: 2
title: WildDuck Server
---

# WildDuck Server

![WildDuck Server](/img/sprites/server_maintenance.png)


WildDuck is the core component of the Zone Mail Suite. It provides IMAP and POP3 access to email and a comprehensive HTTP API for management. MongoDB stores account and message data. Attachment payloads can use GridFS or S3.

## Services

WildDuck runs the following services (each can be independently enabled/disabled):

| Service | Default Port | Protocol | Purpose |
|---------|-------------|----------|---------|
| IMAP | 9993 (TLS) | IMAP4rev1 | Email client access |
| POP3 | 9995 (TLS) | POP3 | Email client access |
| HTTP API | 8080 | REST/JSON | Management, webmail backend |
| Metrics (disabled by default) | 8081 | Prometheus HTTP | [Monitoring](/docs/operations/monitoring) |
| MCP (disabled by default) | 8082 | Streamable HTTP | [Read-only mail tools](/docs/security/mcp) |

These listeners support TLS. The API, metrics, and MCP listeners bind to loopback by default. An additional LMTP listener is available for local testing. Use Haraka and ZoneMTA for production SMTP traffic.

## Stateless Design

WildDuck instances do not require per-user server affinity. Durable data lives in MongoDB and the attachment backend, while Redis coordinates notifications and temporary state. Each connection keeps its own in-memory view of the selected mailbox. This means:

- Multiple WildDuck instances can run simultaneously
- Users can connect to any instance (no sticky sessions needed)
- New connections can use any instance. Removing an instance disconnects its active TCP sessions
- A TCP load balancer (e.g., HAProxy) distributes connections

Session state is managed as follows:
- When a mailbox is opened, the current UID list is loaded from MongoDB
- Changes (new/deleted messages, flag updates) are tracked in a journal collection
- Redis pub/sub propagates change notifications between instances
- Each instance applies journal entries to keep its view of the mailbox current

## MongoDB Storage Model

MongoDB stores the account and message model, including the catalog for S3 attachments. Key collections:

### Core Collections
- **users** — User accounts, passwords, quotas, settings
- **addresses** — Email addresses mapped to users (including wildcards)
- **mailboxes** — Mailbox hierarchy per user (up to 1500 mailboxes, 128 levels deep)
- **messages** — Message metadata, parsed MIME tree, headers, flags
- **threads** — Message threading information
- **labels** — Persistent label identities and optional metadata
- **journal** — Write-ahead log for IMAP state changes

### Security Collections
- **authlog** — Authentication attempt log (TTL-indexed, 30 days)
- **asps** — Application-specific passwords
- **mcptokens** — Persistent MCP personal token records (secret digests only)
- **audits** — Audit records

### System Collections
- **settings** — System-wide configuration values
- **tasks** — Background task queue
- **dkim** — DKIM signing keys
- **certs** — TLS certificates
- **webhooks** — Webhook subscriptions
- **domainaliases** — Domain alias mappings
- **domainaccess** — Domain allowlists/blocklists

### Attachment Storage (optionally a separate database)
- **attachments.files** — Deduplicated attachment catalog for both GridFS and S3 payloads
- **attachments.chunks** — Payload chunks for GridFS-backed message attachments
- **storage.files / storage.chunks** — Draft file uploads (GridFS)
- **audit.files / audit.chunks** — Audit message copies (GridFS)

## Background Tasks

WildDuck includes a task queue system backed by MongoDB and Redis distributed locking. Task types include:

- **user-delete** — Asynchronous user account deletion with full data cleanup
- **quota** — Quota recalculation
- **acme** / **acme-update** — ACME certificate provisioning and renewal
- **clear-folder** — Bulk folder clearing
- **search-apply** — Apply filters to existing messages
- **user-indexing** — [Full-text search](/docs/concepts/full-text-search) indexing for a user
- **restore** — User data restoration
- **audit** — Audit data management
- **run-migrations** — Database schema migrations
- **mailbox-retention** — Recalculate expiration after a mailbox retention change
- **label-delete** — Remove a label and its message/filter assignments

## Key Limits

| Limit | Default Value |
|-------|--------------|
| Max message size (API limit) | 64 MB |
| Max IMAP APPEND size | 25 MB |
| Max attachment size | 25 MB |
| Max mailboxes per user | 1500 |
| Max mailbox nesting depth | 128 levels |
| Default storage quota | 1 GB per user |
| Max recipients per message | 400 |
| Max recipients per day | 2000 |
| Max forwards per day | 2000 |
| Max concurrent IMAP connections | 15 per user |
| IMAP authenticated inactivity timeout | 30 min 37 sec |
| IMAP pre-authentication timeout | 5 min 37 sec |
| Max labels per user | 5000 |

These defaults come from the [IMAP configuration](https://github.com/zone-eu/wildduck/blob/master/config/imap.toml) and [server constants](https://github.com/zone-eu/wildduck/blob/master/lib/consts.js). Many can be changed through configuration or the Settings API. The available overrides vary by limit.
