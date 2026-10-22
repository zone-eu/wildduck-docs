---
sidebar_position: 4
title: ACME Certificates
---

# ACME Certificates

![TLS Certificates](/img/sprites/balancing_mail.png)


WildDuck is able to manage SNI certificates with Let's Encrypt or any other ACME compatible certificate authority.

Requirements to use auto-renewing SNI certificates:

-   SNI certificates are used by IMAP, POP3, and the WildDuck API server. External components (Haraka for inbound SMTP, ZoneMTA for outbound SMTP) manage their own certificates separately.
-   HTTP-01 validation needs port 80 reachable for each hostname. The ACME agent can listen on port 80, or the WildDuck API can serve the challenge when it owns that port.
-   Configure default TLS certificates in `config/tls.toml` and, where needed, service-specific TLS sections. WildDuck uses these when no matching SNI certificate is available.
-   Register an ACME-managed certificate with `POST /certs`. The token needs permission to create certificates. See the current [WildDuck API reference](/docs/category/wildduck-api).

```bash
curl --fail-with-body -sS -X POST http://localhost:8080/certs \
  -H 'content-type: application/json' \
  -H "X-Access-Token: $WILDDUCK_TOKEN" \
  -d '{
    "servername": "imap.example.com",
    "acme": true
  }'
```

If WildDuck API does not listen on port 80, enable the ACME agent in `config/acme.toml` and expose its configured port. Each IP address returned for the hostname must be able to answer the HTTP-01 challenge.
