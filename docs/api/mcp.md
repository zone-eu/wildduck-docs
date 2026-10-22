---
sidebar_position: 6
title: Read-only MCP Service
---

# Read-only MCP Service

WildDuck provides an optional [Model Context Protocol](https://modelcontextprotocol.io/) service for reading an account's mail from an MCP client. It uses Streamable HTTP and calls the WildDuck REST API with the caller's credential, preserving API validation, permissions, response filtering, and auditing.

## Enable the service

Add this to your custom configuration:

```toml
[mcp]
enabled = true
host = "127.0.0.1"
port = 8082
path = "/mcp"
secure = false
```

The service is disabled by default. The REST API must be reachable: by default MCP follows `[api]` host, port, and TLS settings. Set `mcp.apiUrl` only when it must reach a different private API address. The MCP listener can run with the local API disabled if an API is available elsewhere.

For remote clients, serve MCP over HTTPS, either directly with `[mcp.tls]` or through a TLS reverse proxy. Proxy only the exact `/mcp` path to port 8082. Keep the management API private.

Set `allowedHosts` to the hostnames the listener receives, without ports. Set `allowedOrigins` to the exact browser origins you permit. Command-line clients without an Origin header are accepted. Enable `trustProxy` only behind a trusted proxy that sets `X-Forwarded-For`. The setting assumes one trusted hop. See [the MCP configuration](https://github.com/zone-eu/wildduck/blob/master/config/mcp.toml) for defaults.

## Create a credential

MCP requires a dedicated `wdmcp_` credential bound to one user.

### User-created API keys

Users can create, list, and revoke their own persistent MCP personal tokens through the REST API. Authenticate these requests with the user's API access token. The `user` role grants these operations for the user's own account; an MCP token cannot create more tokens.

| Operation | Endpoint |
|-----------|----------|
| Create a key | `POST /users/:user/mcp-tokens` |
| List key metadata | `GET /users/:user/mcp-tokens` |
| Revoke a key | `DELETE /users/:user/mcp-tokens/:token` |

For example, replace `USER_ID` with the authenticated user's ID:

```bash
curl --fail-with-body -sS -X POST http://127.0.0.1:8080/users/USER_ID/mcp-tokens \
  -H "X-Access-Token: $WILDDUCK_USER_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"description":"Mail assistant"}'
```

`description` is required. The role defaults to `mcp:read`, the only supported access level. An optional `expires` field accepts a future ISO timestamp; otherwise the key does not expire. The response includes the key's record `id` and its `wdmcp_` secret in `token`. Save the secret when creating it: listing returns metadata only. Revocation uses the record ID, not the secret.

### Command-line management

Administrators can also manage personal tokens from the WildDuck checkout:

```bash
node bin/mcp-tokens create alice@example.com --description "Mail assistant"
node bin/mcp-tokens list alice@example.com
node bin/mcp-tokens revoke alice@example.com TOKEN_RECORD_ID
```

The create command displays the secret once. Personal tokens do not expire by default. Use `--expires` with a future ISO timestamp to set a fixed expiration. Revocation takes the record ID from the listing, not the secret.

### Login sessions

Interactive authentication with `scope: "mcp"` returns an expiring MCP session. A fully authenticated master API login session can obtain an independent MCP session through `POST /authenticate/mcp`. Enabled two-factor authentication must be completed first. See [Authentication](/docs/security/authentication) and the [API reference](/docs/category/wildduck-api) for the login flows.

## Connect an MCP client

Configure your MCP client with the service URL and an authorization header:

```text
URL: https://mail.example.com/mcp
Authorization: Bearer wdmcp_...
```

API tokens, root tokens, and application-specific passwords cannot authenticate to the MCP listener. MCP credentials must use the Bearer header. Query parameters and `X-Access-Token` are rejected. Store the secret outside tracked configuration files.

## Available tools

| Tool | Purpose |
|------|---------|
| `get_account` | Account profile, addresses, and quota usage |
| `list_mailboxes` | Mailbox paths, counts, and sizes |
| `list_messages` | Paged summaries for one mailbox |
| `search_messages` | Paged summaries matching typed search filters |
| `get_message` | Envelope, flags, attachment metadata, and a bounded body |
| `get_message_text` | Another window of a message body |

The `mcp:read` role grants access to the token owner's data. Tools do not accept an account selector, mark mail as seen, or change message state. Raw EML, attachment contents, sending, and other write operations are not exposed.

Lists and searches default to 20 results, capped by `maxResults` and the server maximum of 50. Body windows default to at most 50000 characters. Use `get_message_text` when `hasMore` is true. Windows cover the stored body, which may already have been truncated during message ingestion. HTML is sanitized and remote image references are removed. Message text remains untrusted input to the client.

## Token lifecycle and monitoring

Changing a password or authentication version invalidates existing MCP credentials. Disabled, suspended, or expired accounts cannot authenticate, and `disabledScopes` can disable `mcp` for a user. MCP sessions minted from master sessions are independent. Ending the master session does not revoke them.

Authentication events appear in the user's authlog with protocol `MCP`. Token creation and deletion also produce `mcptoken.created` and `mcptoken.deleted` webhook events. [Prometheus metrics](/docs/operations/monitoring) include MCP authentication, requests, and tool calls.

See the upstream [MCP guide](https://github.com/zone-eu/wildduck/blob/master/docs/in-depth/mcp.md) for token lifetimes, limits, and scoped-session revocation.
