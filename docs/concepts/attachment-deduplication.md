---
sidebar_position: 7
title: Attachment deduplication
---

# Attachment deduplication

![Attachment Deduplication](/img/sprites/holding_multiple_emails.png)


Wild Duck IMAP server de-duplicates attachments. "Attachment" in this case means the base64 or quoted-printable encoded mime node contents, not the decoded file. Even though using encoded content means a lot of false negatives (the same file in different emails might be counted as different attachment) it is needed to guarantee the validity of different signature schemes (DKIM, GPG etc.). A message retrieved from Wild Duck looks exactly the same as the message that was stored even though Wild Duck parses the message into a tree-like object and rebuilds the message when retrieving. Original RFC822 formatted message is not stored anywhere.

When an attachment is found in an email, WildDuck calculates a SHA256 hash of its encoded MIME contents. A matching entry in the MongoDB attachment catalog reuses the existing payload, whether it lives in GridFS or S3. WildDuck increments its reference count and records the attachment ID in the message.

Email deletion does the same thing in reverse - the reference counters in attachment store are decremented by one for attachments that are listed in the attachments array in the email message object. Attachment content is not deleted immediately, there is a separate garbage collecting process that periodically removes all attachments that have reference counter as zero.

To prevent false positives when deleting attachments, the same magic number system is used as in [Mail.ru](https://team.mail.ru/efficient-storage-how-we-went-down-from-50-pb-to-32-pb/). Every message gets a random number assigned. The additional "magic" counter of an attachment store entry is incremented by that random number when message is added and decremented when the message is deleted. If everything worked as it should then the attachment object should end up with two zeroed counters when no references are left. If something happened during deletions and only one of these counters is zero then that attachment is not deleted.

For configured GridFS and S3 backends, migration, and storage operations, see [Attachment storage](../operations/attachment-storage).
