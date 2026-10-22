---
sidebar_position: 4
title: Monitoring
---

# Monitoring

WildDuck exposes Prometheus metrics on a dedicated listener, independent of the REST API. It is disabled by default.

## Enable metrics

Add this to your custom configuration:

```toml
[metrics]
enabled = true
host = "127.0.0.1"
port = 8081
secure = false
collectCacheTtl = 10000
```

Then scrape the listener:

```bash
curl http://127.0.0.1:8081/metrics
```

The endpoint requires no access token. Restrict access using its bind address, firewall rules, or a reverse proxy. For direct HTTPS, set `secure = true` and configure `key` and `cert` under `[metrics.tls]`.

For containers, bind to `0.0.0.0` inside the container and publish the port on an appropriate host address, for example `127.0.0.1:8081:8081` for a scraper on the Docker host.

## Prometheus configuration

```yaml
scrape_configs:
  - job_name: wildduck
    scrape_interval: 30s
    metrics_path: /metrics
    static_configs:
      - targets: ['127.0.0.1:8081']
```

This target assumes Prometheus runs on the same host. Use the address reachable from your scraper in other deployments.

When protocol and API roles run in separate deployments, enable metrics for each and scrape every listener. Protocol counters are held in memory and are not shared through MongoDB or Redis. The metrics service can run with `api.enabled = false`.

## Available data

Metrics include Node.js process statistics, service state, API requests, authentication outcomes, protocol connections and commands, message operations, notification activity, background tasks, webhook queues, search indexing, and MCP requests and tool calls. Labels avoid user IDs, message IDs, email addresses, and IP addresses.

`collectCacheTtl` is in milliseconds. Its default of 10000 caches MongoDB task counts and Redis-backed BullMQ queue counts for ten seconds. `0` queries those backends on every scrape. In cluster mode, one elected worker collects backend counts.

## Upgrading from API metrics

Move settings from the deprecated `[api.metrics]` section to `[metrics]` and update the scrape target to the metrics listener. Legacy enablement and cache TTL are still honored when top-level metrics are not enabled, but legacy settings do not configure the listener's host, port, or TLS.

For dependency readiness checks, use the API's [`GET /health`](/docs/api/storage-api#health-endpoint) endpoint.
