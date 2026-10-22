---
sidebar_position: 3
title: Attachment Storage
---

# Attachment Storage

WildDuck stores deduplicated message attachments in GridFS by default. It can also store their payloads in S3 or a compatible object store, while keeping the catalog and reference counts in MongoDB. Draft uploads and audit copies continue to use their own GridFS buckets.

## Configure S3

Add this to your custom WildDuck configuration:

```toml
[attachments]
type = "s3"
bucket = "attachments" # MongoDB catalog/GridFS bucket name
decodeBase64 = true

[attachments.s3]
bucket = "wildduck-attachments" # object storage bucket
prefix = "production"
region = "us-east-1"
# endpoint = "https://s3.example.com"
# forcePathStyle = true
```

When editing `config/attachments.toml` itself, omit the `attachments.` prefix from section names: that file is already included under `[attachments]`.

Credentials come from the AWS SDK default credential provider chain, including environment variables and instance roles. Explicit `accessKeyId`, `secretAccessKey`, and optional `sessionToken` values can also be set under `[attachments.s3]`.

Use a private bucket and a stable prefix unique to this installation. Grant object read, write, and delete access for that prefix. `ListBucket` is needed for migration cleanup and lets AWS return a missing-object response instead of an access-denied response for absent objects. The provider must validate the `x-amz-checksum-sha256` header used on uploads.

Connection, request, stalled-read, and slow-reader timeouts are configurable. See the [attachment configuration](https://github.com/zone-eu/wildduck/blob/master/config/attachments.toml) for the available options and units.

## Mixed storage and rollout

The preferred backend applies to **new attachment hashes**. An existing hash keeps its recorded backend, so switching to S3 neither migrates existing attachments nor uploads a second copy of an existing GridFS attachment. Reads use the backend recorded in each catalog entry.

Before creating any S3-backed records, upgrade every process that reads or writes messages and give it the same S3 settings. This includes WildDuck's API, IMAP, POP3, LMTP, and task processes, plus Haraka and ZoneMTA integrations that embed WildDuck. Their own configuration must include the `attachments` block too.

Keep S3 configuration available on all readers while any S3-backed attachments exist. Switching `type` back to `gridstore` changes the preferred destination for new hashes. Existing S3 attachments still require S3 access. A failed S3 upload fails the message operation with a temporary error rather than falling back to GridFS.

## Migrate existing attachments

The migration script operates on the configured GridFS database, which may be separate from the main database. Configure S3 first, then start with a small batch:

```bash
NODE_ENV=production node scripts/migrate-attachments-to-s3.js --dry-run --prefix=00 --limit=100
NODE_ENV=production node scripts/migrate-attachments-to-s3.js --migrate --prefix=00 --limit=100 --concurrency=2 --throttle-ms=50
NODE_ENV=production node scripts/migrate-attachments-to-s3.js --verify-only --prefix=00
```

The `--prefix` option filters attachment hashes. It is separate from the object key prefix in the S3 configuration. Repeat for prefixes `00` through `ff`, or omit it to scan all hashes. Runs can be resumed, and a partially migrated store continues to serve both backends.

Migration verifies the stored bytes, uploads them, and switches the catalog entry to S3 without changing reference counts. GridFS chunks are retained until a separate cleanup pass verifies the copies and the reader grace period has passed:

```bash
NODE_ENV=production node scripts/migrate-attachments-to-s3.js --cleanup-chunks --yes --prefix=00 --grace-hours=24
```

Unreferenced S3 objects can be collected separately:

```bash
NODE_ENV=production node scripts/migrate-attachments-to-s3.js --cleanup-unreferenced-s3 --yes --prefix=00 --grace-hours=24
```

Choose a grace period longer than the longest expected upload or active read, and verify backups before cleanup. Back up the MongoDB catalog and S3 payloads together. Neither is sufficient alone.

See the upstream [S3 storage guide](https://github.com/zone-eu/wildduck/blob/master/docs/in-depth/s3-attachment-storage.md) for migration overrides and verification details.
