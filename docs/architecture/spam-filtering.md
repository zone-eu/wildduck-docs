---
sidebar_position: 5
title: Spam Filtering (Rspamd)
---

# Spam Filtering

![Spam Filtering](/img/sprites/phishing_detection.png)


WildDuck integrates with [Rspamd](https://rspamd.com/) for spam detection. Rspamd is a fast, free spam filtering system that uses various techniques including content analysis, DNS blocklists, SPF/DKIM verification, and machine learning.

## How It Works

Rspamd is integrated through the Haraka inbound SMTP pipeline:

1. **Haraka receives a message** on the SMTP port
2. **haraka-plugin-rspamd** sends the message to Rspamd for scanning
3. **Rspamd analyzes the message** and returns a spam score and action recommendation
4. **haraka-plugin-wildduck** reads the Rspamd results and routes the message:
   - Messages flagged as spam → **Junk** folder
   - Clean messages → **INBOX** (or the folder specified by user filters)

## Rspamd Scoring

Rspamd assigns a numerical score to each message based on multiple factors:

- Content analysis (spam patterns, phishing detection)
- DNS blocklists (DNSBL/RBL checks)
- SPF, DKIM, and DMARC verification results
- Fuzzy hash matching against known spam
- Bayesian classifier (learns from user actions)
- URL reputation

The haraka-plugin-wildduck uses Rspamd's action recommendations (reject, greylist, add header, no action) to determine how to handle the message.

## Setup

To use Rspamd with WildDuck:

1. Install Rspamd on your server (included in the WildDuck setup script)
2. Enable the [haraka-plugin-rspamd](https://github.com/haraka/haraka-plugin-rspamd) in your Haraka configuration
3. Ensure haraka-plugin-wildduck is configured to read Rspamd results

The WildDuck [scripted install](https://github.com/zone-eu/wildduck/tree/master/setup) and [Docker setup](https://github.com/nodemailer/wildduck-dockerized) both include Rspamd pre-configured.

## Related Links

- [Rspamd](https://rspamd.com/) — Spam filtering system
- [haraka-plugin-rspamd](https://github.com/haraka/haraka-plugin-rspamd) — Haraka Rspamd integration
