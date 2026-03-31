---
sidebar_position: 3
title: Import & Export
---

# Import & Export

![Import and Export](/img/sprites/delivering_mail_rush.png)


WildDuck supports importing email from external sources and exporting messages for backup or migration purposes.

## Import from Maildir

You can use the [import-maildir](https://github.com/nodemailer/import-maildir) tool to import maildir files straight to the WildDuck database. This has less overhead than IMAP-based imports, and you do not need to know the user's password.

### Setup

```bash
git clone https://github.com/nodemailer/import-maildir.git
cd import-maildir
npm install --production
```

Edit `config/default.toml` to set the correct MongoDB and Redis connection settings.

### Usage

```bash
./bin/import-maildir user@example.com:/var/mail/user_example.com/
```

Where:
- **user identifier** — user ID (24-byte hex), username, or email address (account must already exist in WildDuck)
- **maildir path** — path to the maildir folder

Multiple users can be imported in a single command:

```bash
./bin/import-maildir user1@example.com:/var/mail/user1/ user2@example.com:/var/mail/user2/
```

> For multiple users, consider setting the `uploaders` value to greater than 1 for parallel imports.

### Notes

- The tool is tested primarily with Courier-based maildir folders
- Dovecot maildir extensions may not be fully supported
- No user passwords are needed — the tool writes directly to MongoDB

## IMAP-based Import (mbsync)

For environments where direct database access is not available, you can use [mbsync](https://isstracker.com/man/mbsync.1.html) to sync mailboxes from another IMAP server into WildDuck. This is slower than import-maildir due to IMAP protocol overhead and requires user passwords.

See the [Migration Guide](/docs/ecosystem/migration-guide) for detailed mbsync configuration examples.

## MBOX Import/Export

WildDuck supports importing and exporting messages in MBOX format through its API. This is useful for individual mailbox backup and restore operations.
