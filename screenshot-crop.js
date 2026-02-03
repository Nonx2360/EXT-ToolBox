(function () {
    const img = document.getElementById('screenshot-img');
    const container = document.getElementById('crop-container');
    const overlay = document.getElementById('crop-overlay');
    const selection = document.getElementById('crop-selection');
    const copyBtn = document.getElementById('copy-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const statusEl = document.getElementById('status');

    let startX, startY, currentX, currentY;
    let isDrawing = false;
    let imageNaturalWidth, imageNaturalHeight;
    let containerRect;

    function showStatus(msg, isError) {
        statusEl.textContent = msg;
        statusEl.classList.toggle('error', !!isError);
    }

    function clearStatus() {
        statusEl.textContent = '';
        statusEl.classList.remove('error');
    }

    function overlayCoords(e) {
        const r = overlay.getBoundingClientRect();
        return {
            x: Math.max(0, Math.min(r.width, e.clientX - r.left)),
            y: Math.max(0, Math.min(r.height, e.clientY - r.top))
        };
    }

    function updateSelectionBox() {
        if (startX === undefined || currentX === undefined) return;
        const left = Math.min(startX, currentX);
        const top = Math.min(startY, currentY);
        const width = Math.abs(currentX - startX);
        const height = Math.abs(currentY - startY);
        selection.style.left = left + 'px';
        selection.style.top = top + 'px';
        selection.style.width = width + 'px';
        selection.style.height = height + 'px';
        selection.classList.add('visible');
        copyBtn.disabled = false;
    }

    function getCropRectInImageCoords() {
        const left = parseFloat(selection.style.left) || 0;
        const top = parseFloat(selection.style.top) || 0;
        const width = parseFloat(selection.style.width) || 0;
        const height = parseFloat(selection.style.height) || 0;
        const scaleX = imageNaturalWidth / overlay.offsetWidth;
        const scaleY = imageNaturalHeight / overlay.offsetHeight;
        return {
            x: Math.max(0, Math.round(left * scaleX)),
            y: Math.max(0, Math.round(top * scaleY)),
            width: Math.min(imageNaturalWidth, Math.round(width * scaleX)),
            height: Math.min(imageNaturalHeight, Math.round(height * scaleY))
        };
    }

    overlay.addEventListener('mousedown', function (e) {
        const p = overlayCoords(e);
        startX = currentX = p.x;
        startY = currentY = p.y;
        isDrawing = true;
        overlay.classList.add('active');
        updateSelectionBox();
    });

    window.addEventListener('mousemove', function (e) {
        if (!isDrawing) return;
        const p = overlayCoords(e);
        currentX = p.x;
        currentY = p.y;
        updateSelectionBox();
    });

    window.addEventListener('mouseup', function () {
        if (isDrawing) {
            isDrawing = false;
            overlay.classList.remove('active');
        }
    });

    copyBtn.addEventListener('click', async function () {
        let crop = getCropRectInImageCoords();
        const hasSelection = selection.classList.contains('visible') &&
            crop.width >= 1 && crop.height >= 1;
        if (!hasSelection) {
            crop = { x: 0, y: 0, width: imageNaturalWidth, height: imageNaturalHeight };
        }
        try {
            const canvas = document.createElement('canvas');
            canvas.width = crop.width;
            canvas.height = crop.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
            canvas.toBlob(async function (blob) {
                try {
                    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
                    showStatus(hasSelection ? 'Cropped image copied to clipboard.' : 'Full image copied to clipboard.');
                    setTimeout(clearStatus, 2000);
                } catch (err) {
                    showStatus('Failed to copy: ' + (err.message || err), true);
                }
            }, 'image/png');
        } catch (err) {
            showStatus('Failed to copy: ' + (err.message || err), true);
        }
    });

    cancelBtn.addEventListener('click', function () {
        window.close();
        if (!window.closed) chrome.tabs.getCurrent(function (tab) { if (tab) chrome.tabs.remove(tab.id); });
    });

    let pendingRect = null;
    let pendingDpr = 1;

    function copyCropToClipboard(crop, onDone) {
        const canvas = document.createElement('canvas');
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
        canvas.toBlob(async function (blob) {
            try {
                await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
                if (onDone) onDone(true);
            } catch (err) {
                if (onDone) onDone(false, err);
            }
        }, 'image/png');
    }

    chrome.storage.local.get(['screenshotCropData', 'screenshotCropRect', 'screenshotCropDpr'], function (data) {
        const dataUrl = data.screenshotCropData;
        if (!dataUrl) {
            document.body.innerHTML = '<div class="status error">No screenshot data. Capture from the extension popup first.</div>';
            return;
        }
        if (data.screenshotCropRect) {
            pendingRect = data.screenshotCropRect;
            pendingDpr = data.screenshotCropDpr || 1;
            chrome.storage.local.remove(['screenshotCropRect', 'screenshotCropDpr']);
        }
        img.src = dataUrl;
    });

    function applyPendingRect() {
        if (!pendingRect || !imageNaturalWidth) return;
        const dpr = pendingDpr;
        const r = pendingRect;
        const scaleX = overlay.offsetWidth / imageNaturalWidth;
        const scaleY = overlay.offsetHeight / imageNaturalHeight;
        const cx = Math.max(0, Math.min(imageNaturalWidth, Math.round(r.x * dpr)));
        const cy = Math.max(0, Math.min(imageNaturalHeight, Math.round(r.y * dpr)));
        const cw = Math.max(1, Math.min(imageNaturalWidth - cx, Math.round(r.width * dpr)));
        const ch = Math.max(1, Math.min(imageNaturalHeight - cy, Math.round(r.height * dpr)));
        selection.style.left = (r.x * dpr * scaleX) + 'px';
        selection.style.top = (r.y * dpr * scaleY) + 'px';
        selection.style.width = (r.width * dpr * scaleX) + 'px';
        selection.style.height = (r.height * dpr * scaleY) + 'px';
        selection.classList.add('visible');
        copyCropToClipboard({ x: cx, y: cy, width: cw, height: ch }, function (ok, err) {
            if (ok) {
                showStatus('Cropped image copied to clipboard.');
                setTimeout(clearStatus, 3000);
            } else {
                showStatus('Failed to copy: ' + (err && err.message), true);
            }
        });
        pendingRect = null;
    }

    img.addEventListener('load', function () {
        imageNaturalWidth = img.naturalWidth;
        imageNaturalHeight = img.naturalHeight;
        if (pendingRect) {
            applyPendingRect();
        }
        chrome.storage.local.remove('screenshotCropData');
    });
})();
