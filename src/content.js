console.log('content')

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