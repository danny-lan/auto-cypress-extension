console.log('inject');


addEventListener('toPage', () => {
  console.log('reactDevtoolsAgent', window.__REACT_DEVTOOLS_GLOBAL_HOOK__.reactDevtoolsAgent)

  // Put logic to make use of __REACT_DEVTOOLS_GLOBAL_HOOK__ here,
  // returned value must be JSON serializable.
  dispatchEvent(new CustomEvent('fromPage', {
    detail: JSON.stringify(window.__REACT_DEVTOOLS_GLOBAL_HOOK__.reactDevtoolsAgent),
  }));
});
