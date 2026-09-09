# Neo Password Generator v2

A modern, privacy-focused password and passphrase generator by **Rice2k**.

Neo Password Generator runs entirely in the browser and uses the Web Crypto API for cryptographically secure random generation. No account, database, API key, backend, or analytics service is required.

![Neo Password Generator v2 screenshot](assets/neo-password-generator-v2.jpg)

## Live Version

**Live preview:** https://raw.githack.com/rice2k/Neo-Password-Generator-/main/index.html

**GitHub Pages URL:** https://rice2k.github.io/Neo-Password-Generator-/

The repository includes a GitHub Pages deployment workflow. If Pages is not enabled for the repository yet, GitHub requires it to be enabled in repository Settings before the Pages URL can publish.

## v2 Highlights

- Random password mode and new passphrase mode
- Cryptographic randomness with `crypto.getRandomValues()`
- Password lengths from 4 to 128 characters
- Password presets: Balanced, Strong, Maximum, Easy to type, PIN
- Passphrase presets: Standard, Strong, Compact
- 3–8 word passphrases
- Configurable passphrase separators
- Optional capitalization, number suffix, and symbol suffix
- Lowercase, uppercase, number, and symbol controls
- Ambiguous-character exclusion
- Custom excluded characters
- No-repeat password mode
- Start-with-a-letter mode
- Generate 1, 3, 5, 10, or 20 results
- Estimated entropy and strength rating
- Copy one result or Copy All
- Keyboard shortcuts
- Dark/light themes
- Responsive desktop/mobile interface
- No generated-secret history
- No third-party runtime dependencies

## Security Design

### Cryptographic randomness

The generator uses `window.crypto.getRandomValues()` rather than `Math.random()`.

Random integer conversion uses rejection sampling to avoid modulo bias. Password characters, password shuffling, passphrase words, number suffixes, and symbol suffixes all use this cryptographic random source.

### Local generation

Generated passwords and passphrases remain in the browser page. They are not uploaded or saved by the app. Only the selected visual theme may be stored locally.

### Password guarantees

For random passwords, the app inserts at least one character from every enabled character group before filling and cryptographically shuffling the result.

## Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| `Ctrl/Command + Enter` | Generate |
| `Ctrl/Command + Shift + C` | Copy the first result |

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Main v2 application |
| `style.css` | Neo interface and responsive design |
| `app.js` | Password/passphrase generation logic |
| `assets/neo-password-generator-v2.jpg` | Repository screenshot |
| `.github/workflows/pages.yml` | GitHub Pages deployment |
| `.nojekyll` | Static Pages support |
| `CHANGELOG.md` | Version history |
| `SECURITY.md` | Security notes |

## Run Locally

No build process is required. Download the repository and open `index.html` in a modern browser. Password and passphrase generation works locally without a server.

## Recommended Practices

Use unique passwords for every service, prefer long random secrets, store them in a reputable password manager, and enable MFA when available.

## Author

**Rice2k / Christopher Schumacher**
