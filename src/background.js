console.log('background')

// TEMP call this function when user clicks on the extension body
document.body.addEventListener('click', async () => {
  console.log("extension click");

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTabId = tabs[0].id;

    // Get data from react devtools agent and do stuff with it
    chrome.tabs.sendMessage(activeTabId, { action: 'getWindow' }, windowData => {
      console.log('windowData (JSON-ified reactDevtoolsAgent)', windowData);
    });
  });
})

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "sendSelectedElement") {
    console.log('sendSelectedElement', msg.data);
  }
});