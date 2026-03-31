---
sidebar_position: 3
title: Inbound SMTP (Haraka)
---

# Inbound SMTP

![Inbound SMTP](/img/sprites/retrieving_mail.png)


WildDuck uses [Haraka](http://haraka.github.io/) with the [haraka-plugin-wildduck](https://github.com/nodemailer/haraka-plugin-wildduck) plugin as its inbound SMTP server. Haraka receives email from the internet on port 25 and delivers it into the WildDuck mail store.

## Role in the Mail Suite

Haraka is the MX (Mail Exchanger) for your domains. When external mail servers send email to your users, they connect to Haraka via SMTP. The haraka-plugin-wildduck plugin handles the integration with WildDuck's database.

The plugin must be the **only delivery plugin** enabled in Haraka — it replaces Haraka's default queue/delivery mechanism with direct MongoDB storage.

## Message Processing Pipeline

When a message arrives, haraka-plugin-wildduck performs the following steps:

1. **Recipient validation** — Checks that the recipient address exists in the WildDuck users database. Invalid addresses are rejected at the SMTP level.
2. **Quota checking** — Verifies the recipient has sufficient storage quota before accepting the message. Over-quota recipients are rejected.
3. **Spam filtering** — If Rspamd is configured, the message is scanned for spam (see [Spam Filtering](/docs/architecture/spam-filtering)).
4. **Email authentication** — SPF, DKIM, DMARC, and ARC verification results are evaluated (via the [mailauth](https://github.com/postalsys/mailauth) library).
5. **Filter processing** — User-defined filters are applied (forwarding, folder routing, discarding, etc.).
6. **Autoreply** — If the recipient has an active autoreply/vacation message, a reply is queued.
7. **Message storage** — The message is parsed, attachments are deduplicated, and everything is stored directly in MongoDB.
8. **IMAP notification** — A notification is published via Redis pub/sub so connected IMAP clients are immediately alerted about the new message.

## Spam Routing

When Rspamd is enabled, the plugin reads Rspamd headers from the scanned message:

- Messages above the spam threshold are delivered to the **Junk** folder
- Messages below the threshold are delivered to **INBOX** (or the folder specified by filters)

## Configuration

The plugin is configured via Haraka's plugin configuration system. Key settings include:

- MongoDB and Redis connection strings (should match WildDuck's configuration)
- Rspamd integration settings
- Rate limiting for inbound recipients
- Maximum message size

## Related Links

- [Haraka SMTP Server](https://github.com/haraka/Haraka)
- [haraka-plugin-wildduck](https://github.com/nodemailer/haraka-plugin-wildduck)
- [haraka-plugin-rspamd](https://github.com/haraka/haraka-plugin-rspamd) — for spam filtering integration
