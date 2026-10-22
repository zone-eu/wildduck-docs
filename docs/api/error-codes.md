# API Error Codes

![API Error Codes](/img/sprites/reading_letter.png)


This is the list with possible error codes returned by the API.

Merged request validation errors return HTTP 400 with an `error`,
`code: "InputValidationError"`, and `details` field. Errors from a handler
after validation usually have an HTTP error status and a JSON body with
`error` and `code` fields, for example `{ "error": "Not enough privileges",
"code": "MissingPrivileges" }`. Errors raised before the route's validation
and handler (such as access-token checks, malformed JSON, or request parsing
errors) use `{ "code": "...", "message": "..." }` instead.
Unexpected server errors return HTTP 500 with `code: "InternalError"` unless a
more specific code is available. Some older endpoints still return inline
`error` bodies with HTTP 200. Check the endpoint's generated API schema for its
status contract.

-   `InvalidToken`
-   `MissingPrivileges`: Not enough privileges
-   `InputValidationError` (various descriptions about invalid input validation)
-   `InternalDatabaseError`
-   `InternalError`
-   `UserNotFound`: This user does not exist
-   `UserExistsError`: This username already exists
-   `AddressExistsError`: Address already exists
-   `AddressNotFound`: Invalid or unknown email address identifier
-   `ChangeNotAllowed`: Can not change special address
-   `WildcardNotPermitted`: Can not set wildcard address as default
-   `AspNotFound`: Invalid or unknown ASP key
-   `InvalidAuthScope`: Profile file requires either imap or pop3 and smtp scopes
-   `AuthFailed`: Authentication failed
-   `DkimNotFound`: This domain does not exist
-   `AliasExists`: This domain alias already exists
-   `AliasNotFound`: This alias does not exist
-   `FilterNotFound`: This filter does not exist
-   `NoSuchMailbox`: This mailbox does not exist
-   `MailboxExistsError`: This mailbox already exists
-   `MessageNotFound`: Invalid message identifier
-   `OverQuotaError`: User is over quota
-   `EmptyMessage`: Empty message provided
-   `FileNotFound`: This file does not exist
-   `InsecurePasswordError`: Provided password was found from breached passwords list
-   `ERRCOMPOSE`: Could not queue message for delivery
-   `KeyGenerateError`: Failed to generate private or public key
-   `InternalConfigError`: Invalid encryption settings
-   `HashError`
-   `UserUpdateFail`: Could not update user
-   `TotpEnabled`: TOTP 2FA is already enabled for this user
-   `QRError`: Failed to generate QR code
-   `TotpDisabled`: TOTP 2FA is not initialized for this user
-   `RateLimitedError`: Authentication was rate limited.
-   `WebAuthnDisabled`: WebAuthn/FIDO2 2FA is not enabled for this user
-   `CustomEnabled`: Custom 2FA is already enabled for this user
-   `CustomDisabled`: Custom 2FA is not enabled for this user
-   `ChallengeNotFound`: WebAuthn challenge was not found
-   `CredentialsNotFound`: WebAuthn credentials were not found
-   `NoUpdates`: Nothing was updated
-   `TooMany`: Instance limit hit
-   `WebhookNotFound`: This webhook does not exist
-   `CertNotFound`: This certificate does not exist
-   `UserDisabled`: User account is disabled
-   `MessageRejected`: Message was rejected
-   `StoreError`: Failed to store message
-   `DroppedByPolicy`: Message was dropped by policy
-   `DisallowedMailboxMethod`: This operation is not allowed on this mailbox
-   `DeleteInProgress`: User deletion is already in progress
-   `RestoreTaskNotFound`: Restore task was not found
-   `DownloadRateLimited`: Download rate limit exceeded
-   `UploadRateLimited`: Upload rate limit exceeded
