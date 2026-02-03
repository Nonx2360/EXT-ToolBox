# Quick Start Guide

## Step 1: Generate Icons

Before loading the extension, you need to create the icon files:

1. Open `create-icons.html` in your web browser
2. You'll see three canvas previews with download buttons
3. Click each download button to save:
   - `icon16.png` (16x16 pixels)
   - `icon48.png` (48x48 pixels)
   - `icon128.png` (128x128 pixels)
4. Save all three files in the `icons/` folder

## Step 2: Load Extension

### Chrome / Edge / Brave:
1. Go to `chrome://extensions/` (or `edge://extensions/` / `brave://extensions/`)
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select the `EXT-ToolBox` folder
5. Done! 🎉

### Firefox:
1. Go to `about:debugging`
2. Click **This Firefox**
3. Click **Load Temporary Add-on**
4. Select `manifest.json` from this folder

## Step 3: Use the Extension

1. Click the Tools Box icon in your browser toolbar
2. Type or paste any text/URL
3. Click **Generate QR Code**
4. Download or copy the QR code!

## Troubleshooting

- **Icons not showing?** Make sure you generated and saved all three icon files in the `icons/` folder
- **QR code not generating?** Check the browser console for errors (F12)
- **Extension not loading?** Make sure you're using Manifest V3 compatible browser (Chrome 88+, Edge 88+, Firefox 109+)
