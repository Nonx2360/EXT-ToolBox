chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type !== 'cropRect' || !sender.tab) {
        return;
    }
    const { rect, devicePixelRatio } = message;
    const tab = sender.tab;
    chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' })
        .then((dataUrl) => {
            return chrome.storage.local.set({
                screenshotCropData: dataUrl,
                screenshotCropRect: rect,
                screenshotCropDpr: devicePixelRatio || 1
            });
        })
        .then(() => {
            chrome.tabs.create({ url: chrome.runtime.getURL('screenshot-crop.html') });
        })
        .catch((err) => {
            console.error('Capture failed:', err);
        });
});
