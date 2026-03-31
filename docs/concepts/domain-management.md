---
sidebar_position: 4
title: Domain Management
---

# Domain Management

![Domain Management](/img/sprites/flying_with_mail.png)


WildDuck provides API endpoints for managing domains, DKIM keys, domain aliases, and access controls.

## DKIM

DKIM (DomainKeys Identified Mail) allows email recipients to verify that messages were authorized by the domain owner. WildDuck manages DKIM keys via its API, and the actual DKIM signing is performed by ZoneMTA using the zonemta-wildduck plugin.

### Key Management

- `POST /dkim` — Generate a new DKIM key (RSA, 2048-bit default) for a domain
- `GET /dkim` — List all DKIM keys
- `GET /dkim/:dkim` — Get key details including the public key for DNS configuration
- `DELETE /dkim/:dkim` — Delete a DKIM key

When a DKIM key is created, WildDuck generates an RSA key pair and stores it. The API returns the public key value that should be added as a DNS TXT record for the domain.

DKIM private keys can be encrypted at rest using a configurable cipher.

## Domain Aliases

Domain aliases allow you to map an alias domain to a primary domain. All email addresses under the alias domain are automatically resolved to the corresponding addresses on the primary domain.

- `POST /domainaliases` — Create a domain alias (e.g., map `example.org` → `example.com`)
- `GET /domainaliases` — List all domain aliases
- `DELETE /domainaliases/:alias` — Remove a domain alias

This is useful when an organization owns multiple domains and wants all of them to receive email without creating duplicate user accounts.

## Domain Access Control

WildDuck supports domain-level allowlists and blocklists to control which external domains can send email to your users. Access rules are organized by tags.

- `POST /domainaccess/:tag/allow` — Add a domain to an allowlist
- `POST /domainaccess/:tag/block` — Add a domain to a blocklist
- `DELETE /domainaccess/:id` — Remove an access rule

Tags allow grouping access rules for different purposes. SPF exemptions can also be configured at the domain level.

## BIMI

WildDuck supports [BIMI](https://bimigroup.org/) (Brand Indicators for Message Identification), which allows email senders to display their brand logo alongside authenticated messages. WildDuck retrieves and validates BIMI logos and evidence for incoming messages, making the results available in message metadata via the API.
