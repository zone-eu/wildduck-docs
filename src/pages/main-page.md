---
title: Markdown page example
---

# Wildduck Mail Server

WildDuck is a modern mail server software for IMAP and POP3. Modern being scalable, Unicode-first, and API-controlled. To create a complete mail server, you can bundle WildDuck with Haraka and ZoneMTA.

> You should consider using WildDuck when you have a large number of email accounts (1000+) with large quotas as WildDuck is designed to scale horizontally. For a smaller setup where everything fits into a single server you might want to use something proven like industry standard [Postfix+Dovecot](https://mailinabox.email/) setup instead. To achieve scalability WildDuck is quite opinionated so if you are used to some specific configuration (ie. relying on Sieve) then you should not use WildDuck.

- **[WildDuck WebMail](https://webmail.wildduck.email/)** – is a demo server running WildDuck. You can register an account and try sending and receiving messages through the web based client or set up an IMAP client to run against that server  
  **NB! Sending emails from *wildduck.email* is disabled due to spamming. Messages are accepted for delivery both from SMTP and webmail but not sent out. Sorry.**
- **[Source Code](https://github.com/nodemailer/wildduck)** – WildDuck source on Github
- **[General documentation](https://docs.wildduck.email/)** – How to set it up and how to operate
- **[API Documentation](https://api.wildduck.email/)** – WildDuck has a REST API to control all parts of the server
- **[Installation instructions](https://docs.wildduck.email/#/general/install)** – to set up all required parts (WildDuck, Haraka, ZoneMTA, WildDuck Webmail) on your server.
- **[Docker support](https://github.com/nodemailer/wildduck-dockerized)** – instructions for using WildDuck in Docker

#### Scalable

WildDuck does not use a file system to store email messages (or any data, to think of it) as everything is stored on a MongoDB cluster. WildDuck supports MongoDB sharding, so you can set up your cluster as large as you want to.

> For extra tuning WildDuck separates attachments from message content and stores these under a different database name, so you could mount a larger and less expensive SATA to store attachments while running everything else from smaller and faster SSD drives.

All WildDuck instances are stateless, so to increase throughput, you could add more WildDuck application servers behind a TCP load balancer, no need to worry about how to send specific users to specific mail servers.

#### IMAP Protocol Support

Multiple newer and experimental mail server software projects offer great scalability but lack on the protocol side, usually providing only the simplistic and less capable POP3 protocol. WildDuck has first-class support for IMAP. Any email client should be able to connect to it.

#### андрис@уайлддак.орг

Yes, this is a valid email address hosted by a WildDuck instance. WildDuck supports all Unicode-related extensions – email addresses, folder names, message headers, and so on.

#### Advanced Security

WildDuck is more secure by definition than most alternatives. It does not require root privileges, does not touch the file system, does not run any shell commands, and is written in a memory-safe language. It also has some built-in security features to help secure user accounts.

WildDuck supports *Application-Specific* Passwords and multi-factor authentication, it includes TOTP and U2F helper methods, but you can also BYO. Security events are logged and can be inspected by the user. Users can also set their GPG public key to encrypt stored emails. Authentication attempts are rate-limited to prevent brute-forcing.

#### OS Agnostic

You can run WildDuck on any system that supports Node.js, MongoDB, and Redis.

#### Granular Control

Everything in WildDuck can be controlled by REST API, no need to modify config files. This means mail account settings, email access, server-side filtering, auto-replies, and even DKIM setup, to name a few.

#### Blazing Fast

While WildDuck works with any existing webmail software that uses IMAP or POP3 for mail access, the demo webmail is blazing fast compared to these alternatives. Webmail demo is a Node.js application that uses WildDuck REST API to access mail which means loading preparsed data straight from the database instead of doing all the IMAP and MIME overhead.

#### Open Source

WildDuck is licensed under the European Union Public License, version 1.2

#### Contact

[андрис@уайлддак.орг](mailto:андрис@уайлддак.орг) (or if you are using some out of date mail stack, then [andris@wildduck.email](mailto:andris@wildduck.email))
