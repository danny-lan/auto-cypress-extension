import get from 'lodash/get';

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
export function pruneObject(jsonObject: JsonObject, keyPaths: string[]): JsonObject {
  const pruned: JsonObject = {};

  keyPaths.forEach((keyPath) => {
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
  });

  return response;
}
