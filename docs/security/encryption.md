---
sidebar_position: 4
title: Encryption
---

# Encryption

![Encryption](/img/sprites/sending_to_server.png)


## PGP Encryption of Stored Messages

WildDuck can encrypt all stored messages with a user's public PGP key. When enabled, messages are encrypted at rest in the database, and only the user with the corresponding private key can decrypt them.

Encryption applies to messages from all sources:
- Messages received via inbound SMTP (Haraka with haraka-plugin-wildduck)
- Messages uploaded via IMAP (Drafts, Sent Mail, etc.)
- Messages uploaded by the MSA (zonemta-wildduck, e.g., sent message copies)

Users can set their PGP public key via the HTTP API when creating or updating their account.

## TLS

All WildDuck protocols support TLS encryption for data in transit:

- **IMAP**: Implicit TLS (port 993) or STARTTLS
- **POP3**: Implicit TLS (port 995) or STARTTLS
- **HTTP API**: TLS can be enabled in configuration

WildDuck supports **SNI** (Server Name Indication), allowing different TLS certificates for different hostnames on the same server. Certificates can be managed via the API or through ACME/Let's Encrypt integration.

See [TLS & ACME Certificates](/docs/operations/certificates) for certificate management details.

## Internal Data Encryption

Several types of sensitive data are encrypted at rest within the database:

| Data | Cipher | Purpose |
|------|--------|---------|
| TOTP seeds | AES-256-GCM | Protects 2FA secrets |
| DKIM private keys | AES-256-GCM | Protects signing keys |
| TLS certificate private keys | AES-256-GCM | Protects server certificates |

Each data type uses a separate secret configured in its respective configuration section (`[totp]`, `[dkim]`, `[certs]`), with key derivation via scrypt. If a secret is not configured for a given type, that data is stored unencrypted.
