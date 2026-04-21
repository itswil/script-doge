# 🐶 Script Doge - Chrome Extension

A lightweight, zero-dependency user script manager for Chrome (Manifest V3).

- TamperMonkey, ViolentMonkey alternative

## 1. Installation

1. Download/clone this repository
2. Open `chrome://extensions`
3. Enable **Developer Mode** (toggle in top right)
4. Click **Load unpacked**
5. Select this folder

## 2. Enable User Scripts

The `chrome.userScripts` API requires user scripts to be explicitly allowed:

1. Go to `chrome://extensions`
2. Find **Script Doge**
3. Click **Details**
4. Enable **Allow user scripts**

## 3. Usage

1. Click the extension icon to open the popup
2. Enter a website URL (e.g., `open.spotify.com`)
3. Paste your JavaScript
4. Click **Save**
5. Scripts auto-execute on matching pages

## Notes

- Scripts persist across browser sessions
- The URL field auto-fills with the current tab's hostname
- Scripts run in an isolated USER_SCRIPT world (page CSP does not apply)
- Deleting from the popup unregisters the script immediately

## Example

### Keyboard Shortcut for Spotify Web: Left/Right Arrow for Seek back/forward
`open.spotify.com`
```
document.addEventListener('keydown', (event) => {
  let button;

  if (event.key === 'ArrowRight') {
    button = document.querySelector('[data-testid="control-button-seek-forward-15"]');
  } else if (event.key === 'ArrowLeft') {
    button = document.querySelector('[data-testid="control-button-seek-back-15"]');
  }

  if (button) {
    event.preventDefault(); 
    button.click();
  }
});
```