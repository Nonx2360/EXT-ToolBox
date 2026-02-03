(function () {
    const overlay = document.createElement('div');
    overlay.id = 'toolsbox-crop-overlay';
    overlay.style.cssText = [
        'position:fixed',
        'top:0',
        'left:0',
        'right:0',
        'bottom:0',
        'z-index:2147483647',
        'cursor:crosshair',
        'background:rgba(0,0,0,0.35)',
        'user-select:none',
        'pointer-events:auto'
    ].join(';');

    const selection = document.createElement('div');
    selection.style.cssText = [
        'position:fixed',
        'border:2px dashed rgba(102,126,234,0.9)',
        'background:transparent',
        'box-shadow:0 0 0 9999px rgba(0,0,0,0.35)',
        'pointer-events:none',
        'display:none',
        'box-sizing:border-box'
    ].join(';');

    let startX, startY;
    let active = false;

    function setRect(left, top, w, h) {
        selection.style.left = left + 'px';
        selection.style.top = top + 'px';
        selection.style.width = Math.max(0, w) + 'px';
        selection.style.height = Math.max(0, h) + 'px';
        selection.style.display = 'block';
    }

    function removeOverlay() {
        overlay.remove();
        selection.remove();
        document.body.style.cursor = '';
    }

    overlay.addEventListener('mousedown', function (e) {
        if (e.button !== 0) return;
        active = true;
        startX = e.clientX;
        startY = e.clientY;
        setRect(startX, startY, 0, 0);
    });

    window.addEventListener('mousemove', function (e) {
        if (!active || startX == null) return;
        const left = Math.min(startX, e.clientX);
        const top = Math.min(startY, e.clientY);
        const w = Math.abs(e.clientX - startX);
        const h = Math.abs(e.clientY - startY);
        setRect(left, top, w, h);
    });

    window.addEventListener('mouseup', function (e) {
        if (e.button !== 0 || !active) return;
        active = false;
        const left = Math.min(startX, e.clientX);
        const top = Math.min(startY, e.clientY);
        const w = Math.abs(e.clientX - startX);
        const h = Math.abs(e.clientY - startY);
        removeOverlay();
        if (w < 5 || h < 5) {
            chrome.runtime.sendMessage({ type: 'cropCancel' });
            return;
        }
        chrome.runtime.sendMessage({
            type: 'cropRect',
            rect: { x: left, y: top, width: w, height: h },
            devicePixelRatio: window.devicePixelRatio || 1
        });
    });

    window.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            removeOverlay();
            chrome.runtime.sendMessage({ type: 'cropCancel' });
        }
    });

    document.body.appendChild(overlay);
    document.body.appendChild(selection);
})();
