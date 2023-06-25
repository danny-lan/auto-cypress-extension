console.log('contextmenu');

chrome.runtime.onInstalled.addListener(function () {
  // Create a context menu item
  chrome.contextMenus.create({
    id: 'autoCypressAssertText',
    title: 'Assert element contains text',
    contexts: ['all'],
  });
  // Create a context menu item
  chrome.contextMenus.create({
    id: 'autoCypressAssertExists',
    title: 'Assert element exists',
    contexts: ['all'],
  });
});

function sendSelectedElement(tabId) {
  // Send a message to the content script to get the selected element
  // dispatchEvent(new CustomEvent('viewSelectedElement'));
  chrome.tabs.sendMessage(tabId, { action: 'viewSelectedElement' });
  //   function (response) {
  //     // if (response && response.selectedElement) {
  //     //   const selectedElement = JSON.parse(response.selectedElement);
  //     //   // Send data to background.js
  //     //   chrome.runtime.sendMessage({ action: 'sendSelectedElement', data: selectedElement });
  //     // }
  //   }
  // );
}

// Add an event listener to handle the click event
chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === 'autoCypressAssertText') {
    console.log('autoCypressAssertText clicked!');
    // sendSelectedElement(tab.id);
    chrome.tabs.sendMessage(tab.id, { action: 'contextMenuAssertText' });
  } else if (info.menuItemId === 'autoCypressAssertExists') {
    console.log('autoCypressAssertExists clicked!');
    // sendSelectedElement(tab.id);
    chrome.tabs.sendMessage(tab.id, { action: 'contextMenuAssertExist' });
  }
});
