document.addEventListener('DOMContentLoaded', function () {
    const checkbox = document.getElementById('myCheckbox');

    // Charger l'état initial de la case à cocher depuis le stockage
    chrome.storage.local.get(['checkboxState'], function (result) {
        checkbox.checked = result.checkboxState || false;
    });

    // Mettre à jour le localStorage lorsque la case à cocher est cochée ou décochée
    checkbox.addEventListener('change', function () {
        chrome.storage.local.set({ checkboxState: checkbox.checked }, function () {
            console.log('Checkbox state is set to ' + checkbox.checked);
        });
    });

    document.getElementById('create-popup').addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            chrome.runtime.sendMessage({ action: 'createPopup', tabId: activeTab.id });
        });
    });
});
