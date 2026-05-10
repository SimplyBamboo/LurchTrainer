# Lurch App

Your best friend to learn how to keep momentum in Apex Legends.

## Description

The Lurch App helps players understand and practice the lurch window mechanic in Apex Legends. It provides audio cues when you perform your selected input (scroll wheel or spacebar), helping you time your movements correctly.

## Features

- **Custom Input Selection**: Choose between scroll wheel up, scroll wheel down, or spacebar as your lurch input
- **Audio Feedback**: Hear distinct sounds for lurch start and end windows
- **Adjustable Volume**: Control the audio volume to your preference
- **Lightweight**: Small footprint with minimal system impact

## How to Use

1. Select your preferred jump input from the dropdown menu
2. Click "Start" to begin listening for your input
3. Perform your selected input in-game
4. Listen for the audio cues to understand the lurch timing window

## Building from Source

### Prerequisites

- Node.js 18 or higher
- npm

### Installation

```bash
# Install dependencies
npm install

# Run the app in development mode
npm start

# Build Windows executable
npm run dist
```

## GitHub Actions Build

This repository includes a GitHub Actions workflow that automatically builds the Windows executable on push or pull request to main/master branches. The built `.exe` file will be available as an artifact for 30 days.

## Credits

Created by @guiopapai

Learn more about movement at [/r/Apexrollouts](https://www.reddit.com/r/Apexrollouts/)
