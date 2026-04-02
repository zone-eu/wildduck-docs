---
sidebar_position: 5
title: Storage & Health
---

# Storage API

![Storage API](/img/sprites/storing_mail.png)


WildDuck provides a per-user file storage API for managing draft attachments. Files uploaded through this API can be referenced when composing messages via the [Message Submission](/docs/api/message-submission) endpoint.

## Endpoints

### List Files

```
GET /users/:user/storage
```

List stored files for the user. Supports pagination and filename search. Returns file metadata including id, filename, content type, size, and creation date.

### Upload a File

```
POST /users/:user/storage
```

Upload a file to the user's storage. Supports both binary uploads and base64-encoded content. Returns a file ID that can be referenced in message composition.

### Download a File

```
GET /users/:user/storage/:file
```

Download a previously uploaded file. Supports Content-ID for inline image references.

### Delete a File

```
DELETE /users/:user/storage/:file
```

Remove a file from storage.

## Storage Backend

Files are stored in MongoDB GridFS under the `storage` bucket in the GridFS database (configurable via `dbs.gridfs`). Each file is associated with a specific user.

---

# Health Endpoint

WildDuck provides a health check endpoint for monitoring and load balancer integration.

## Endpoint

```
GET /health
```

Checks the health of WildDuck's dependencies and returns the status.

**Checks performed:**
1. MongoDB connectivity (ping)
2. MongoDB writeability (insert/delete test)
3. Redis connectivity (PING)
4. Redis writeability (HSET/HGET/HDEL with timeout)

**Response:**
- `200` with `{ success: true, version: "..." }` — all checks passed
- `500` with `{ success: false, version: "...", message: "..." }` — one or more checks failed

Useful for load balancer health checks (HAProxy, Nginx), container orchestration (Docker, Kubernetes), and monitoring systems.
