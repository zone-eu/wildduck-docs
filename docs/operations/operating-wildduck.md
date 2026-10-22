---
sidebar_position: 1
title: Operating WildDuck
---

# Operating WildDuck

![Operating WildDuck](/img/sprites/server_ok.png)

## Upgrading

Since version 1.53.0, newly stored messages use a versioned MIME tree that preserves the original RFC822 bytes, including multipart epilogues and parts without a body. Existing messages keep their original tree format and require no migration.

Upgrade the processes that serve messages before processes that write the new format:

1. Upgrade WildDuck's IMAP, POP3, API, worker, and task processes.
2. Upgrade `haraka-plugin-wildduck`, `zonemta-wildduck`, and other services that embed WildDuck handlers.

An older reader cannot correctly reconstruct every message written with the new format. Avoid mixing older readers with upgraded writers. Before enabling S3 attachment storage, also complete the [attachment backend rollout](/docs/operations/attachment-storage#mixed-storage-and-rollout) across all readers and writers.

## Logging

WildDuck sends gelf-formatted log messages to a Graylog server. Set `log.gelf.enabled=true` in [config](https://github.com/zone-eu/wildduck/blob/master/config/default.toml) to use it. Also make sure that the same Gelf settings are set for _zonemta-wildduck_ and _haraka-plugin-wildduck_ in order to get consistent logs about messages throughout the system.

> Graylog logging replaces previously used 'messagelog' database collection

## Processes and services

`processes` in `config/default.toml` controls the number of server worker processes. It can be a number or `"cpus"`. The main process starts enabled services from the service configuration. For the service list and bind addresses, see [Configuration](/docs/operations/configuration).

## Sharding

WildDuck supports MongoDB sharding. Consider using sharding only if you know that your data storage is large enough to outgrow single replica. Some actions
require scattered queries to be made that might be a hit on performance on a large cluster but most queries include the shard key by default.

Shard the following collections by these keys (assuming you keep attachments in a separate database):

```javascript
sh.enableSharding('wildduck');
// consider using mailbox:hashed for messages only with large shard chunk size
sh.shardCollection('wildduck.messages', { mailbox: 1, uid: 1 });
sh.shardCollection('wildduck.archived', { user: 1, _id: 1 });
sh.shardCollection('wildduck.threads', { user: 'hashed' });
sh.shardCollection('wildduck.authlog', { user: 'hashed' });

sh.enableSharding('attachments');
// attachment _id is a sha256 hash of attachment contents
sh.shardCollection('attachments.attachments.files', { _id: 'hashed' });
sh.shardCollection('attachments.attachments.chunks', { files_id: 'hashed' });

// storage _id is an ObjectId
sh.shardCollection('attachments.storage.files', { _id: 'hashed' });
sh.shardCollection('attachments.storage.chunks', { files_id: 'hashed' });
```

If using [auditing](/docs/ecosystem/auditing) then shard audit collections as well

```
sh.shardCollection('attachments.audit.files', { _id: 'hashed' });
sh.shardCollection('attachments.audit.chunks', { files_id: 'hashed' });
```

## Disk usage

When using GridFS, you can split your database between multiple disks by using
a smaller SSD (eg. 150GB) for message data and indexes and a larger and cheaper SATA (eg. 1TB) for attachment contents. This assumes that you use WiredTiger with
`storage.directoryPerDB:true` and `storage.wiredTiger.engineConfig.directoryForIndexes:true`

Assuming that you use a database named `attachments` for attachment contents:

    SSD mount : /var/lib/mongodb
    SATA mount: /var/lib/mongodb/attachments/collection

MongoDB does not complain about existing folders so you can prepare the mount before even installing MongoDB.

## Redis Sentinel

WildDuck is able to use Redis Sentinel instead of single Redis master for automatic failover. When using Sentinel and the Redis master fails then it might take
a moment until new master is elected. Pending requests are cached during that window, so most operations should succeed eventually. You might want to test
failover under load though, to see how it behaves.

Redis Sentinel failover does not guarantee consistency. Redis holds sessions and queued jobs, so data loss can affect those.

## HAProxy

When using HAProxy you can enable PROXY protocol to get correct remote addresses in server logs. You can use the most basic round-robin based balancing as no
persistent sessions against specific hosts are needed. Use TCP load balancing with no extra settings both for plaintext and TLS connections.

Enable `imap.useProxy` only when the listener receives connections from trusted proxies, and configure the corresponding HAProxy backend to send the PROXY header.

If TLS is handled by HAProxy then use the following server config to indicate that WildDuck assumes to be a TLS server but TLS is handled upstream

```toml
[imap]
secure=true # this is a TLS server
secured=true # TLS is handled upstream

[pop3]
secure=true # this is a TLS server
secured=true # TLS is handled upstream
```

## Retention and storage

Message retention is configured per mailbox and is processed by background tasks. See [Retention Policies](/docs/operations/retention-policies). Attachments can use GridFS or S3. See [Attachment Storage](/docs/operations/attachment-storage) before changing storage backends.

## Certificates

TLS certificates managed via the API or ACME are reloaded automatically without restarting. Certificates loaded from config files on disk require a process restart. See [Certificates](/docs/operations/certificates).

:::caution
Sending `SIGHUP` to a WildDuck process generates a heap snapshot for debugging — it does **not** reload configuration or certificates.
:::

## Monitoring

The Prometheus endpoint is a separate service configured under top-level `[metrics]` in `config/metrics.toml`. It is disabled by default and binds to localhost by default. See [Monitoring](/docs/operations/monitoring) before exposing it.

## fail2ban setup

NB: setup tested on Ubuntu 20.04 LTS using the scripted install. Should not be too different for those using the docker install.

Create a /etc/fail2ban/jail.d/custom.conf
In the default section, add the IPs that should never be blocked then your standard settings for findtime, bantime & maxretry.
For example:

```toml
[DEFAULT]
ignoreip = 127.0.0.0/8 <your public IP> <any IP you need here>
findtime = 1h
bantime = 7d
maxretry = 3
```

Then add this section for wildduck

```toml
[wildduck]
enabled  = true
port     = 993,995
filter   = wildduck
logpath  = /var/log/wildduck-server/wildduck-server.log
```

Then create /etc/fail2ban/filter.d/wildduck.conf

```toml
[INCLUDES]
before = common.conf

[Definition]
failregex = \[AUTHFAIL\] .*"_ip":"<HOST>"
ignoreregex =
```

And restart fail2ban.

Test this by failing the connection a number of times equal to 'maxretry'. You can use an online connection test tool.

Run 'fail2ban-client status wildduck' : in the output, you should see your attempts with the IP being banned.

Run 'fail2ban-client set wildduck unbanip a.b.c.d' to unban the IP used by the tool you made the test with.

Verify the filter against your deployment's actual logs. With GELF disabled, IMAP authentication records are logged as single-line JSON. With GELF enabled, the records are sent to Graylog. Behind a proxy, verify that `_ip` contains the client address.
