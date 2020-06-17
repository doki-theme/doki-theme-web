chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.color) {
        document.body.style.backgroundColor = msg.color;
        sendResponse(`Change color to ${msg.color}`);
    } else {
        sendResponse('Color message is none.');
    }
});

