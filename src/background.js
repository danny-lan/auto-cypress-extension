// TEMP call this function when user clicks on the extension body
document.body.addEventListener('click', async () => {
  console.log("extension click");

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTabId = tabs[0].id;

    chrome.scripting.executeScript({
      target: { tabId: activeTabId },
      files: ['js/content.js'],
    });

    // Get data from react devtools agent and do stuff with it
    chrome.tabs.sendMessage(activeTabId, 'getWindow', windowData => {
      console.log('windowData (JSON-ified reactDevtoolsAgent)', windowData);
    });
  });
})
