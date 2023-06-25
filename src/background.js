console.log('background');

// TEMP call this function when user clicks on the extension body
document.body.addEventListener('click', async () => {
  console.log('extension click');

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTabId = tabs[0].id;
    console.log('ActiveTabId', activeTabId)
    // chrome.runtime.sendMessage('any message');

    // Start recording when clicking on box
    chrome.tabs.sendMessage(
      activeTabId,
      { action: 'startRecording' },
    );
  });
});

// chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
//   if (msg.action === "sendSelectedElement") {
//     console.log('sendSelectedElement', msg.data);
//   }
// });
