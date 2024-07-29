// Fonction pour créer la popup
function createPopup() {
  if (document.getElementById('pseudo-popup')) return;

  const popup = document.createElement('div');
  popup.id = 'pseudo-popup';
  popup.style.position = 'absolute';
  popup.style.top = '50px';
  popup.style.left = '50px';
  popup.style.width = '300px';
  popup.style.border = '1px solid black';
  popup.style.backgroundColor = 'white';
  popup.style.zIndex = '9999';

  const header = document.createElement('div');
  header.style.cursor = 'move';
  header.style.backgroundColor = '#f1f1f1';
  header.style.padding = '10px';
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';

  const title = document.createElement('div');
  title.innerText = document.title;
  header.appendChild(title);

  const closeButton = document.createElement('button');
  closeButton.innerText = 'Close';
  closeButton.onclick = () => {
    document.body.removeChild(popup);
    chrome.storage.local.set({ popupOpen: false });
  };
  header.appendChild(closeButton);

  popup.appendChild(header);
  document.body.appendChild(popup);

  chrome.storage.local.set({ popupOpen: true });

  // Make the popup draggable
  dragElement(popup);

  function dragElement(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    header.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      element.style.top = (element.offsetTop - pos2) + "px";
      element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
}

// Function to check if the popup should be created
function checkPopupStatus() {
  chrome.storage.local.get(['popupOpen', 'checkboxState'], function (result) {
    if (result.checkboxState && result.popupOpen) {
      createPopup();
    }
  });
}

// Run the popup check on page load
checkPopupStatus();

// Listen for messages from the background script to create the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'createPopup') {
    chrome.storage.local.get(['checkboxState'], function (result) {
      if (result.checkboxState) {
        createPopup();
      }
    });
  } else if (message.action === 'checkAndCreatePopup') {
    checkPopupStatus();
  }
});
