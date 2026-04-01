---
sidebar_position: 4
title: Outbound SMTP (ZoneMTA)
---

# Outbound SMTP

![Outbound SMTP](/img/sprites/airmail_delivery.png)


WildDuck uses [ZoneMTA](https://github.com/zone-eu/zone-mta) with the [zonemta-wildduck](https://github.com/nodemailer/zonemta-wildduck) plugin as its outbound SMTP server. ZoneMTA handles message submission from users and delivery to external mail servers.

WildDuck also supports LMTP for local test setups, but this is reserved exclusively for local testing. For normal deployments and public-facing message
submission, use SMTP through ZoneMTA.

## Role in the Mail Suite

ZoneMTA serves as both the **MSA** (Mail Submission Agent) and the **MTA** (Mail Transfer Agent):

- **MSA (port 587)**: Accepts messages from authenticated users via SMTP submission
- **MTA**: Queues and delivers messages to external mail servers

The zonemta-wildduck plugin integrates ZoneMTA with WildDuck's user database for authentication and policy enforcement.

## Message Submission Pipeline

When a user sends an email through ZoneMTA:

1. **Authentication** — The user is authenticated against WildDuck's user database (supporting both main passwords and Application-Specific Passwords).
2. **From: address validation** — The plugin checks that the From: header matches one of the user's registered email addresses or aliases. If not, the From: address is rewritten to the user's default address.
3. **Rate limiting** — Outbound recipient limits are enforced (default: 2000 recipients per 24 hours, 400 per message).
4. **DKIM signing** — Messages are signed with the appropriate DKIM key for the sender's domain.
5. **Sent Mail folder** — A copy of the sent message is automatically uploaded to the user's Sent Mail folder in WildDuck.
6. **Queue** — The message enters ZoneMTA's delivery queue (stored in MongoDB GridFS).
7. **Delivery** — ZoneMTA delivers the message to the recipient's mail server, handling retries and bounce processing.

## Local Delivery Bypass

When a message is sent to a recipient on the same WildDuck server, the zonemta-wildduck plugin can bypass external SMTP delivery and deliver directly into WildDuck's database, avoiding unnecessary network round-trips.

## ZoneMTA Features

ZoneMTA provides additional capabilities beyond basic message relay:

- **Sending zones** — Granular routing with virtual zones for different sender categories
- **IP warm-up** — Gradual increase of sending volume for new IP addresses
- **Bounce handling** — Automatic processing of delivery failure notifications
- **Queue management** — Messages are queued in MongoDB GridFS for reliability
- **Prometheus metrics** — Built-in monitoring metrics

## Configuration

The zonemta-wildduck plugin is configured via ZoneMTA's plugin configuration. Key settings include:

- WildDuck API URL and access token
- MongoDB and Redis connection strings
- DKIM settings
- Rate limit thresholds
- Sent Mail folder behavior

## Related Links

- [ZoneMTA](https://github.com/zone-eu/zone-mta) — Outbound SMTP relay
- [zonemta-wildduck](https://github.com/nodemailer/zonemta-wildduck) — ZoneMTA plugin for WildDuck integration
- [WildDuck MTA](https://github.com/nodemailer/wildduck-mta) — Pre-configured ZoneMTA + zonemta-wildduck bundle
