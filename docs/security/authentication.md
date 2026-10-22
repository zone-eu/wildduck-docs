---
sidebar_position: 2
title: Authentication
---

# Authentication

![Authentication](/img/sprites/holding_at_sign.png)


WildDuck provides a centralized authentication system used by all protocols (IMAP, POP3, SMTP) and the HTTP API.

## Password Authentication

User passwords are hashed using pbkdf2 by default (SHA-256, 100,000 iterations, 16-byte salt). Password hashes are stored in the `users` collection in MongoDB.

WildDuck can also verify passwords stored in other formats — bcrypt, argon2, unixcrypt (SHA-512/SHA-256), MD5 crypt, and DES crypt. This is useful when migrating users from other mail systems. On successful login, passwords in legacy formats are automatically rehashed to the default algorithm (pbkdf2).

WildDuck optionally checks passwords against the [Have I Been Pwned](https://haveibeenpwned.com/) breached passwords database. If enabled, users will not be able to set passwords that appear in known data breaches.

## Authentication Scopes

Each authentication attempt has a scope that determines what the credential grants access to:

| Scope | Usage |
|-------|-------|
| **master** | Full account access — only the main account password can be used for this scope |
| **imap** | IMAP protocol access |
| **pop3** | POP3 protocol access |
| **smtp** | SMTP submission access |
| **mcp** | MCP-only credentials use the `mcp:read` role, which also grants its explicitly allowlisted read-only API routes |

When 2FA is enabled, IMAP, POP3, and SMTP access must use Application-Specific Passwords. The main account password can be used for interactive `master` and `mcp` authentication with a second-factor challenge. See [MCP credentials and service](/docs/security/mcp).

## Two-Factor Authentication

When `POST /authenticate` requests a token with `token: true`, accounts with
TOTP or WebAuthn enabled must complete the challenge before the credential is
issued when `strict2fa` is enabled (the default). The response contains a
short-lived nonce instead of the token. A successful TOTP check or WebAuthn
assertion completes the login and returns the credential. MCP scope always
waits for its configured TOTP or WebAuthn challenge, even when `strict2fa` is
disabled. With `strict2fa` disabled, master-scope login keeps its compatibility
behavior: it returns the API token before the optional challenge, and the
nonce can mark that same session as MFA-verified after success.

### TOTP (Time-based One-Time Passwords)

WildDuck generates random TOTP seeds. They are encrypted at rest only when
`totp.secret` is configured. Otherwise they are stored in plaintext in the
user record. Configure a strong, stable `totp.secret` before enabling TOTP and
keep it unchanged: changing or removing it prevents existing encrypted seeds
from being decrypted. New values use AES-256-GCM. `totp.cipher` is only used
when reading legacy encrypted values.

**Setup flow:**
1. `POST /users/:user/2fa/totp/setup` — generates a TOTP seed and returns a QR code
2. User scans QR code with an authenticator app
3. `POST /users/:user/2fa/totp/enable` — verifies a TOTP token and enables 2FA

**Rate limiting:** 6 invalid TOTP checks are allowed within a 180-second window before the account is temporarily locked.

### WebAuthn / FIDO2

WildDuck supports WebAuthn/FIDO2 hardware security keys (e.g., YubiKey) as a second factor. This replaces the legacy U2F implementation.

**Registration flow:**
1. `POST /users/:user/2fa/webauthn/registration-challenge` — begins FIDO2 registration, returns a challenge
2. User interacts with their security key
3. `POST /users/:user/2fa/webauthn/registration-attestation` — completes registration

**Authentication flow:**
1. `POST /users/:user/2fa/webauthn/authentication-challenge` — begins authentication challenge
2. User interacts with their security key
3. `POST /users/:user/2fa/webauthn/authentication-assertion` — verifies the response

Multiple security keys can be registered per user. Keys can be listed via `GET /users/:user/2fa/webauthn/credentials` and removed via `DELETE /users/:user/2fa/webauthn/credentials/:credential`.

### Custom 2FA

WildDuck also supports plugging in custom 2FA mechanisms through its API.

## Application-Specific Passwords (ASP)

When 2FA is enabled, users need Application-Specific Passwords to access IMAP, POP3, and SMTP. ASPs provide scoped access without exposing the master password.

**Characteristics:**
- 16-byte strings of lowercase random latin characters
- Whitespace is ignored (allows formatting as groups for readability)
- Hashed with pbkdf2 (same algorithm as user passwords)
- A selector is computed from the password using SHA-1 for fast ASP detection during login
- Each ASP has a defined scope (e.g., `["imap", "pop3"]`) — the "master" scope is never allowed
- ASPs can have a TTL (time-to-live) for temporary access
- Last-use tracking records when each ASP was last used

**API endpoints:**
- `GET /users/:user/asps` — list application passwords
- `POST /users/:user/asps` — create a new ASP with specified scopes
- `DELETE /users/:user/asps/:asp` — revoke an application password

### iOS Mobile Configuration

WildDuck can generate Apple `.mobileconfig` profile files for iOS/macOS email client auto-configuration. These profiles include the ASP credentials and server settings, making it easy for Apple device users to set up their email.

## Rate Limiting

Authentication attempts are rate-limited to prevent brute-force attacks:

| Check | Limit | Window |
|-------|-------|--------|
| Password | 12 failures | 120 seconds |
| TOTP | 6 failures | 180 seconds |

Successful authentication clears the rate limit counters for that account. The window starts from the first failed attempt.

Rate limiting is enforced via Redis counters with TTL-based expiration.
