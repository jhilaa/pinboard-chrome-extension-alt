let isRunning = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'createPopup') {
        chrome.scripting.executeScript({
            target: { tabId: message.tabId },
            files: ['content.js']
        }).then(() => {
            chrome.tabs.sendMessage(message.tabId, { action: 'createPopup' });
        }).catch((error) => {
            console.error('Error injecting script:', error);
            sendResponse({ result: 'Error', error });
        });
        return true;  // Indicate that the response will be sent asynchronously
    }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
    if (!isRunning) {
        isRunning = true;
        const tabId = activeInfo.tabId;
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
        }).then(() => {
            chrome.tabs.sendMessage(tabId, { action: 'createPopup' });
        }).catch((error) => {
            console.error('Error injecting script:', error);
        });
        isRunning = false;
    }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
    if (!isRunning && changeInfo.status === 'complete') {
        isRunning = true;
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
        }).then(() => {
            chrome.tabs.sendMessage(tabId, { action: 'createPopup' });
        }).catch((error) => {
            console.error('Error injecting script:', error);
        });
        isRunning = false;
    }
});
