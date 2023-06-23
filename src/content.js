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
window.addEventListener('contextmenu', function (event) {
  window.clickedElement = event.target;
});

// Set up getSelectedElement call to get selected element when
// context menu item clicked
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'getSelectedElement') {
    // Get the selected element
    console.log('selectedElement', window.clickedElement);
    const selectedElement = elementToJSON(window.clickedElement);

    sendResponse({ selectedElement: selectedElement });
    dispatchEvent(
      new CustomEvent('viewSelectedElement', {
        detail: selectedElement,
      })
    );
  }
});

addEventListener('myevent', e => {
  console.log('received event', e);
  const payload = {
    type: 'click',
    detail: e.detail,
  };
  chrome.runtime.sendMessage(`${JSON.stringify(payload)}`);
});

// Set up getWindow call for using react devtools global hook
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'getWindow') {
    addEventListener(
      'fromPage',
      e => {
        sendResponse(JSON.parse(e.detail));
      },
      { once: true }
    );
    dispatchEvent(new Event('toPage'));
  }
});

var s = document.createElement('script');
s.src = chrome.runtime.getURL('js/inject.js');
s.onload = function () {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);
