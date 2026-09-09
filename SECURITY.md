# Security

Neo Password Generator is designed as a fully client-side utility.

## Security properties

- Password generation uses the browser Web Crypto API.
- Generated passwords are not intentionally transmitted to a backend.
- Generated passwords are not saved to local storage by the application.
- The application has no runtime third-party JavaScript dependencies.
- Only the selected visual theme may be stored locally.

## Reporting an issue

If you identify a bug that could weaken password generation, expose generated values, or otherwise affect security, open a GitHub issue with reproduction details. Do not include real passwords, secrets, tokens, or credentials in a report.

## Scope

The displayed entropy score is an estimate and should not be interpreted as a formal security guarantee. Users should follow the password and MFA requirements of the service they are using.
