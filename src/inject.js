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
  if (!foundId && element.parentElement) {
    return getElementToFiberId(element.parentElement, n - 1);
  }

  return foundId;
};

const getComponentFromFiberId = async fiberId => {
  const owners =
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.reactDevtoolsAgent._rendererInterfaces[1].getOwnersList(
      fiberId
    ) || [];

  console.log({ fiberId, owners });
  const blacklistedDisplayNames = ['anonymous', 'styled', 'fragment'];

  const firstNonAnonComponent = owners
    .reverse()
    .find(
      owner =>
        !blacklistedDisplayNames.some(dn =>
          owner.displayName.toLowerCase().includes(dn.toLowerCase())
        ) && owner.displayName.length > 2
    );

  window.__REACT_DEVTOOLS_GLOBAL_HOOK__.reactDevtoolsAgent._rendererInterfaces[1].prepareViewElementSource(
    firstNonAnonComponent.id || fiberId
  );

  // Sleep 100ms to wait for window.$type to be populated by react-dev-tools after calling `prepareViewElementSource()`
  await new Promise(res => setTimeout(res, 100));

  return window.$type;
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

const safeDispatchEvent = (eventName, payload) => {
  // Don't record events if we're not recording
  const isRecording = JSON.parse(localStorage.getItem('isRecording'));
  if (!isRecording) return;

  const safeStringify = obj => {
    return JSON.stringify(obj, function (key, value) {
      // we might not need "nodes" either?
      if (
        key.startsWith('__reactInternalInstance') ||
        key === '_context' ||
        key == '_owner' ||
        key === '_store' ||
        key === 'ref' ||
        key === '_self' ||
        key === '_source'
      )
        return undefined;
      else {
        return value;
      }
    });
  };

  console.log('dispatching event', eventName, payload);
  dispatchEvent(
    new CustomEvent(eventName, {
      detail: safeStringify(payload),
    })
  );
};

(async () => {
  const scriptContents = await getAllScriptsContents();

  addEventListener('contextmenu', function (event) {
    window.clickedElement = event.target;
  });

  addEventListener('keydown', e => {
    let text;
    switch (e.key) {
      case 'Shift':
        return;
      case 'Enter':
        text = '{enter}';
        break;
      case 'Escape':
        text = '{esc}';
        break;
      default:
        // Ignore other special keys, like the shift key for now
        if (e.key.length > 1) return;
        text = e.key;
    }

    safeDispatchEvent('userKeyPress', {
      text,
    });
  });

  addEventListener('click', async e => {
    const fiberId = getElementToFiberId(e.target);
    const sourceComponent = await getComponentFromFiberId(fiberId);
    const sourceFile = getPathToSourceFile(sourceComponent, scriptContents);
    const details = getDetailsFromFiberId(fiberId);
    console.log('sourceFile', sourceFile);
    console.log('details', details.props, details);

    const normalizeProps = Array.isArray(details.props)
      ? details.props[0]?.props || details.props[0]
      : details.props;

    safeDispatchEvent('userClick', {
      sourceFile,
      details: {
        props: normalizeProps,
      },
      tagName: e.target.tagName,
    });
  });

  addEventListener('startRecording', e => {
    console.log('received startRecording');
    localStorage.setItem('isRecording', true);
    safeDispatchEvent('startRecordingResponse', {
      url: location.href,
    });
    location.reload();
  });

  addEventListener('stopRecording', e => {
    localStorage.setItem('isRecording', false);
  });

  addEventListener('contextMenuAssertText', async e => {
    const fiberId = getElementToFiberId(window.clickedElement);
    const sourceComponent = await getComponentFromFiberId(fiberId);

    const sourceFile = getPathToSourceFile(sourceComponent, scriptContents);
    const details = getDetailsFromFiberId(fiberId);

    safeDispatchEvent('userAssertText', {
      sourceFile,
      details,
      tagName: e.target.tagName,
      assertType: 'contains',
      assertContainsText: window.clickedElement.innerText,
    });
  });

  addEventListener('contextMenuAssertExist', async e => {
    const fiberId = getElementToFiberId(window.clickedElement);
    const sourceComponent = await getComponentFromFiberId(fiberId);

    const sourceFile = getPathToSourceFile(sourceComponent, scriptContents);
    const details = getDetailsFromFiberId(fiberId);

    console.log({
      sourceComponent,
      sourceFile,
      details,
      windowElement: window.clickedElement,
    });

    safeDispatchEvent('userAssertExist', {
      sourceFile,
      details,
      assertType: 'exists',
    });
  });
})();
