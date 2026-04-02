---
sidebar_position: 3
title: Message Filtering
---

# Message Filtering

![Message Filtering](/img/sprites/sorting_mail.png)


WildDuck has a built-in message filtering system. This is conceptually similar to Sieve, but filters are not scripts — they are structured rules managed via the API.

## How Filters Work

When a message is received (via Haraka inbound SMTP), WildDuck evaluates all applicable filters in order. Each filter consists of a **query** (conditions to match) and an **action** (what to do with matching messages).

Filters are evaluated for every incoming message. Multiple filters can match the same message, and their actions are applied in sequence.

## Filter Conditions

Filters can match on message properties:

- **From** — sender email address
- **To** — recipient email address
- **Subject** — message subject line
- **Size** — message size (greater than / less than)
- **List-ID** — mailing list identifier header
- **Text** — full-text content match
- **Has attachment** — whether the message has attachments

Conditions support substring matching and regular expressions.

## Filter Actions

When a filter matches, one or more actions can be taken:

| Action | Description |
|--------|-------------|
| **Move to mailbox** | Deliver to a specific mailbox instead of INBOX |
| **Forward** | Forward the message to another email address or HTTP URL |
| **Mark as seen** | Set the `\Seen` flag on delivery |
| **Flag** | Set the `\Flagged` flag on delivery |
| **Spam** | Route message to Junk Mail folder |
| **Delete** | Do not store the matching message |

### Forwarding

Messages can be forwarded to:
- **Email addresses** — the message is re-sent to the specified address
- **HTTP URLs** — the message is POSTed to a webhook endpoint (useful for integrations)

Forwarding includes loop detection to prevent infinite forwarding chains. Forward rate limits apply (default: 2000 forwards per day per user).

## Managing Filters via API

Filters are managed through the WildDuck HTTP API:

- `GET /users/:user/filters` — List all filters for a user
- `POST /users/:user/filters` — Create a new filter
- `GET /users/:user/filters/:filter` — Get filter details
- `PUT /users/:user/filters/:filter` — Update a filter
- `DELETE /users/:user/filters/:filter` — Delete a filter

## Autoreplies

WildDuck has a dedicated autoreply (vacation message) system:

- `GET /users/:user/autoreply` — Get autoreply status
- `PUT /users/:user/autoreply` — Set autoreply with text/HTML content

Autoreplies support:
- **Date ranges** — start and end dates for the vacation period
- **Custom subjects** — override the default reply subject
- **Text and HTML** — both plain text and HTML body
- **Frequency limiting** — by default, only one autoreply per sender every 4 hours to prevent reply storms
