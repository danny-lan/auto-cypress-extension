console.log('inject');

const getElementToFiberId = (element, n = 10) => {
  if (n < 0) return null;

  // Mock out console.warn because react-devtools will polute the console if it can't find a fiber ID
  const consoleLog = console.warn;
  console.warn = f => f;

  let c = 1;
  let nativeNode;
  let foundId;
  do {
    [nativeNode] =
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__.reactDevtoolsAgent._rendererInterfaces[1].findNativeNodesForFiberID(
        c
      ) || [];
    if (nativeNode === element) {
      foundId = c;
    }
  } while (c++ < 2000 && !foundId);

  // Unmock console.warn
  console.warn = consoleLog.bind(console);

  // It's possble the element clicked is not tracked for some reason, so let's check the parent
  if (!foundId) {
    return getElementToFiberId(element.parentElement, n - 1);
  }

  return foundId;
};

const getDetailsFromFiberId = fiberId => {
  const oldGroupCollapsed = console.groupCollapsed;
  const oldLog = console.log;
  const result = {};

  console.groupCollapsed = null;
  console.log = (label, value) => {
    if (label === 'Props:') {
      result.props = value;
    } else if (label === 'Hooks:') {
      result.hooks = value;
    } else if (label === 'Nodes:') {
      result.nodes = value;
    }
  };

  window.__REACT_DEVTOOLS_GLOBAL_HOOK__.reactDevtoolsAgent._rendererInterfaces[1].logElementToConsole(
    fiberId
  );

  console.log = oldLog.bind(console);
  console.groupCollapsed = oldGroupCollapsed.bind(console);
  return result;
};

const getAllScriptsContents = async () => {
  const scripts = document.getElementsByTagName('script');
  const validScripts = [...scripts]
    .filter(s => Boolean(s.src))
    .filter(s => !s.src.includes('monaco'));

  const scriptContents = await Promise.all(
    validScripts.map(script => {
      return fetch(script.src).then(r => r.text());
    })
  );

  return scriptContents.join('\n');
};

// Converts "  !*** ./apps/src/solution-builder/components/ProjectBuilderContainer/index.tsx ***!"
// into "./apps/src/solution-builder/components/ProjectBuilderContainer/index.tsx".
// thanks chatgpt
const extractFilePath = inputString => {
  const regex = /!+\s*\*+\s*(.*?)\s*\*+\s*!/; // Regular expression to match the file path
  const match = inputString.match(regex);
  if (match && match[1]) {
    return match[1];
  }
  return null; // Return null if no match is found
};

const getPathToSourceFile = (componentToFind, scriptContents) => {
  const stringToFind = componentToFind
    .toString()
    .replace('\n', '\\n')
    .substr(0, 50);

  const index = scriptContents.indexOf(stringToFind);
  const lineNumber = scriptContents.substring(0, index).split('\n').length;

  // Sometimes, the filepath is on a different line for unknown reasons, so we
  // do this weird for loop until we find it
  let sourceFile;
  for (let i = 4; i < 7; i++) {
    sourceFile = extractFilePath(scriptContents.split('\n')[lineNumber - i]);
    if (sourceFile) break;
  }

  return sourceFile;
};

const fn = async () => {
  const scriptContents = await getAllScriptsContents();

  addEventListener('keydown', e => {
    console.log('keydown', e);
  });

  addEventListener('click', e => {
    const fiberId = getElementToFiberId(e.target);

    const owners =
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__.reactDevtoolsAgent._rendererInterfaces[1].getOwnersList(
        fiberId
      ) || [];

    console.log({ e, fiberId, owners });
    const blacklistedDisplayNames = ['anonymous', 'styled', 'fragment'];

    const firstNonAnonComponent = owners
      .reverse()
      .find(
        owner =>
          !blacklistedDisplayNames.some(dn =>
            owner.displayName.toLowerCase().includes(dn.toLowerCase())
          ) && owner.displayName.length > 2
      );

    console.log({ firstNonAnonComponent });

    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.reactDevtoolsAgent._rendererInterfaces[1].prepareViewElementSource(
      firstNonAnonComponent.id || fiberId
    );

    // Set timeout to wait for react-devtools backend to populate `window.$type`
    setTimeout(() => {
      const sourceFile = getPathToSourceFile(window.$type, scriptContents);
      const details = getDetailsFromFiberId(fiberId);
      console.log('sourceFile', sourceFile);
      console.log('details', details.props, details);

      console.log('dispatching event');
      dispatchEvent(
        new CustomEvent('myevent', {
          detail: JSON.stringify({
            sourceFile,
            details,
          }),
        })
      );
    }, 100);
  });
};

fn();

addEventListener('toPage', () => {
  console.log(
    'reactDevtoolsAgent',
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.reactDevtoolsAgent
  );

  // Put logic to make use of __REACT_DEVTOOLS_GLOBAL_HOOK__ here,
  // returned value must be JSON serializable.
  dispatchEvent(
    new CustomEvent('fromPage', {
      detail: JSON.stringify(
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__.reactDevtoolsAgent
      ),
    })
  );
});

addEventListener('viewSelectedElement', e => {
  console.log('viewSelectedElement', e.detail);
});
