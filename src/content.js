console.log('content');

// Get nested text content for asserting an element contains text
function getNestedTextContent(element) {
  let textContent = '';

  for (let i = 0; i < element.childNodes.length; i++) {
    const node = element.childNodes[i];

    if (node.nodeType === Node.TEXT_NODE) {
      textContent += node.textContent;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      textContent += getNestedTextContent(node);
    }
  }

  return textContent;
}

// Can't directly convert to json or it will become [object Object]
function elementToJSON(element) {
  const obj = {
    tagName: element.tagName,
    attributes: {},
    innerHTML: element.innerHTML,
    textContent: getNestedTextContent(element),
  };

  // Extract element attributes
  for (let i = 0; i < element.attributes.length; i++) {
    const attribute = element.attributes[i];
    obj.attributes[attribute.name] = attribute.value;
  }

  return JSON.stringify(obj);
}

// Save the clicked element to pass to extension
// window.addEventListener('contextmenu', function (event) {
//   window.clickedElement = event.target;
// });

// Set up getSelectedElement call to get selected element when
// context menu item clicked
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  // if (msg.action === 'getSelectedElement') {
  //   // Get the selected element
  //   console.log('selectedElement', window.clickedElement);
  //   const selectedElement = elementToJSON(window.clickedElement);

  //   // sendResponse({ selectedElement: selectedElement });
  //   dispatchEvent(
  //     new CustomEvent('viewSelectedElement', {
  //       detail: selectedElement,
  //     })
  //   );
  // }

  console.log('msg.action', msg.action);
  console.log('sender', sender)
  // Forward to inject.js
  if (msg.action === 'startRecording') {
    dispatchEvent(new CustomEvent('startRecording'));
  }
  if (msg.action === 'stopRecording') {
    dispatchEvent(new CustomEvent('stopRecording'));
  }
  if (msg.action === 'contextMenuAssertText') {
    dispatchEvent(new CustomEvent('contextMenuAssertText'));
  }
  if (msg.action === 'contextMenuAssertExist') {
    dispatchEvent(new CustomEvent('contextMenuAssertExist'));
  }
});

addEventListener('startRecordingResponse', e => {
  console.log('running startRecordingResponse', e);
  chrome.runtime.sendMessage({
    message: 'startRecordingResponse',
    stringifiedPayload: e.detail,
  });
});

addEventListener('userClick', e => {
  chrome.runtime.sendMessage({
    message: 'userClick',
    stringifiedPayload: e.detail,
  });
});

addEventListener('userAssert', e => {
  chrome.runtime.sendMessage({
    message: 'userAssert',
    stringifiedPayload: e.detail,
  });
});

addEventListener('userKeyPress', e => {
  chrome.runtime.sendMessage({
    message: 'userKeyPress',
    stringifiedPayload: e.detail,
  });
});

// Set up getWindow call for using react devtools global hook
// chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
//   if (msg.action === 'getWindow') {
//     addEventListener(
//       'fromPage',
//       e => {
//         sendResponse(JSON.parse(e.detail));
//       },
//       { once: true }
//     );
//     dispatchEvent(new Event('toPage'));
//   }
// });

var s = document.createElement('script');
s.src = chrome.runtime.getURL('js/inject.js');
s.onload = function () {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);
