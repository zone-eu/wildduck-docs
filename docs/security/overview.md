---
sidebar_position: 1
title: Security Overview
---

# Security Overview

![Security Overview](/img/sprites/inspecting_email.png)


For detailed information on specific security topics, see [Authentication](/docs/security/authentication), [Access Tokens](/docs/security/access-tokens), and [Encryption](/docs/security/encryption).

## Passwords

User password is hashed with pbkdf2 by default (SHA-256, 100,000 iterations). WildDuck also supports verifying passwords hashed with bcrypt, argon2, unixcrypt, md5, and DES — passwords in legacy formats are automatically rehashed to pbkdf2 on successful login. Password hash is stored in the user entry in the users database.

## 2FA

WildDuck generates random TOTP seed tokens. These are encrypted using AES-256-GCM cipher with a master password configured in application settings. Encrypted TOTP seed is stored in the user entry in the users database.

WildDuck also supports WebAuthn/FIDO2 hardware security keys for second factor authentication.

If 2FA is enabled then account password can only be used for the "master" scope but not for IMAP, POP3 or SMTP scopes. In these cases the user must generate an Application Specific Password for the required scope(s).

## Application Specific Passwords

Application Specific Passwords are 16 byte strings, consisting of lowercase random latin characters. ASPs can include additional whitespace symbols as all whitespace symbols are removed from the password before doing any validations with it (this behavior does not extend to the account password where whitespace symbols matter). ASPs are stored as separate _asp_ entries in the users database.

ASPs are hashed with pbkdf2 (same as user passwords). Additionally the 4 first symbols of the ASP are hashed with md5. This is needed to detect potential ASPs when authenticating (user password is compared against only these ASPs that have a matching md5 hash of the 4 first characters).

ASPs have a scope set (an array of strings). When authenticating then the authentication only succeeds if the requested scope matches. ASP can never be used for the "master" scope, this scope is only allowed for the account password.

## Authentication rate limiting

Both password and TOTP checks are rate limited. By default it is allowed to make 12 invalid password authentications in 120 seconds until the account is locked for the rest of the time window. TOTP checks are counted separately, there are allowed 6 invalid checks in 180 second window. Successful authentication clears rate limiting values for that account. Time window starts from the first failed authentication attempt.

## PGP

WildDuck is able to encrypt all added messages with user's public PGP key, this includes messages received via inbound SMTP (Haraka with haraka-plugin-wildduck), messages uploaded from IMAP (Drafts, Sent Mail etc.) and messages uploaded by the MSA (if using zonemta-wildduck).

## Auditing

Authentication related events (this also includes modifications in authentication information) are logged and logs are kept for 30 days. Authentication event includes action (eg. "authentication"), result (eg. "success"), IP address and a few other values.

## Role based tokens

By default a root token is used for validating API calls. You can use role based and user bound tokens instead to limit damage in case tokens are leaked. Read about tokens [here](/docs/security/access-tokens).
