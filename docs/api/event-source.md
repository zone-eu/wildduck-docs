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

## Event Format

Journal updates are sent as SSE `data` fields containing JSON. WildDuck does not
set an SSE `event` name for ordinary updates, so clients receive them through
`onmessage`. The JSON `command` field identifies the update, with fields such
as `mailbox`, `uid`, `flags`, and counters depending on the command. Journal
entry IDs are sent in the SSE `id` field and can be resumed with
`Last-Event-ID`. The stream also sends occasional comment lines to keep idle
connections alive. A replay failure may be sent as a named `error` event.

Updates cover message changes, mailbox changes, and mailbox or label counters.
The payload is a filtered journal entry, not a separate event envelope.

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
