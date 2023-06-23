import { Configuration, OpenAIApi } from "openai";
import get from "lodash/get";
import {TNetworkRequest} from "./types";
import interceptPrompt from './prompts/intercept';

export function getTerminalFieldPaths(obj: any, prefix = ""): string[] {
  let paths: string[] = [];

  for (let key in obj) {
    let newPath = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object") {
      paths = paths.concat(getTerminalFieldPaths(obj[key], newPath));
    } else {
      paths.push(newPath);
    }
  }

  return paths;
}

export function getTerminalFieldsAndValues(obj: any) {
  const terminalFields = getTerminalFieldPaths(obj);

  return terminalFields.map((field) => ({
    name: field,
    value: get(obj, field),
  }));
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

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);
export async function requestFromAI(requests: TNetworkRequest[]) {
  const prompt = interceptPrompt(requests);
  const chatCompletion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }]
  });
  console.log(chatCompletion);
}
