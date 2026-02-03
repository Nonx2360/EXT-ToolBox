# Tools Box - Browser Extension

A clean, ad-free browser extension toolbox featuring a QR code generator and more tools to come.

## Features

- ✅ **QR Code Generator** - Generate QR codes from any text or URL
- ✅ **No Ads** - Completely ad-free experience
- ✅ **Download & Copy** - Download QR codes as PNG or copy to clipboard
- ✅ **Modern UI** - Beautiful, clean interface

## Installation

### Chrome / Edge / Brave

1. Download or clone this repository
2. Open your browser and navigate to:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Brave: `brave://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **Load unpacked**
5. Select the `EXT-ToolBox` folder
6. The extension icon should appear in your toolbar

### Firefox

1. Download or clone this repository
2. Open Firefox and navigate to `about:debugging`
3. Click **This Firefox**
4. Click **Load Temporary Add-on**
5. Select the `manifest.json` file from the `EXT-ToolBox` folder

## Usage

1. Click the Tools Box icon in your browser toolbar
2. Enter any text or URL in the input field
3. Click **Generate QR Code**
4. Download or copy the generated QR code

## Project Structure

```
EXT-ToolBox/
├── manifest.json       # Extension configuration
├── popup.html         # Main UI
├── popup.css          # Styles
├── popup.js           # Logic and QR code generation
├── qrcode.min.js      # QR code library (ad-free)
├── icons/             # Extension icons
└── README.md          # This file
```

## Creating Icons

If you need to create icons, you can use any image editor to create:
- `icon16.png` - 16x16 pixels
- `icon48.png` - 48x48 pixels  
- `icon128.png` - 128x128 pixels

Or use an online tool like [Favicon Generator](https://favicon.io/) to generate icons from text or an image.

## Development

This extension uses:
- **Manifest V3** - Latest Chrome extension standard
- **qrcode-generator** - Lightweight, ad-free QR code library
- **Vanilla JavaScript** - No frameworks, fast and lightweight

## License

Free to use and modify.
