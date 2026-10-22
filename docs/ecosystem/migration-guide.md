---
sidebar_position: 4
title: Migration guide
---

# Migration guide

![Migration Guide](/img/sprites/lost_message.png)


This guide describes a migration from an existing mail system to WildDuck. Create the destination accounts before importing messages. For current WildDuck installation and configuration, follow the [installation documentation](/docs/getting-started/installation).

## Install wildduck

This is rather straightforward. Install it via the [builtin setup script][0].
The best is on a server or virtual server (I installed inside a kvm virtual server).

## Check your email server

There [are][1] some [useful][2] website to [check][3] if your email server working correctly.
You may need to remove yourself from some [spam site][4].
After migration, check whether messages from the new server reach the inbox or junk folder at major providers. A passing SPF or DKIM check does not guarantee inbox placement. A delivery test such as [Email Spam Tester][5] can help.

## Domain settings

### SPF

You need to add a TXT record into DNS:
v=spf1 a:yourdomain.com ~all

### DKIM

Also DKIM settings.

```
jun2018._domainkey .yourdomain.com
v=DKIM1;p=MIIBIjANBgkqhkiG9...
```

### Certification (for wildduck-webmail)

```
HOSTNAME="mail.yourdomain.com"
/root/.acme.sh/acme.sh --issue --nginx --server letsencrypt \
    -d "$HOSTNAME" \
    --key-file       /etc/wildduck/certs/privkey.pem  \
    --fullchain-file /etc/wildduck/certs/fullchain.pem \
    --reloadcmd     "/usr/local/bin/reload-services.sh" \
--force || echo "Warning: Failed to generate certificates, using self-signed certs"
```

## Recheck the wildduck settings

```
/etc/zone-mta/plugins/wildduck.toml
hostname="yourdomain.com"
->
hostname="mail.yourdomain.com"
```

## Outlook client settings

(Wildduck server is on your local network)

```
name: Anon Imous
email address: anon@yourdomain.com

Server details
account type: IMAP
Incoming messages server: 192.168.0.1
Outgoing messages server: 192.168.0.1
Login details
username: anon
password: ftxgXXXXYYYYlhkf (generated via wildduck webmail, application specific password)
[x] password storage
[ ] Secure password ... login

[Advanced settings] ->
[Outgoing emails server]
[x] Outgoing server (SMTP) requires authentication
[x] Same settings with incoming email server

[Special]
Incoming server (IMAP): 993
The following secure connection type: SSL
Outgoing server (SMTP): 587
The following secure connection type: TLS
```

## Add users to wildduck

Create accounts through the WildDuck API or a graphical interface such as [WildDuck Admin](https://github.com/zone-eu/wildduck-admin). [WildDuck Webmail](/docs/ecosystem/webmail) also provides account registration in deployments where it is enabled.

## Migrate emails from old system (outlook clients)

The best method was to convert the outlook's .pst file to maildir format:

(I did the conversion inside a separate virtual machine (docker container)).

```
sudo apt-get install pst-utils
sudo apt-get install isync
mkdir anon_maildir; cd anon_maildir
readpst -M anon_inbox.pst
```

### Migrate maildir to WildDuck

There are multiple ways to import maildir into WildDuck

#### 1. import-maildir tool

You can use [import-maildir](https://github.com/nodemailer/import-maildir) tool to import maildir files straight to WildDuck database. You would need to have access to WildDuck database servers and the tool is tested on Courier based maildir folders, so it might not handle all extra additions of Dovecot maildir.

```
$ git clone https://github.com/nodemailer/import-maildir.git
$ cd import-maildir
$ npm install --production
```

Next edit config/default.toml and set correct MongoDB and Redis settings. There are other tunable properties as well but these could be left as is.

```
$ nano config/default.toml
```

Once everything is set up you can start the importer

```
$ ./bin/import-maildir userid:maildirpath
```

Where

-   **userid** is either user id (24byte hex), username or an email address of the user to be imported (the user account must already exists in WildDuck)
-   **maildirpath** is the maildir folder location of that user

```
$ ./bin/import-maildir user@example.com:/var/mail/user_example.com/
```

If you want to import multiple users, then you can do so with a single command

```
$ ./bin/import-maildir user1@example.com:/var/mail/user1_example.com/ user2@example.com:/var/mail/user2_example.com/ user3@example.com:/var/mail/user3_example.com/
```

> In case of multiple users you might want to edit `uploaders` value to something greater than 1. This would allow to import users in parallel.

#### 2. mbsync tool

Use [mbsync](https://isync.sourceforge.io/mbsync.html) when both the source and destination are reachable over IMAP. It requires credentials for both servers and is slower than direct Maildir import because messages pass through IMAP. Set the old server as `Far` and WildDuck as `Near`, then configure a pull-only channel so source messages are copied toward WildDuck. The following is a direction sketch. Fill in host, TLS certificate, and password settings for both accounts:

```
$ cat ~/.mbsyncrc
IMAPAccount old-server
# Address of the source IMAP server
Host old-imap.example.net
User anon@yourdomain.com
# Read the password from an encrypted file instead of storing it with Pass
PassCmd "gpg2 -q -d ~/.old-mailpass.gpg"
# Use implicit TLS
TLSType IMAPS
# Additional trusted certificate for this server, if needed
CertificateFile ~/.cert/old-imap.pem

IMAPStore old-store
Account old-server

IMAPAccount wildduck
# Address of the destination WildDuck server
Host mail.yourdomain.com
User anon@yourdomain.com
# Use an application-specific password when two-factor authentication is enabled
PassCmd "gpg2 -q -d ~/.wildduck-mailpass.gpg"
# Use implicit TLS
TLSType IMAPS
# Additional trusted certificate for this server, if needed
CertificateFile ~/.cert/wildduck.pem

IMAPStore wildduck-store
Account wildduck

Channel old-to-wildduck
# Copy from the old server (Far) to WildDuck (Near)
Far :old-store:
Near :wildduck-store:
# Exclude everything under the internal [Gmail] folder, except selected folders
#Patterns INBOX * ![Gmail]* "[Gmail]/Sent Mail" "[Gmail]/Starred" "[Gmail]/All Mail"
# Or include everything, with INBOX listed explicitly
Patterns INBOX *
# Automatically create missing mailboxes only on WildDuck
Create Near
# Copy new messages from Far to Near
Sync Pull New
# Preserve message arrival dates
CopyArrivalDate yes
# Save synchronization state locally. The trailing "/" is important
SyncState ~/.mbsync/old-to-wildduck/

```

Create the local state directory before the first run. `Patterns INBOX *` includes INBOX explicitly alongside other folders. Start with a dry run and inspect the planned operations, then run the channel:

```bash
mkdir -p ~/.mbsync/old-to-wildduck
mbsync --dry-run old-to-wildduck
mbsync old-to-wildduck
```

Do not replace `Sync Pull New` with the default bidirectional sync for a migration copy. This example does not propagate later flag changes or deletions. Review folder mapping and the isync documentation for the source server's folder names before importing.

[0]: https://github.com/zone-eu/wildduck/blob/master/setup/README.md
[1]: https://toolbox.googleapps.com/apps/checkmx/check?domain=yourserver.com&dkim_selector=
[2]: https://www.mail-tester.com/
[3]: http://www.appmaildev.com/en/dkim/
[4]: http://www.barracudacentral.org/rbl/removal-request/
[5]: https://email-spam-tester.com/
