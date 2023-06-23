console.log('content')

// Can't directly convert to json or it will become [object Object]
function elementToJSON(element) {
  const obj = {
    tagName: element.tagName,
    attributes: {},
    innerHTML: element.innerHTML
  };

  // Extract element attributes
  for (let i = 0; i < element.attributes.length; i++) {
    const attribute = element.attributes[i];
    obj.attributes[attribute.name] = attribute.value;
  }

  return JSON.stringify(obj);
}


// Set up getSelectedElement call to get selected element when
// context menu item clicked
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg === "getSelectedElement") {
    // Get the selected element
    const selectedElement = window.getSelection().anchorNode.parentElement;
    console.log('selectedElement', selectedElement);
    const jsonEl = elementToJSON(selectedElement);
    console.log(jsonEl)

    sendResponse({ selectedElement: elementToJSON(selectedElement) });
  }
});

// Set up getWindow call for using react devtools global hook
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg === 'getWindow') {
    addEventListener('fromPage', e => {
      sendResponse(JSON.parse(e.detail));
    }, { once: true });
    dispatchEvent(new Event('toPage'));
  }
});

var s = document.createElement('script');
s.src = chrome.runtime.getURL('js/inject.js');
s.onload = function () { this.remove(); };
(document.head || document.documentElement).appendChild(s);
