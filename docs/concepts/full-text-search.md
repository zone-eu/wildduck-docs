---
sidebar_position: 5
title: Full-Text Search
---

# Full-Text Search (OpenSearch)

![Full-Text Search](/img/sprites/sorting_mail.png)

:::warning Experimental
This feature is experimental and subject to change. The API, configuration, and behavior may change in future releases without notice.
:::

WildDuck includes experimental OpenSearch indexing for message content. The configuration key remains `[elasticsearch]`, and the implementation uses the OpenSearch client. REST and IMAP message searches currently use MongoDB; the REST OpenSearch query path is not enabled.

## How It Works

- New messages are indexed in real-time via MongoDB change streams (the `indexer.js` worker watches the `journal` collection)
- Historical messages can be bulk-indexed using the `user-indexing` background task
- Live indexing is enabled per user via a Redis set (`feature:indexing`), or globally with `enabledFeatureFlags.indexer`

## Configuration

```toml
[elasticsearch]
enabled = false
url = "http://127.0.0.1:9200"
user = "elastic"
pass = "supersecret"
index = "wildduck"

[elasticsearch.indexer]
enabled = false   # enable the indexing worker
```

Despite the `[elasticsearch]` configuration key name, the underlying client library is `@opensearch-project/opensearch`.

At least one WildDuck instance must have `elasticsearch.indexer.enabled = true` to process the indexing queue.

## Requirements

- An OpenSearch-compatible cluster accessible from WildDuck instances
- The indexing worker enabled on at least one instance
- Users must be added to the `feature:indexing` Redis set for historical indexing; `enabledFeatureFlags.indexer` can enable live indexing globally

Enabling indexing does not switch message searches to OpenSearch.

## Background Tasks

The `user-indexing` task type handles bulk indexing for a user's existing messages. This is useful when enabling search for an existing account that already has stored messages.
