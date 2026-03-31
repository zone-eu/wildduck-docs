---
sidebar_position: 2
title: Webmail
---

# WildDuck Webmail

![Webmail](/img/sprites/no_messages.png)


> **Note:** WildDuck Webmail is no longer actively maintained. It serves as a demo and example implementation showing how to build a webmail interface on top of the WildDuck API.

WildDuck Webmail is a Node.js web application that uses the WildDuck HTTP API to manage user settings and preview messages. Unlike traditional webmail that connects via IMAP, WildDuck Webmail reads pre-parsed data directly from the API, resulting in significantly faster page loads.

## Live Demo

There's a live demo at https://webmail.wildduck.email — you can register a free @wildduck.email email address and try it out as a real email account.

**NB!** Sending emails from *wildduck.email* is disabled due to spamming. Messages are accepted for delivery but not sent out.

![](https://cldup.com/TZoTfxPugm.png)

## Source Code

- [wildduck-webmail](https://github.com/nodemailer/wildduck-webmail)

## Building Your Own Webmail

WildDuck's HTTP API is designed to make building webmail interfaces straightforward. Key API features for webmail development:

- **Pre-parsed messages** — No need to parse MIME/RFC822; the API returns structured message data
- **Real-time updates** — [EventSource/SSE](/docs/api/event-source) endpoint pushes mailbox changes to the browser
- **Message submission** — [Send messages via API](/docs/api/message-submission) without an SMTP client
- **Draft storage** — [Upload attachments](/docs/api/storage-api) before composing messages
