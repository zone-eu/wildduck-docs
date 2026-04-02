---
sidebar_position: 2
title: WildDuck Server
---

# WildDuck Server

![WildDuck Server](/img/sprites/server_maintenance.png)


WildDuck is the core component of the Zone Mail Suite. It provides IMAP and POP3 access to email, a comprehensive HTTP API for management, and handles all email storage in MongoDB.

## Services

WildDuck runs the following services (each can be independently enabled/disabled):

| Service | Default Port | Protocol | Purpose |
|---------|-------------|----------|---------|
| IMAP | 9993 (TLS) | IMAP4rev1 | Email client access |
| POP3 | 9995 (TLS) | POP3 | Email client access |
| HTTP API | 8080 | REST/JSON | Management, webmail backend |

All services support TLS with SNI (Server Name Indication) for hosting multiple domains with different certificates.

## Stateless Design

WildDuck instances are completely stateless — all session state is stored in MongoDB and Redis. This means:

- Multiple WildDuck instances can run simultaneously
- Users can connect to any instance (no sticky sessions needed)
- Instances can be added or removed without disruption
- A TCP load balancer (e.g., HAProxy) distributes connections

Session state is managed as follows:
- When a mailbox is opened, the current UID list is loaded from MongoDB
- Changes (new/deleted messages, flag updates) are tracked in a journal collection
- Redis pub/sub propagates change notifications between instances
- Each instance applies journal entries to keep its view of the mailbox current

## MongoDB Storage Model

WildDuck uses MongoDB as its sole persistent storage backend. Key collections:

### Core Collections
- **users** — User accounts, passwords, quotas, settings
- **addresses** — Email addresses mapped to users (including wildcards)
- **mailboxes** — Mailbox hierarchy per user (up to 1500 mailboxes, 128 levels deep)
- **messages** — Message metadata, parsed MIME tree, headers, flags
- **threads** — Message threading information
- **journal** — Write-ahead log for IMAP state changes

### Security Collections
- **authlog** — Authentication attempt log (TTL-indexed, 30 days)
- **asps** — Application-specific passwords
- **audits** — Audit records

### System Collections
- **settings** — System-wide configuration values
- **tasks** — Background task queue
- **dkim** — DKIM signing keys
- **certs** — TLS certificates
- **webhooks** — Webhook subscriptions
- **domainaliases** — Domain alias mappings
- **domainaccess** — Domain allowlists/blocklists

### Attachment Storage (separate database)
- **attachments.files / attachments.chunks** — Deduplicated message attachments (GridFS)
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

## Key Limits

| Limit | Default Value |
|-------|--------------|
| Max message size | 64 MB |
| Max attachment size | 25 MB |
| Max mailboxes per user | 1500 |
| Max mailbox nesting depth | 128 levels |
| Default storage quota | 1 GB per user |
| Max recipients per message | 400 |
| Max recipients per day | 2000 |
| Max forwards per day | 2000 |
| Max concurrent IMAP connections | 15 per user |
| IMAP socket timeout | 5 min 37 sec |

These limits are configurable through the configuration files or the Settings API.
