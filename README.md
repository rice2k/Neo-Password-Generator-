# Neo Password Generator

A modern, privacy-focused password generator by **Rice2k**.

Neo Password Generator runs entirely in the browser and uses the Web Crypto API for cryptographically secure random password generation. No account, server, database, API key, or external service is required.

## Live Version

GitHub Pages deployment is included in this repository through `.github/workflows/pages.yml`.

When Pages is active, the project URL is expected to be:

`https://rice2k.github.io/Neo-Password-Generator-/`

## Features

- Secure random generation with `crypto.getRandomValues()`
- Password lengths from 4 to 128 characters
- Lowercase, uppercase, number, and symbol controls
- Presets:
  - Balanced
  - Strong
  - Maximum
  - Easy to type
  - PIN
- Exclude ambiguous characters such as `0`, `O`, `1`, `I`, and `l`
- Custom excluded-character list
- Optional no-repeat mode
- Optional start-with-a-letter mode
- Generate 1, 3, 5, or 10 passwords at once
- Guarantees at least one character from every enabled character set
- Estimated entropy in bits
- Human-readable strength rating
- Copy one password or copy all generated passwords
- Keyboard shortcuts
- Responsive desktop/mobile interface
- Dark and light themes
- Theme preference stored locally
- No generated-password history
- No analytics or password transmission
- No third-party runtime dependencies

## Privacy

Generated passwords never leave the browser through this application.

The app does **not**:

- upload generated passwords;
- save generated passwords to local storage;
- send passwords to a backend;
- call a password-generation API;
- use analytics to record generated values.

Only the selected visual theme may be stored locally in the browser.

## Security Design

### Cryptographic randomness

The generator uses `window.crypto.getRandomValues()` rather than `Math.random()`.

A rejection-sampling method is used when converting random 32-bit values into character indexes. This avoids modulo bias when selecting from a character pool.

### Selected character groups

When lowercase, uppercase, numbers, or symbols are enabled, the generator first selects at least one character from every enabled group. It then fills the remaining positions from the combined pool and performs a cryptographically driven shuffle.

### No-repeat mode

When enabled, each character may appear only once. The app checks the available character pool before generating and reports an error if the requested length is impossible.

### Entropy estimate

The displayed entropy value is an estimate based on the configured password length and available character pool. It is intended as a useful comparison aid, not a guarantee of resistance against every attack model.

## Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| `Ctrl/Command + Enter` | Generate passwords |
| `Ctrl/Command + Shift + C` | Copy the first generated password |

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Main application and security information |
| `style.css` | Responsive Neo interface and themes |
| `app.js` | Secure password generation and application logic |
| `.github/workflows/pages.yml` | GitHub Pages deployment |
| `.nojekyll` | Keeps the static Pages site untouched by Jekyll |
| `CHANGELOG.md` | Version history |

## Running Locally

No build process is required.

1. Download or clone the repository.
2. Open `index.html` in a modern browser.
3. Generate passwords entirely offline.

For the most consistent clipboard behavior, serving the directory through a local web server is recommended, but password generation itself works without one.

## Recommended Password Practices

- Prefer long, randomly generated passwords.
- Use a unique password for every service.
- Store passwords in a reputable password manager.
- Enable multi-factor authentication when available.
- Follow the password rules required by the specific service or organization.

## Project History

This project is a rebuilt and expanded successor to an older offline HTML password-generator file in the Rice2k archive. The current Neo version was rewritten as a clean standalone application with stronger generation logic, improved options, security information, accessibility, responsive design, and GitHub Pages deployment.

## Author

**Rice2k / Christopher Schumacher**

GitHub: `https://github.com/rice2k`
