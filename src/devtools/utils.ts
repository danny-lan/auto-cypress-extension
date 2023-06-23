import { Configuration, OpenAIApi } from 'openai';
import get from 'lodash/get';
import { TNetworkRequestParam } from './types';

const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);

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

export async function requestFromAI(
  requestQuery: TNetworkRequestParam[],
  requestBody: TNetworkRequestParam[] | undefined,
  responseBody: any
) {
  // const chatCompletion = await openai.createChatCompletion({
  //   model: 'gpt-3.5-turbo',
  //   messages: [{ role: 'user', content: 'Write a poem about ducks' }]
  // });
}
