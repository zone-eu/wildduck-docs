---
sidebar_position: 2
title: Webhooks
---

# Webhooks

![Webhooks](/img/sprites/syncing_server.png)


WildDuck includes a webhook system for real-time event notifications. When events occur (new messages, authentication attempts, account changes, etc.), WildDuck sends HTTP POST requests to registered webhook URLs.

## How It Works

The webhook system is built on [BullMQ](https://docs.bullmq.io/) (Redis-based job queue):

1. An event occurs in WildDuck (e.g., a new message arrives)
2. The event is published to the webhook queue in Redis
3. The webhook worker picks up the event and delivers it to all matching webhook subscriptions
4. Failed deliveries are retried with exponential backoff

At least one WildDuck instance must have `webhooks.enabled = true` in its configuration, otherwise events will pile up in the Redis queue.

## Webhook Events

Events use a hierarchical naming system. You can subscribe to specific events or use wildcards to match event categories.

Common event types include user-related events, message events, mailbox events, authentication events, and more. Events are prefixed by their category (e.g., events related to a specific resource type).

## Managing Webhooks

Webhooks are managed via the HTTP API:

- `GET /webhooks` — List all webhook subscriptions
- `POST /webhooks` — Register a new webhook
- `GET /webhooks/:webhook` — Get webhook details
- `PUT /webhooks/:webhook` — Update a webhook
- `DELETE /webhooks/:webhook` — Delete a webhook

### Creating a Webhook

When creating a webhook, specify:

- **url** — The HTTP endpoint that will receive POST requests
- **type** — Event type filter (supports prefix matching with wildcards)
- **user** (optional) — Limit the webhook to events for a specific user

### Webhook Payload

Events are delivered as JSON POST requests. The payload includes:

- Event type identifier
- Timestamp
- Related resource IDs (user, mailbox, message, etc.)
- Event-specific data

## Global vs User Webhooks

- **Global webhooks** — Receive events for all users (created without a `user` parameter)
- **User-specific webhooks** — Only receive events for a specific user

## Delivery and Retry

Webhook deliveries use HTTP POST. If the endpoint returns a non-2xx status code or the request times out, the delivery is retried with exponential backoff.
