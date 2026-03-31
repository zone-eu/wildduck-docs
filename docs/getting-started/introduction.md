---
sidebar_position: 1
title: Introduction
---
# WildDuck Mail Server

![WildDuck Mail Server](/img/sprites/logo.png)


WildDuck is a scalable no-SPOF IMAP/POP3 mail server. WildDuck uses a distributed database (sharded + replicated MongoDB) as a backend for storing all data,
including emails.

WildDuck is part of the Zone Mail Suite — together with [Haraka](/docs/architecture/inbound-smtp) (inbound SMTP) and [ZoneMTA](/docs/architecture/outbound-smtp) (outbound SMTP), it forms a complete email server solution. See the [Architecture Overview](/docs/architecture/overview) for how the components work together.

WildDuck tries to follow Gmail in product design. If there's a decision to be made then usually the answer is to do whatever Gmail has done.

## Requirements

-   _MongoDB_ to store all data
-   _Redis_ for pubsub, caching, and rate limiting
-   _Node.js_ version 16 or later

**Optional requirements**

-   Redis Sentinel for automatic Redis failover
-   ElasticSearch for full-text search
-   Build tools to install optional dependencies that need compiling

WildDuck can be installed on any Node.js compatible platform.

## No-SPOF architecture

Every component of the WildDuck mail server can be replicated which eliminates potential single point of failures.

![](https://raw.githubusercontent.com/zone-eu/wildduck/master/assets/wd.png)

## Storage

Attachment de-duplication and compression gives up to 56% of storage size reduction.

![](https://raw.githubusercontent.com/zone-eu/wildduck/master/assets/storage.png)

## License

WildDuck Mail Agent is licensed under the [European Union Public License 1.2](https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12) or later.
