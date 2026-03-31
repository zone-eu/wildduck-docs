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

This endpoint composes and queues a message for delivery through ZoneMTA.

## Request Format

The request body includes:

- **from** — Sender address (must match one of the user's registered addresses)
- **to** / **cc** / **bcc** — Recipient addresses
- **subject** — Message subject
- **text** — Plain text body
- **html** — HTML body
- **headers** — Custom headers (optional)
- **attachments** — File attachments (optional)
- **reference** — Reference to previous messages (for replies/forwards)
- **draft** — If true, saves as draft instead of sending

## Attachments

Attachments can be included inline in the request or referenced from the [Storage API](/docs/api/storage-api) (for draft attachments that were uploaded separately).

## How It Works

1. The API validates the sender address against the user's registered addresses
2. The message is composed using Nodemailer
3. The composed message is submitted to ZoneMTA's maildrop queue
4. ZoneMTA handles DKIM signing and delivery
5. A copy is saved to the user's Sent Mail folder

## Difference from SMTP Submission

| Feature | API Submission | SMTP Submission |
|---------|---------------|-----------------|
| Protocol | HTTP REST | SMTP (port 587) |
| Authentication | API token | SMTP AUTH (password/ASP) |
| Client | Any HTTP client | Email client / SMTP library |
| Best for | Webmail, integrations | Desktop/mobile email clients |

Both paths ultimately queue through ZoneMTA for delivery.
