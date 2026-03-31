---
sidebar_position: 3
title: Real-time Events (SSE)
---

# Real-time Events

![Real-time Events](/img/sprites/showing_email.png)


WildDuck provides a Server-Sent Events (SSE / EventSource) endpoint for pushing real-time mailbox changes to browser clients. This is the mechanism that enables snappy webmail interfaces without polling.

## Endpoint

```
GET /users/:user/updates
```

This endpoint returns a persistent SSE stream. The client receives events whenever changes occur in the user's mailboxes.

## Event Types

The stream delivers events for:

- **New messages** — when a message is delivered or uploaded
- **Message deletion** — when messages are removed
- **Flag changes** — when message flags are updated (read, flagged, etc.)
- **Mailbox changes** — when mailboxes are created, renamed, or deleted
- **Mailbox counters** — updated message counts and unseen counts

## Usage

### Browser (JavaScript)

```javascript
const eventSource = new EventSource('/users/{userId}/updates?accessToken={token}');

eventSource.onmessage = function(event) {
    const data = JSON.parse(event.data);
    // Handle the update
    console.log('Update:', data);
};
```

### How It Works

1. The client opens an SSE connection to the updates endpoint
2. WildDuck subscribes to Redis pub/sub for the user's events
3. When changes occur (via IMAP, API, or inbound delivery), events are published to Redis
4. The SSE endpoint receives the Redis events and forwards them to the connected client

This is more efficient than polling the API for changes and provides near-instant updates.

## Configuration

EventSource logging can be enabled in the configuration:

```toml
[log]
updateStream = true   # log EventSource lifecycle and events
```
