---
sidebar_position: 1
title: Architecture Overview
---

# Zone Mail Suite Architecture

![Zone Mail Suite Architecture](/img/sprites/presenting_server.png)


WildDuck is part of the Zone Mail Suite — a collection of components that together form a complete, scalable email server. Each component handles a specific role and can be independently scaled.

## Components

| Component | Role | Default Port |
|-----------|------|-------------|
| **WildDuck** | IMAP/POP3 server + HTTP API | IMAP: 993, POP3: 995, API: 8080 |
| **Haraka** + haraka-plugin-wildduck | Inbound SMTP (receiving mail) | 25 |
| **ZoneMTA** + zonemta-wildduck | Outbound SMTP (sending mail) | 587 |
| **Rspamd** | Spam filtering | 11333 |
| **MongoDB** | Persistent storage | 27017 |
| **Redis** | Pub/sub, caching, rate limiting | 6379 |

## Inbound Mail Flow

When an email arrives from the internet:

```
Internet
  ↓
MX record → Haraka (port 25)
  ↓
Rspamd spam check
  ↓
haraka-plugin-wildduck
  ├── Validates recipient exists
  ├── Checks user quota
  ├── Applies SPF/DKIM/DMARC/ARC verification
  ├── Applies message filters (forward, autoreply, etc.)
  └── Stores message in MongoDB
  ↓
Redis pub/sub notification
  ↓
Connected IMAP clients receive update
```

## Outbound Mail Flow

When a user sends an email:

```
Email client (SMTP submission)
  ↓
ZoneMTA (port 587)
  ↓
zonemta-wildduck plugin
  ├── Authenticates user against WildDuck
  ├── Validates From: address matches user
  ├── Applies rate limits
  ├── Signs with DKIM
  └── Copies to Sent Mail folder
  ↓
ZoneMTA queue → Internet
```

Messages can also be submitted via the WildDuck HTTP API (`POST /users/:user/submit`), which queues them through ZoneMTA.

## No Single Point of Failure

Every component in the Zone Mail Suite is stateless and horizontally scalable:

- **WildDuck**: Run multiple instances behind a TCP load balancer (e.g., HAProxy). Users can connect to any instance.
- **Haraka**: Run multiple MX servers. DNS MX records handle distribution.
- **ZoneMTA**: Run multiple submission servers behind a load balancer.
- **MongoDB**: Use replica sets for high availability, sharding for horizontal scaling.
- **Redis**: Use Redis Sentinel for automatic failover.

## Storage Architecture

All data is stored in MongoDB:

- **Messages**: Parsed into MIME tree structure, stored in the `messages` collection
- **Attachments**: Deduplicated by content hash, stored in GridFS (`attachments` database)
- **User data**: Accounts, addresses, mailboxes, filters, settings in the main `wildduck` database

For performance tuning, WildDuck uses a separate database for attachments. This allows mounting a larger, cheaper disk (SATA) for attachment storage while keeping message metadata and indexes on faster storage (SSD).

**Optional: ElasticSearch** can be enabled as a full-text search backend for message content, providing faster search than MongoDB's built-in text indexes.

## Redis Usage

Redis serves several purposes in the mail suite:

- **Pub/sub**: Propagates mailbox change notifications to connected IMAP clients
- **Caching**: User profile cache, mailbox counters
- **Rate limiting**: Authentication attempts, outbound recipient limits, forwarding limits
- **2FA**: Stores temporary WebAuthn challenges and used TOTP tokens
- **Job queues**: BullMQ-based queues for webhook delivery and ElasticSearch indexing
- **Distributed locks**: Coordinates ACME certificate operations across instances

## Related Repositories

- [WildDuck](https://github.com/zone-eu/wildduck) — Core IMAP/POP3/API server
- [Haraka](https://github.com/haraka/Haraka) — SMTP server framework
- [haraka-plugin-wildduck](https://github.com/nodemailer/haraka-plugin-wildduck) — Haraka plugin for WildDuck integration
- [ZoneMTA](https://github.com/zone-eu/zone-mta) — Outbound SMTP relay
- [zonemta-wildduck](https://github.com/nodemailer/zonemta-wildduck) — ZoneMTA plugin for WildDuck integration
- [wildduck-dockerized](https://github.com/nodemailer/wildduck-dockerized) — Docker Compose setup for the full suite
