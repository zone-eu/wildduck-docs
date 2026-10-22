---
sidebar_position: 10
title: API Roles
---

# Roles

![Access Tokens](/img/sprites/reading_scroll.png)


WildDuck API can be accessed with the root token from configuration or with
role-based and user-bound tokens. The root token has the broadest privileges,
other roles are limited by the grants in the configured role definitions.

An API token for a user can be issued by authenticating with scope `master` and
`token: true`:

```
# For an account with no pending 2FA challenge
$ curl -i -XPOST http://localhost:8080/authenticate \
  -H 'Content-type: application/json' \
  -d '{
    "username": "myuser",
    "password": "secretpass",
    "scope": "master",
    "token": true
  }'
```

When 2FA is required and `strict2fa` is enabled, the response contains a
short-lived nonce instead of a token. See [Authentication](/docs/security/authentication)
for the challenge flow.

The resulting user token is limited to that user's API access and has a
configured lifetime. For an MCP-only credential, see [MCP credentials and
service](/docs/api/mcp).

For other roles, use the `bin/access-tokens` script.

```
$ ./bin/access-tokens provision admin root
Generated access token for admin[root]:
3ab3a00ae63227673ab423b3be3afabe5e185b4c
```

In this case "admin" is a username for the token (this is not a user account but just a name to use in access logs etc) and "root" is the role. You need to run this from the WildDuck directory with the actual production config as the tokens are written to Redis.

### Considerations

When building a publicly available front end application to access mailboxes consider the following:

-   Host your public app and WildDuck API on separate servers
-   Configure the API to require valid access tokens
-   Do not store actual root token in your public application config
-   Generate a token with the `tokenAuth` role for `/authenticate` calls that request user tokens
-   Request user tokens from authentication calls
-   Use user tokens for normal API requests

User-bound tokens limit API access to the associated user's account, subject to
the role grants. A leaked token still exposes that user's data and remains usable
until it expires or is revoked, so do not embed long-lived credentials in
public client code.
