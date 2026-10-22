---
sidebar_position: 6
title: Labels
---

# Labels

Labels let users organize messages across mailboxes. Each label has a persistent ID, a name, and optional metadata such as a display color. Creating a label does not assign it to a message, and empty labels remain available in the account's label list.

## Manage labels

Create a label with `POST /users/:user/labels`:

```json
{
  "name": "Projects",
  "metaData": { "color": "blue" }
}
```

Creating the same name again returns the existing label. Names are scoped to the account and matched exactly, including leading and trailing whitespace. Labels have no parent/child hierarchy. Names must be nonempty, at most 256 UTF-16 code units, and must not start with `$` or `\` or use a reserved system flag name. Each account supports up to 5000 labels.

| Operation | Endpoint |
|-----------|----------|
| List labels, including empty labels | `GET /users/:user/labels` |
| Include message and unseen counts | `GET /users/:user/labels?counters=true` |
| Read one label | `GET /users/:user/labels/:label` |
| Rename or update metadata | `PUT /users/:user/labels/:label` |
| Delete a label and its assignments | `DELETE /users/:user/labels/:label` |

The `:label` path parameter is the persistent ID. Renaming preserves that ID. Deletion schedules a background task that removes the label from messages and filter actions and notifies connected clients of flag changes. It does not delete the messages.

## Assign and search

Message updates accept label **names**:

- `labels` replaces the full set.
- `addLabels` adds names while preserving other assignments.
- `removeLabels` removes names while preserving other assignments.

Use either `labels` or the incremental fields in one request. Message uploads can also set `labels`, and [filter actions](/docs/concepts/message-filtering) can apply labels on delivery. Message and filter writes register new names automatically. REST message search accepts a `label` name filter.

See the [API reference](/docs/category/wildduck-api) for request and response schemas.

## IMAP representation

IMAP exposes label assignments in `FETCH FLAGS` as `$wdlabel$` followed by the 24-character lowercase label ID:

```text
$wdlabel$507f1f77bcf86cd799439011
```

An IMAP client can resolve the ID to a display name through the label API. `STORE` and `APPEND` recognize this flag only when it names an active label belonging to the account. `SEARCH KEYWORD` and `UNKEYWORD` recognize the same form.

Other custom flags, including unknown or malformed label IDs, remain ordinary IMAP flags. IMAP does not create label records.

## Deployment

Install the current label indexes before enabling label writes. MongoDB stores label identity in `labels` and assignments in `messages.labels` and `filters.action.labels`. Ordinary IMAP flags remain in `messages.flags`.

See the upstream [label model](https://github.com/zone-eu/wildduck/blob/master/docs/labels.md) for storage details.
