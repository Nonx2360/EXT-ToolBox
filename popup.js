// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Check if there's a saved active tab
    const savedTab = localStorage.getItem('activeTab');
    if (savedTab) {
        switchTab(savedTab);
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            switchTab(targetTab);
            // Save active tab
            localStorage.setItem('activeTab', targetTab);
        });
    });

    function switchTab(targetTab) {
        // Remove active class from all tabs and contents
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
            if(btn.getAttribute('data-tab') === targetTab) {
                btn.classList.add('active');
            }
        });
        tabContents.forEach(content => {
            content.classList.remove('active');
            if(content.id === `${targetTab}-tab`) {
                content.classList.add('active');
            }
        });
    }
    
    // QR Code Generator
    const qrInput = document.getElementById('qr-input');
    const generateBtn = document.getElementById('generate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const downloadBtn = document.getElementById('download-btn');
    const copyBtn = document.getElementById('copy-btn');
    const qrCanvas = document.getElementById('qr-canvas');
    const qrError = document.getElementById('qr-error');
    const qrActions = document.getElementById('qr-actions');
    
    let currentQRCodeData = null;
    
    // Generate QR Code
    if(generateBtn) {
        generateBtn.addEventListener('click', generateQRCode);
    }
    
    // Generate on Enter key (Ctrl+Enter or Cmd+Enter)
    if(qrInput) {
        qrInput.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                generateQRCode();
            }
        });
    }
    
    function generateQRCode() {
        const text = qrInput.value.trim();
        
        // Clear previous error
        qrError.classList.remove('show');
        qrError.textContent = '';
        qrActions.style.display = 'none';
        
        if (!text) {
            qrError.textContent = 'Please enter some text or URL';
            qrError.classList.add('show');
            return;
        }
        
        try {
            // Generate QR code using qrcode-generator library
            const typeNumber = 0; // Auto detect
            const errorCorrectionLevel = 'M';
            const qr = qrcode(typeNumber, errorCorrectionLevel);
            qr.addData(text);
            qr.make();
            
            // Set canvas size
            const cellSize = 8;
            const margin = 4;
            const size = qr.getModuleCount() * cellSize + margin * 2;
            qrCanvas.width = size;
            qrCanvas.height = size;
            
            // Clear and draw QR code
            const ctx = qrCanvas.getContext('2d');
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, size, size);
            
            ctx.fillStyle = '#000000';
            for (let row = 0; row < qr.getModuleCount(); row++) {
                for (let col = 0; col < qr.getModuleCount(); col++) {
                    if (qr.isDark(row, col)) {
                        ctx.fillRect(
                            col * cellSize + margin,
                            row * cellSize + margin,
                            cellSize,
                            cellSize
                        );
                    }
                }
            }
            
            // Show download and copy buttons
            qrActions.style.display = 'flex';
            currentQRCodeData = text;
        } catch (error) {
            qrError.textContent = 'Error generating QR code: ' + error.message;
            qrError.classList.add('show');
        }
    }
    
    // Clear function
    if(clearBtn) {
        clearBtn.addEventListener('click', () => {
            qrInput.value = '';
            const ctx = qrCanvas.getContext('2d');
            ctx.clearRect(0, 0, qrCanvas.width, qrCanvas.height);
            qrError.classList.remove('show');
            qrError.textContent = '';
            qrActions.style.display = 'none';
            currentQRCodeData = null;
        });
    }
    
    // Download QR Code
    if(downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            if (!currentQRCodeData) return;
            
            qrCanvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `qrcode-${Date.now()}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });
        });
    }
    
    // Copy QR Code to Clipboard
    if(copyBtn) {
        copyBtn.addEventListener('click', async () => {
            if (!currentQRCodeData) return;
            
            try {
                qrCanvas.toBlob(async (blob) => {
                    try {
                        await navigator.clipboard.write([
                            new ClipboardItem({ 'image/png': blob })
                        ]);
                        
                        // Show success feedback
                        showCopySuccess(copyBtn);
                    } catch (err) {
                        qrError.textContent = 'Failed to copy to clipboard. Please try downloading instead.';
                        qrError.classList.add('show');
                    }
                });
            } catch (error) {
                qrError.textContent = 'Copy not supported in this browser. Please download instead.';
                qrError.classList.add('show');
            }
        });
    }

    // --- Color Picker Functionality ---
    const pickColorBtn = document.getElementById('pick-color-btn');
    const colorPreview = document.getElementById('color-preview');
    const colorValuesObj = document.getElementById('color-values');
    const hexInput = document.getElementById('hex-value');
    const rgbInput = document.getElementById('rgb-value');
    const pickerError = document.getElementById('picker-error');
    const copyValueBtns = document.querySelectorAll('.copy-value-btn');

    if (pickColorBtn) {
        pickColorBtn.addEventListener('click', async () => {
            pickerError.textContent = '';
            pickerError.classList.remove('show');

            if (!window.EyeDropper) {
                pickerError.textContent = 'Your browser does not support the EyeDropper API.';
                pickerError.classList.add('show');
                return;
            }

            const eyeDropper = new EyeDropper();

            try {
                // Determine if we are in a popup
                // If in popup, the window might close when clicking outside.
                // However, EyeDropper API usually handles this by keeping the dropper active.
                // But generally interacting with the page closes the popup.
                // We might need to close the popup ourselves or rely on the browser behavior.
                // Actually, for extensions, opening EyeDropper usually works fine even from popup.
                
                const result = await eyeDropper.open();
                const hexColor = result.sRGBHex;
                
                updateColorUI(hexColor);
                
            } catch (e) {
                // User canceled or other error
                if(!e.message.includes('The user canceled the selection')) {
                    pickerError.textContent = 'Failed to pick color: ' + e.message;
                    pickerError.classList.add('show');
                }
            }
        });
    }

    function updateColorUI(hex) {
        colorPreview.style.backgroundColor = hex;
        hexInput.value = hex;
        rgbInput.value = hexToRgb(hex);
        colorValuesObj.style.display = 'block';
    }

    function hexToRgb(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : null;
    }

    // --- Screenshot (capture & crop) ---
    const screenshotCropBtn = document.getElementById('screenshot-crop-btn');
    const screenshotError = document.getElementById('screenshot-error');

    if (screenshotCropBtn) {
        screenshotCropBtn.addEventListener('click', async () => {
            screenshotError.textContent = '';
            screenshotError.classList.remove('show');

            try {
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                if (!tab || !tab.id) {
                    screenshotError.textContent = 'No active tab found.';
                    screenshotError.classList.add('show');
                    return;
                }
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['content-crop.js']
                });
                window.close();
            } catch (err) {
                screenshotError.textContent = 'Failed to start: ' + (err.message || err);
                screenshotError.classList.add('show');
            }
        });
    }

    // Copy Color Values
    copyValueBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const targetId = btn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            
            if(input && input.value) {
                try {
                    await navigator.clipboard.writeText(input.value);
                    showCopySuccess(btn);
                } catch (err) {
                    pickerError.textContent = 'Failed to copy text.';
                    pickerError.classList.add('show');
                }
            }
        });
    });

    function showCopySuccess(button) {
        const originalHTML = button.innerHTML;
        const width = button.offsetWidth; // Keep width consistent
        
        button.style.width = width + 'px';
        button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
            </svg>
        `;
        button.classList.add('success');
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.classList.remove('success');
            button.style.width = '';
        }, 1500);
    }
});
