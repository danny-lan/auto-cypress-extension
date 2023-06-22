console.log('inject');

addEventListener('toPage', () => {
  // Put logic to make use of __REACT_DEVTOOLS_GLOBAL_HOOK__ here,
  // returned value must be JSON serializable.
  dispatchEvent(new CustomEvent('fromPage', {
    detail: JSON.stringify(window.__REACT_DEVTOOLS_GLOBAL_HOOK__.reactDevtoolsAgent),
  }));
});
