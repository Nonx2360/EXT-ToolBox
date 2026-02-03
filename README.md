# EXT-ToolBox (Tools Box)

A clean, ad-free browser extension toolbox with QR code generator, color picker, and screenshot crop.

## Features

- **QR Code Generator** – Generate QR codes from any text or URL (download or copy)
- **Color Picker** – Pick colors from any web page (EyeDropper API)
- **Screenshot & crop** – Crosshair selection on the page, crop area, copy image to clipboard
- **No ads** – Completely ad-free

## Installation

### Chrome / Edge / Brave

1. Clone or download this repo
2. Open `chrome://extensions/` (or `edge://extensions/`, `brave://extensions/`)
3. Turn on **Developer mode**
4. Click **Load unpacked** and select the `EXT-ToolBox` folder

### Firefox

1. Open `about:debugging` → **This Firefox** → **Load Temporary Add-on**
2. Select `manifest.json` in the `EXT-ToolBox` folder

## Usage

- **QR Code**: Enter text/URL → Generate → Download or Copy
- **Color Picker**: Pick color from web → copy Hex or RGB
- **Screenshot**: Click “Capture & crop area” → cursor becomes + → drag to select → cropped image is copied

## Project structure

- `manifest.json` – Extension config
- `popup.html` / `popup.css` / `popup.js` – Popup UI and logic
- `content-crop.js` – In-page crop overlay (crosshair)
- `background.js` – Capture + open crop page
- `screenshot-crop.html/js/css` – Crop result and copy
- `qrcode.min.js` – QR library
- `icons/` – Extension icons

## License

MIT (see LICENSE).
