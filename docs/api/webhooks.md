---
sidebar_position: 2
title: Webhooks
---

# Webhooks

![Webhooks](/img/sprites/syncing_server.png)


WildDuck includes a webhook system for real-time event notifications. When events occur (new messages, authentication attempts, account changes, etc.), WildDuck sends HTTP POST requests to registered webhook URLs.

## How It Works

The webhook system is built on [BullMQ](https://docs.bullmq.io/) (Redis-based job queue):

1. An event occurs in WildDuck (e.g. a new message arrives)
2. The event is published to the webhook queue in Redis
3. The webhook worker picks up the event and delivers it to all matching webhook subscriptions
4. Failed deliveries are retried with exponential backoff

At least one WildDuck instance must have `webhooks.enabled = true` in its configuration, otherwise events will pile up in the Redis queue.

## Managing Webhooks

Webhooks are managed via the HTTP API:

- `GET /webhooks` - List all webhook subscriptions
- `POST /webhooks` - Register a new webhook
- `DELETE /webhooks/:webhook` - Delete a webhook

### Creating a Webhook

When creating a webhook, specify:

- **url** - The endpoint URL (supports `http://`, `https://`, `smtp://`, and `smtps://` schemes)
- **type** - Array of event type filters
- **user** (optional) - Limit the webhook to events for a specific user

Webhook subscriptions can match:

- Exact event names like `user.created`
- `*` to match all events
- Namespace wildcards like `user.*` and `user.delete.*`

## Global vs User Webhooks

- **Global webhooks** - Receive events for all users (created without a `user` parameter)
- **User-specific webhooks** - Only receive events for a specific user

## Delivery Format

Every delivered webhook payload includes these top-level fields:

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | Webhook delivery id, generated at delivery time. Format is `<objectId>:<n>`. |
| `ev` | string | Event name. |
| `time` | number | Unix timestamp in milliseconds, added when the event is published. |

Notes:

- Top-level MongoDB `ObjectId` values are serialized to 24-char hex strings before queueing.
- Webhook subscriptions can match exact event names, `*`, or namespace wildcards like `user.*` and `user.delete.*`.
- The payload reference below reflects the webhook payloads emitted by this checkout of WildDuck.
- `mfa.webauthn.removed` is intended to exist, but in this checkout it is broken by a constant name typo in `lib/events.js` and does not currently deliver.

## Event Payload Reference

### `address.user.created`

Returned data:

| Field | Type |
| --- | --- |
| `user` | string |
| `address` | string |
| `value` | string |

### `address.user.deleted`

Returned data:

| Field | Type |
| --- | --- |
| `user` | string |
| `address` | string |
| `value` | string |

### `address.forwarded.created`

Returned data:

| Field | Type |
| --- | --- |
| `address` | string |
| `value` | string |

### `address.forwarded.deleted`

Returned data:

| Field | Type |
| --- | --- |
| `address` | string |
| `value` | string |

### `address.domain.renamed`

Returned data:

| Field | Type |
| --- | --- |
| `previous` | string |
| `current` | string |

### `asp.created`

Returned data:

| Field | Type |
| --- | --- |
| `user` | string |
| `asp` | string |
| `description` | string |

### `asp.deleted`

Returned data:

| Field | Type |
| --- | --- |
| `user` | string |
| `asp` | string |
| `description` | string |

### `autoreply.user.enabled`

Returned data:

| Field | Type |
| --- | --- |
| `user` | string |

### `autoreply.user.disabled`

Returned data:

| Field | Type |
| --- | --- |
| `user` | string |

### `cert.created`

Returned data:

| Field | Type |
| --- | --- |
| `cert` | string |
| `servername` | string |
| `fingerprint` | string |

### `cert.updated`

Returned data:

| Field | Type |
| --- | --- |
| `cert` | string |
| `servername` | string |
| `fingerprint` | string |

### `cert.deleted`

Returned data:

| Field | Type |
| --- | --- |
| `cert` | string |
| `servername` | string |
| `fingerprint` | string |

### `dkim.created`

Returned data:

| Field | Type |
| --- | --- |
| `dkim` | string |
| `domain` | string |
| `selector` | string |
| `fingerprint` | string |

### `dkim.updated`

Returned data:

| Field | Type |
| --- | --- |
| `dkim` | string |
| `domain` | string |
| `selector` | string |
| `fingerprint` | string |

### `dkim.deleted`

Returned data:

| Field | Type |
| --- | --- |
| `dkim` | string |
| `domain` | string |
| `selector` | string |
| `fingerprint` | string |

### `domainalias.created`

Returned data:

| Field | Type |
| --- | --- |
| `domainalias` | string |
| `alias` | string |
| `domain` | string |

### `domainalias.deleted`

Returned data:

| Field | Type |
| --- | --- |
| `domainalias` | string |
| `alias` | string |
| `domain` | string |

### `filter.created`

Returned data:

| Field | Type |
| --- | --- |
| `user` | string |
| `filter` | string |

### `filter.deleted`

Returned data:

| Field | Type |
| --- | --- |
| `user` | string |
| `filter` | string |

### `forward.added`

Returned data:

| Field | Type | Notes |
| --- | --- | --- |
| `user` | string | Present for user-level and filter-level forwards. |
| `type` | string | `user` or `filter`. |
| `target` | string | Forward target value. |
| `filter` | string | Present only when `type` is `filter`. |

When `type` is `filter`, `filter` is the filter id as a string.

### `mailbox.created`

Returned data:

| Field | Type |
| --- | --- |
| `user` | string |
| `mailbox` | string |
| `path` | string |

### `mailbox.renamed`

Returned data:

| Field | Type |
| --- | --- |
| `user` | string |
| `mailbox` | string |
| `previous` | string |
| `current` | string |

### `mailbox.deleted`

Returned data:

| Field | Type |
| --- | --- |
| `user` | string |
| `mailbox` | string |
| `path` | string |

### `marked.spam`

Returned data:

| Field | Type | Notes |
| --- | --- | --- |
| `user` | string | User id. |
| `mailbox` | string | Mailbox id. |
| `message` | number | Message UID in the mailbox, not the MongoDB message id. |
| `from` | object | Present when parsed from the message. Usually `{ name, address }`. |
| `to` | array | Optional decoded recipient list. |
| `cc` | array | Optional decoded recipient list. |
| `bcc` | array | Optional decoded recipient list. |
| `messageId` | string | Original `Message-ID` header value. |
| `subject` | string | Message subject. |
| `date` | string | ISO timestamp from internal message date. |
| `verificationResults` | object | Optional authentication verification details. |
| `bimi` | object | Optional BIMI details when available. |

`from` fields:

| Field | Type |
| --- | --- |
| `name` | string |
| `address` | string |

`to`, `cc`, and `bcc` array item fields:

| Field | Type |
| --- | --- |
| `name` | string |
| `address` | string |

`verificationResults` fields:

| Field | Type |
| --- | --- |
| `tls` | object or boolean |
| `spf` | string or boolean |
| `dkim` | string or boolean |
| `dmarc` | object |

`verificationResults.tls` fields when present as an object:

| Field | Type |
| --- | --- |
| `name` | string |
| `version` | string |

`verificationResults.dmarc` fields:

| Field | Type |
| --- | --- |
| `domain` | string or boolean |
| `policy` | string |

`bimi` fields when present:

| Field | Type |
| --- | --- |
| `certified` | boolean |
| `url` | string |
| `image` | string |
| `type` | string |

### `marked.ham`

Returned data:

Payload is the same as `marked.spam`.

### `mfa.totp.enabled`

Returned data:

| Field | Type |
| --- | --- |
| `user` | string |

### `mfa.totp.disabled`

Returned data:

| Field | Type |
| --- | --- |
| `user` | string |

### `mfa.custom.enabled`

Returned data:

| Field | Type |
| --- | --- |
| `user` | string |

### `mfa.custom.disabled`

Returned data:

| Field | Type |
| --- | --- |
| `user` | string |

### `mfa.webauthn.registered`

Returned data:

| Field | Type |
| --- | --- |
| `user` | string |
| `credential` | object |

`credential` fields:

| Field | Type |
| --- | --- |
| `id` | string |
| `rawId` | string |
| `description` | string |
| `authenticatorAttachment` | string |

### `mfa.disabled`

Returned data:

| Field | Type |
| --- | --- |
| `user` | string |

### `user.created`

Returned data:

| Field | Type |
| --- | --- |
| `user` | string |
| `username` | string |
| `name` | string |
| `address` | string |

### `user.password.changed`

Returned data:

| Field | Type |
| --- | --- |
| `user` | string |

### `user.delete.started`

Returned data:

| Field | Type | Notes |
| --- | --- | --- |
| `user` | string | |
| `result` | object | Delete scheduling result. |

`result` fields:

| Field | Type |
| --- | --- |
| `user` | string |
| `addresses` | object |
| `deleteAfter` | string |
| `task` | string |

`result.addresses` fields:

| Field | Type |
| --- | --- |
| `deleted` | number |

### `user.delete.completed`

Returned data:

| Field | Type | Notes |
| --- | --- | --- |
| `user` | string | |
| `result` | object | Final deletion summary. |

`result` fields are built step-by-step during task execution and can include:

| Field | Type |
| --- | --- |
| `user` | string |
| `mailboxes` | object |
| `filters` | object |
| `autoreplies` | object |
| `addressregister` | object |
| `messages` | object |
| `task` | string |

These nested objects typically contain counters like `deleted`, and on partial failures may include `error`.

`result.mailboxes` fields:

| Field | Type |
| --- | --- |
| `deleted` | number |
| `error` | string |

`result.filters` fields:

| Field | Type |
| --- | --- |
| `deleted` | number |
| `error` | string |

`result.autoreplies` fields:

| Field | Type |
| --- | --- |
| `deleted` | number |
| `error` | string |

`result.addressregister` fields:

| Field | Type |
| --- | --- |
| `deleted` | number |
| `error` | string |

`result.messages` fields:

| Field | Type |
| --- | --- |
| `deleted` | number |
| `error` | string |

### `user.delete.cancelled`

Returned data:

| Field | Type | Notes |
| --- | --- | --- |
| `user` | string | |
| `result` | object | Restore summary. |

`result` fields can include:

| Field | Type |
| --- | --- |
| `user` | string |
| `username` | string |
| `storageUsed` | number |
| `tags` | array |
| `deleted` | string |
| `addresses` | object |

`addresses` may include:

| Field | Type |
| --- | --- |
| `recovered` | number |
| `main` | string |

## Delivery and Retry

Webhook deliveries use HTTP POST. If the endpoint returns a non-2xx status code or the request times out, the delivery is retried with exponential backoff.
