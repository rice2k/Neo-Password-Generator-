# Changelog

## v2.0.0 - 2026-09-09

Major Neo Password Generator upgrade.

### Added

- New passphrase generator mode.
- 3–8 word passphrases from a built-in local word list.
- Configurable passphrase separator.
- Optional word capitalization.
- Optional cryptographically random two-digit suffix.
- Optional symbol suffix.
- Passphrase presets: Standard, Strong, and Compact.
- Batch generation expanded to 20 results.
- Visible v2.0 version badge and Version 2 details section.
- Updated strength messaging for both passwords and passphrases.
- New repository screenshot and README preview section.

### Improved

- Refined responsive layout and Neo visual treatment.
- Clearer privacy and security explanations.
- Result list can scroll when generating large batches.
- Existing password generator continues to use `crypto.getRandomValues()` with rejection sampling.

## v1.0.0 - 2026-09-09

Initial Neo Password Generator release.

- Secure browser-only password generation.
- Password lengths from 4 to 128 characters.
- Character-group controls and presets.
- Ambiguous-character and custom exclusions.
- No-repeat and start-with-letter modes.
- Entropy/strength estimate, copy controls, themes, and GitHub Pages workflow.
