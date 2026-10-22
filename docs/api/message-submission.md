---
sidebar_position: 4
title: Message Submission
---

# Message Submission

![Message Submission](/img/sprites/posting_mail.png)


WildDuck allows sending emails directly through the HTTP API, without requiring an SMTP client. This is particularly useful for webmail interfaces and automated systems.

## Endpoint

```
POST /users/:user/submit
```

This endpoint composes a message and, by default, queues it for delivery through
the configured sender queue. It normally stores a copy in Sent Mail. Set `isDraft`
to store a draft without delivery, or `uploadOnly` to store without queueing.

## Request Format

The request body includes:

- **from** — Optional sender address, resolved against the user's addresses and sender policy
- **to** / **cc** / **bcc** — Recipient addresses
- **subject** — Message subject
- **text** — Plain text body
- **html** — HTML body
- **headers** — Custom headers (optional)
- **attachments** — File attachments (optional)
- **reference** — Reference to previous message for replies/forwards (object with `mailbox`, `id`, and `action` fields where action is `reply`, `replyAll`, or `forward`)
- **isDraft** — If true, saves as draft instead of sending
- **draft** — Object referencing a previous draft to replace after sending (with `mailbox` and `id` fields)

## Attachments

Attachments can be included in the request or referenced by storage file IDs
from the [Storage API](/docs/api/storage-api). HTML data URLs may also be
extracted into attachments before request validation.

## How It Works

1. The API resolves the From address and envelope using the user's account and
   sender policy.
2. The message is composed using Nodemailer.
3. Unless `isDraft` or `uploadOnly` is set, it is submitted to the configured
   maildrop queue for delivery.
4. A copy is stored in Sent Mail, or in Drafts when `isDraft` is set, unless a different `mailbox` is specified or the account is over quota.

## Difference from SMTP Submission

| Feature | API Submission | SMTP Submission |
|---------|---------------|-----------------|
| Protocol | HTTP REST | SMTP (port 587) |
| Authentication | API token | SMTP AUTH (password/ASP) |
| Client | Any HTTP client | Email client / SMTP library |
| Best for | Webmail, integrations | Desktop/mobile email clients |

Both paths ultimately queue through ZoneMTA for delivery.
