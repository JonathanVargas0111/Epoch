<div align="center">

# Epoch

**Multi-timezone world clock and calendar for macOS**

A lightweight menu bar app to manage multiple time zones and stay organized with an integrated calendar.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/github/v/release/JonathanVargas0111/Epoch)](https://github.com/JonathanVargas0111/Epoch/releases)
[![Platform](https://img.shields.io/badge/platform-macOS-lightgrey)](https://github.com/JonathanVargas0111/Epoch)

[Download](https://github.com/JonathanVargas0111/Epoch/releases/latest) • [Report Bug](https://github.com/JonathanVargas0111/Epoch/issues) • [Request Feature](https://github.com/JonathanVargas0111/Epoch/issues)

</div>

---

## Features

### Clock Management
- **Multiple time zones** - Add as many clocks as you need
- **Drag & drop reordering** - Organize your clocks easily
- **Time difference indicator** - See offset from your local time (+5h, -3h, etc.)
- **Quick copy** - Click any clock to copy the time to clipboard

### Calendar
- **Integrated calendar** - Month view with easy navigation
- **System integration** - Click any date to open Calendar.app
- **Current day highlight** - Always know what day it is

### Customization
- **Layout options** - Choose between horizontal or vertical layouts
- **Font sizes** - Small, Medium, or Large
- **Menu bar icon** - Display time, numeric date, or month+day
- **Themes** - Dark and Light themes

### Productivity
- **Keyboard shortcut** - Toggle window with `Cmd+Shift+C`
- **Persistent storage** - Your clocks are saved automatically
- **Duplicate prevention** - Can't add the same timezone twice

---

## Installation

### Download

Download the latest version from the [Releases page](https://github.com/JonathanVargas0111/Epoch/releases/latest):

- **[Epoch.dmg](https://github.com/JonathanVargas0111/Epoch/releases/latest)** - DMG installer (recommended)
- **[Epoch.zip](https://github.com/JonathanVargas0111/Epoch/releases/latest)** - ZIP archive

> **Note:** Currently supports Apple Silicon (M1/M2/M3) Macs only.

### Install

1. Download the DMG or ZIP file
2. Open the DMG and drag **Epoch** to your Applications folder (or extract the ZIP)
3. **Important:** Since Epoch is not code-signed, macOS will block it on first launch

### First Launch (macOS Gatekeeper)

When you first try to open Epoch, macOS will show a warning saying the app is "damaged" or "from an unidentified developer." This is normal for unsigned apps. Follow these steps:

**Option 1 - Recommended (Right-click method):**
1. Open Finder and go to Applications
2. Find **Epoch**
3. **Right-click** (or Control-click) on Epoch
4. Select **Open** from the menu
5. Click **Open** in the dialog that appears
6. The app will now launch and appear in your menu bar

**Option 2 - System Settings:**
1. Try to open Epoch normally (it will be blocked)
2. Go to **System Settings** > **Privacy & Security**
3. Scroll down to find the message about Epoch being blocked
4. Click **Open Anyway**
5. Confirm by clicking **Open**

**Option 3 - Terminal (Advanced):**
```bash
xattr -cr /Applications/Epoch.app
```

> **Why is this needed?** Epoch is currently unsigned (code signing requires a $99/year Apple Developer account). The app is completely safe and open source - you can review all the code in this repository.

---

## Usage

### Adding Clocks

1. Click **+ Add Clock**
2. Select a timezone from the dropdown
3. (Optional) Add a custom label
4. Click **Add**

### Customization

Click the ⚙️ settings button to access:
- **Layout** - Horizontal or Vertical
- **Menu Bar Icon** - Time, Date, or Month+Day format
- **Font Size** - Small, Medium, or Large
- **Theme** - Dark or Light

### Keyboard Shortcuts

- `Cmd+Shift+C` - Toggle Clock & Calendar window

---

## Development

### Prerequisites

- Node.js 16+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/JonathanVargas0111/Epoch.git
cd Epoch

# Install dependencies
npm install

# Run in development mode
npm start
```

### Build

```bash
# Build for macOS
npm run build

# Output will be in the dist/ folder
```

---

## Built With

- [Electron](https://www.electronjs.org/) - Desktop app framework
- [electron-builder](https://www.electron.build/) - Build and packaging

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

Built with [Claude Code](https://claude.com/claude-code)

---

<div align="center">

**Made by [Nandark](https://nandark.com)**

[Report an issue](https://github.com/JonathanVargas0111/Epoch/issues) • [Suggest a feature](https://github.com/JonathanVargas0111/Epoch/issues/new)

</div>
