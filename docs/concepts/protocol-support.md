---
sidebar_position: 3
title: E-Mail Protocol support
---

# E-Mail Protocol support

![Protocol Support](/img/sprites/juggling_mail.png)


WildDuck IMAP server supports the following IMAP standards:

-   The entire **IMAP4rev1** suite with some minor differences from the spec. See below for [IMAP Protocol Differences](#imap-protocol-differences) for a complete
    list
-   **IDLE** ([RFC2177](https://tools.ietf.org/html/rfc2177)) – notfies about new and deleted messages and also about flag updates
-   **CONDSTORE** ([RFC4551](https://tools.ietf.org/html/rfc4551)) and **ENABLE** ([RFC5161](https://tools.ietf.org/html/rfc5161)) – supports most of the spec,
    except metadata stuff which is ignored
-   **STARTTLS** ([RFC2595](https://tools.ietf.org/html/rfc2595))
-   **NAMESPACE** ([RFC2342](https://tools.ietf.org/html/rfc2342)) – minimal support, just lists the single user namespace with hierarchy separator
-   **UNSELECT** ([RFC3691](https://tools.ietf.org/html/rfc3691))
-   **UIDPLUS** ([RFC4315](https://tools.ietf.org/html/rfc4315))
-   **SPECIAL-USE** ([RFC6154](https://tools.ietf.org/html/rfc6154))
-   **ID** ([RFC2971](https://tools.ietf.org/html/rfc2971))
-   **MOVE** ([RFC6851](https://tools.ietf.org/html/rfc6851))
-   **AUTHENTICATE PLAIN** ([RFC4616](https://tools.ietf.org/html/rfc4616)) and **SASL-IR** ([RFC4959](https://tools.ietf.org/html/rfc4959))
-   **APPENDLIMIT** ([RFC7889](https://tools.ietf.org/html/rfc7889)) – maximum global allowed message size is advertised in CAPABILITY listing
-   **UTF8=ACCEPT** ([RFC6855](https://tools.ietf.org/html/rfc6855)) – this also means that WildDuck natively supports unicode email usernames. For example
    [андрис@уайлддак.орг](mailto:андрис@уайлддак.орг) is a valid email address that is hosted by a test instance of WildDuck
-   **QUOTA** ([RFC2087](https://tools.ietf.org/html/rfc2087)) – Quota size is global for an account, using a single quota root. Be aware that quota size does not
    mean actual byte storage in disk, it is calculated as the sum of the [RFC822](https://tools.ietf.org/html/rfc822) sources of stored messages.
-   **COMPRESS=DEFLATE** ([RFC4978](https://tools.ietf.org/html/rfc4978)) – Compress traffic between the client and the server

### Apple push notifications

WildDuck supports `XAPPLEPUSHSERVICE` for compatible Apple Mail clients. It is disabled by default and requires an Apple-issued APNs certificate, private key, and topic:

```toml
[imap.aps]
enabled = true
topic = "com.apple.mobilemail.push.example"
certPath = "/etc/wildduck/apns.pem"
keyPath = "/etc/wildduck/apns.key"
sandbox = false
```

Use the topic from your push certificate. These are APNs credentials, separate from the TLS certificate used for IMAP connections. See the [IMAP configuration](https://github.com/zone-eu/wildduck/blob/master/config/imap.toml) for the available settings.

### Synchronization

WildDuck more or less passes the [ImapTest](https://www.imapwiki.org/ImapTest/TestFeatures) Stress Testing run. Common errors that arise in the test are
unknown labels (WildDuck doesn't send unsolicited `FLAGS` updates even though it does send unsolicited `FETCH FLAGS` updates) and sometimes NO for `STORE`
(messages deleted in one session can not be updated in another).

In comparison WildDuck is slower in processing single user than Dovecot. Especially when fetching messages, which is expected as Dovecot is reading directly
from filesystem while WildDuck is recomposing messages from different parts.

Raw read/write speed for a single user is usually not relevant anyway as fetching entire mailbox content is not something that happens often. WildDuck offers
better parallelization through MongoDB sharding, so more users should not mean slower response times. It is also more important to offer fast synchronization
speeds between clients (eg. notifications about new email and such) where WildDuck excels due to the write ahead log and the ability to push this log to
clients.

## POP3 Support

In addition to the required POP3 commands ([RFC1939](https://tools.ietf.org/html/rfc1939)) WildDuck supports the following extensions:

-   **UIDL**
-   **USER**
-   **PASS**
-   **SASL PLAIN**
-   **PIPELINING**
-   **TOP**

### POP3 command behaviors

All changes to messages like deleting messages or marking messages as seen are stored in storage only in the UPDATE stage (eg. after calling QUIT). Until then
the changes are preserved in memory only. This also means that if a message is downloaded but QUIT is not issued then the message does not get marked as _Seen_.

#### LIST

POP3 listing displays the newest 250 messages in INBOX (configurable)

#### UIDL

WildDuck uses message `_id` value (24 byte hex) as the unique ID. If a message is moved from one mailbox to another then it might _re-appear_ in the listing.

#### RETR

If a messages is downloaded by a client this message gets marked as _Seen_

#### DELE

If a messages is deleted by a client this message gets marked as Seen and moved to Trash folder

## SMTP and LMTP Support

WildDuck's supported message submission path for normal deployments is SMTP through ZoneMTA and the `zonemta-wildduck` plugin.

LMTP (Local Mail Transfer Protocol) is also supported, but only for local test environments. It is reserved exclusively for local testing and should not be
used as a public-facing or production submission protocol.

## IMAP Protocol Differences

This is a list of known differences from the IMAP specification. Listed differences are either intentional or are bugs that became features.

1.  `\Recent` flags is not implemented and most probably never will be (RFC3501 2.3.2.)
2.  Unsolicited `FLAGS` responses (RFC3501 7.2.6.) and `PERMANENTFLAGS` are not sent (except for as part of `SELECT` and `EXAMINE` responses). WildDuck notifies
    about flag updates only with unsolicited FETCH updates.
3.  WildDuck responds with `NO` for `STORE` if matching messages were deleted in another session
4.  `SEARCH` reads search strings as UTF-8 and accepts `US-ASCII` and `UTF-8` as `CHARSET` values. Other charsets receive `NO [BADCHARSET (US-ASCII UTF-8)]` (RFC3501 6.4.4.).
5.  Metadata arguments for `SEARCH MODSEQ` are ignored (RFC7162 3.1.5.). You can define `<entry-name>` and `<entry-type-req>` values but these are not used for
    anything
6.  `SEARCH TEXT` and `SEARCH BODY` use MongoDB text search against the decoded plaintext version of the message. This differs from RFC3501's literal string matching over the full message (`TEXT`) or body section (`BODY`).

Any other differences are most probably real bugs and unintentional.

The implemented `SEARCH` keys include the standard flag, address, subject, header, date, size, keyword, UID, `OR`, and `NOT` criteria, plus `OLDER`, `YOUNGER`, and `MODSEQ`. Date and size operands are validated by the server. The accepted keys and their argument types are maintained in [the IMAP parser](https://github.com/nodemailer/wildduck/blob/master/imap-core/lib/imap-tools.js#L64-L98). This list describes parser support, while backend behavior can differ for full-text criteria as noted above.

## Message fidelity

Since version 1.53.0, messages stored with the versioned MIME tree are rebuilt byte for byte as received, including transport padding, multipart epilogues, and parts without a body section. Older stored trees retain their earlier rendering behavior. See [Operating WildDuck](/docs/operations/operating-wildduck#upgrading) for the version and rolling-upgrade details.
