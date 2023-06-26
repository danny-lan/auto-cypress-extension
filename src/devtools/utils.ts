import crypto from 'crypto-js';
import get from 'lodash/get';
import writeTestPrompt from './prompts/cypressTest';
import interceptPrompt from './prompts/intercept';
import {
  TAction,
  TAssertExistsAction,
  TAssertTextAction,
  TClickAction,
  TItem,
  TKeyboardAction,
  TNetworkRequest,
  TVisitAction,
} from './types';

export function getTerminalFieldPaths(obj: any, prefix = ''): string[] {
  let paths: string[] = [];

  for (let key in obj) {
    let newPath = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object') {
      paths = paths.concat(getTerminalFieldPaths(obj[key], newPath));
    } else {
      paths.push(newPath);
    }
  }

  return paths;
}

export function getTerminalFieldsAndValues(obj: any) {
  const terminalFields = getTerminalFieldPaths(obj);

  return terminalFields.map(field => ({
    name: field,
    value: get(obj, field),
  }));
}

export async function getFileContent(filePath: string) {
  try {
    const response = await fetch(
      `http://localhost:3010/file?filePath=${encodeURIComponent(filePath)}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.text();
    return data;
  } catch (error) {
    console.error('An error occurred while fetching the file content', error);
    throw error;
  }
}

export async function writeFileContent(filePath: string, content: string) {
  try {
    const response = await fetch(`http://localhost:3000/file`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filePath, content }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('An error occurred while writing the file content', error);
    throw error;
  }
}

export function removeFromObject(obj: Record<string, any>, key: string) {
  return Object.fromEntries(Object.entries(obj).filter(([k]) => k !== key));
}

export function safeJsonParse(str: any) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return undefined;
  }
}

type JsonObject = { [key: string]: any };
export function pruneObject(
  jsonObject: JsonObject,
  keyPaths: string[]
): JsonObject {
  const pruned: JsonObject = {};

  keyPaths.forEach(keyPath => {
    const value = get(jsonObject, keyPath);
    if (value !== undefined) {
      setValueByPath(pruned, keyPath, value);
    }
  });

  return pruned;
}

function setValueByPath(obj: JsonObject, path: string, value: any) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  let currentObj: JsonObject = obj;

  if (lastKey) {
    for (const key of keys) {
      if (!(key in currentObj)) {
        currentObj[key] = {};
      }
      currentObj = currentObj[key];
    }

    currentObj[lastKey] = value;
  }
}

export async function requestNetworkInterceptFromOpenAI(
  requests: TNetworkRequest[]
) {
  const prompt = interceptPrompt(requests);
  console.log(prompt);
  const chatCompletion = await requestFromOpenAI({
    openAIMethod: 'createChatCompletion',
    requestBody: {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    },
  });

  return chatCompletion.choices[0].message.content;
}

// Example arguments:
//  title:      'AI Hub Build Mode'
//  url:        '/hub/apps/',
//  intercepts: 'cy.intercept("blah blah")',
//  items       "[
//                 { "type": "assertExists", "testId": "create-app-button", "tagName": "BUTTON" },
//                 { "type": "assertText", "testId": "create-app-button", "text": "Create App", "tagName": "BUTTON" },
//                 { "type": "click", "testId": "create-app-button", "tagName": "BUTTON" },
//                 { "type": "assertExists", "testId": "create-app-input", "tagName": "BUTTON" },
//                 { "type": "keystroke", "testId": "create-app-input", "text": "abc", "tagName": "INPUT" },
//              ]"

export async function generateCypressTestFromOpenAI(params: {
  title: string;
  url: string;
  intercepts: string;
  items: TItem[];
}) {
  const prompt = writeTestPrompt(params);
  console.log(prompt);
  const chatCompletion = await requestFromOpenAI({
    openAIMethod: 'createChatCompletion',
    requestBody: {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    },
  });

  return chatCompletion.choices[0].message.content;
}

export async function requestFromOpenAI({
  openAIMethod,
  requestBody,
}: {
  openAIMethod: string;
  requestBody: any;
}) {
  const response = await fetch(`http://localhost:3010/open-ai`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ openAIMethod, requestBody }),
  }).then(response => response.json());

  return response;
}

export async function applyChanges(actions: (TAction & { testId: string })[]) {
  const response = await fetch(`http://localhost:3010/apply-code-changes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ actions }),
  }).then(response => response.json());

  return response;
}

export const sendEvent = (actionName: string, payload?: any) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTabId = tabs[0]?.id as number;
    // console.log('sending event', actionName, 'tabId', activeTabId)
    // if (activeTabId) {
    //   // Get data from react devtools agent and do stuff with it
    //   chrome.tabs.sendMessage(activeTabId, { action: actionName, payload });
    // }
  });
  chrome.runtime.sendMessage({ action: actionName, payload });
};

export function getStableTestId(filepath: string, props: any) {
  const sourceFileName = filepath.split('/').slice(-1)?.[0]?.split('.')?.[0];

  const str = JSON.stringify(props, Object.keys(props).sort());
  const hash = crypto.SHA256(str);
  return `${sourceFileName}${hash.toString().substr(0, 7)}`;
}

// thanks chatgpt
export function isClickAction(action: TAction): action is TClickAction {
  return action.type === 'click';
}

export function isKeyboardAction(action: TAction): action is TKeyboardAction {
  return action.type === 'keyboard';
}

export function isVisitAction(action: TAction): action is TVisitAction {
  return action.type === 'visit';
}

export function isAssertExistsAction(
  action: TAction
): action is TAssertExistsAction {
  return action.type === 'assertExists';
}

export function isAssertTextAction(
  action: TAction
): action is TAssertTextAction {
  return action.type === 'assertText';
}

export const actionToPromptItem = (action: TAction): TItem => {
  if (isClickAction(action)) {
    const { type, sourceFile, details, tagName } = action;
    const testId = getStableTestId(sourceFile, details.props);

    return {
      type,
      testId,
      tagName,
    };
  } else if (isKeyboardAction(action)) {
    // keyboard is not supported yet since we need to store the sourceFile of a keyboard event =(
    // so we need to figure out what to do here...
    throw new Error('keyboard action not supported');
    // const { type, details, tagName, text } = action;
    // const testId = getStableTestId(sourceFile, details.props);

    // return {
    //   type,
    //   tagName,
    //   text,
    //   testId,
    // };
  } else if (isAssertExistsAction(action)) {
    const { type, sourceFile, tagName, details } = action;
    const testId = getStableTestId(sourceFile, details.props);

    return {
      type,
      testId,
      tagName,
    };
  } else if (isAssertTextAction(action)) {
    const { type, assertContainsText, sourceFile, tagName, details } = action;
    const testId = getStableTestId(sourceFile, details.props);

    return {
      type,
      testId,
      tagName,
      text: assertContainsText,
    };
  }

  // Handle cases where the action does not match any specific type
  throw new Error(`Unknown action type ${action.type}`);
};
