---
sidebar_position: 4
title: FAQ
---

# FAQ

![Frequently Asked Questions](/img/sprites/thinking.png)


## Does it work?

Yes, it does. You can run the server and get a working IMAP and POP3 server for mail store, an
[HTTP API](/docs/category/http-api) server to manage users and messages, and combine it with [Haraka](/docs/architecture/inbound-smtp) for receiving inbound email and [ZoneMTA](/docs/architecture/outbound-smtp) for sending outbound email. All handled by Node.js, MongoDB and Redis, no additional dependencies needed. Provided
services can be disabled and enabled one by one so, for example you could process just IMAP in one host and the API in another.

## How is security implemented in WildDuck?

Read about the WildDuck security implementation [here](/docs/security/overview).

## Isn't it bad to use a database as a mail store?

Yes, historically it has [been considered a bad practice](http://www.memoryhole.net/~kyle/databaseemail.html) to store emails in a database. And for a good
reason. The data model of relational databases like MySQL does not work well with tree like structures (email mime tree) or large blobs (email source).

Notice the word "relational"? In fact document stores like MongoDB work very well with emails. Document store is great for storing tree-like structures and
attachment payloads can live in either GridFS or [S3-compatible object storage](/docs/operations/attachment-storage). MongoDB keeps the attachment catalog and reference counts for both backends.

Here's a list of alternative email servers that also use a database for storing email messages:

-   [DBMail](http://www.dbmail.org/) (MySQL, IMAP)
-   [Archiveopteryx](http://archiveopteryx.org/) (PostgreSQL, IMAP)
-   [ElasticInbox](http://www.elasticinbox.com/) (Cassandra, POP3)

## How does it work?

Whenever a message is received WildDuck parses it into a tree-like structure based on the MIME tree and stores this tree to MongoDB. Attachments are removed
from the tree and stored separately in GridFS or S3. To retrieve a message, WildDuck loads its tree and attachment payloads and reconstructs the RFC822 bytes. Messages stored since version 1.53.0 use a versioned MIME tree that preserves the original bytes, including multipart epilogues and empty parts. Older trees retain their earlier rendering behavior. No data migration is required. See [Upgrading](/docs/operations/operating-wildduck#upgrading) for rollout order.

WildDuck tries to keep minimal state for sessions (basically just a list of currently known UIDs and latest MODSEQ value) to be able to distribute sessions
between different hosts. Whenever a mailbox is opened the entire message list is loaded as an array of UID values. The first UID in the array element points to
the message nr. 1 in IMAP, second one points to message nr. 2 etc.

Actual update data (information about new and deleted messages, flag updates and such) is stored to a journal log and an update beacon is propagated through
Redis pub/sub whenever something happens. If a session detects that there have been some changes in the current mailbox and it is possible to notify the user
about it (eg. a NOOP call was made), journaled log is loaded from the database and applied to the UID array one action at a time. Once all journaled updates
have applied then the result should match the latest state. If it is not possible to notify the user (eg a FETCH call was made), then journal log is not loaded
and the user continues to see the old state.
