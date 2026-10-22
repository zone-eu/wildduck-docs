---
sidebar_position: 8
title: Retention policies
---

# Retention policies

![Retention Policies](/img/sprites/empty_mailbox.png)


WildDuck applies retention per mailbox. When a mailbox has a retention period, messages are scheduled for deletion after that period from their original add time. The background task performs cleanup, so deletion may happen after the expiry time rather than at the exact millisecond.

The `retention` API property sets a user's default mailbox retention in milliseconds. At user creation, WildDuck applies that value to the standard mailboxes. `\Trash` and `\Junk` receive a 30-day default when no user retention is given, capped at 30 days when a longer value is given. A value of 0 disables the default for other mailboxes. New mailboxes inherit the user's default.

Once retention time is reached, the message is deleted from database and attachment references are decremented.

The 30-day cap applies when the standard Trash and Junk mailboxes are created from the user's default. An explicit mailbox retention update sets that mailbox's policy directly.

For example if you want to have a default retention policy of 90 days, then use `7776000000` as the retention value (90 * 24 * 3600 * 1000). If defined then this value also applies to any new folders the user creates.

```
curl -XPOST "http://localhost:8080/users" -H 'content-type: application/json' -d '{
  "username": "testuser",
  "password": "secretpass",
  "retention": 7776000000
}'
```

You can set or change a mailbox's retention with the [mailbox create and update endpoints](/docs/category/wildduck-api). On update, WildDuck schedules a background task that recalculates expiry for existing messages from their original add time, then applies the new policy to later messages.

### How does it work?

Changing a mailbox policy enqueues a durable `mailbox-retention` task that updates existing messages' retention and expiry fields in batches. A periodic garbage collector separately deletes expired messages through the normal message handler. Task processing requires `[tasks].enabled = true` (enabled in the default configuration), and `imap.disableRetention` must be false for automatic expiry cleanup.

A lot of things happen when a message is deleted:

  * the message entry is removed from the messages collection
  * IMAP clients are notified about the expunged message
  * Quota usage counter is updated in users collection
  * Reference counts for linked attachments are decremented. Attachment payloads with no references are removed later by attachment cleanup.

A separate process then finds all attachments that have zero references and deletes these.
