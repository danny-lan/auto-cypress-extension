console.log('contextmenu')

chrome.runtime.onInstalled.addListener(function () {
  // Create a context menu item
  chrome.contextMenus.create({
    id: "autoCypressAssertText",
    title: "Assert element contains text",
    contexts: ["all"]
  });
  // Create a context menu item
  chrome.contextMenus.create({
    id: "autoCypressAssertExists",
    title: "Assert element exists",
    contexts: ["all"]
  });
});

function sendSelectedElement(tabId) {
  // Send a message to the content script to get the selected element
  chrome.tabs.sendMessage(tabId, "getSelectedElement", function (response) {
    if (response && response.selectedElement) {
      const selectedElement = JSON.parse(response.selectedElement);
      console.log('JSONified selectedElement', selectedElement);
      dispatchEvent(new CustomEvent('sendSelectedElement', {
        detail: selectedElement,
      }));
    }
  });
}


// Add an event listener to handle the click event
chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "autoCypressAssertText") {
    console.log("autoCypressAssertText clicked!");
    console.log(info);
    sendSelectedElement(tab.id);
  } else if (info.menuItemId === "autoCypressAssertExists") {
    console.log("autoCypressAssertExists clicked!");
    console.log(info);
    sendSelectedElement(tab.id);
  }
});

