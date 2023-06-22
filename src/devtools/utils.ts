import { Configuration, OpenAIApi } from "openai";
import get from "lodash/get";
import { NetworkRequestParam } from "./types";

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

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

export async function requestFromAI(
  requestQuery: NetworkRequestParam[],
  requestBody: NetworkRequestParam[] | undefined,
  responseBody: any
) {
  // const chatCompletion = await openai.createChatCompletion({
  //   model: 'gpt-3.5-turbo',
  //   messages: [{ role: 'user', content: 'Write a poem about ducks' }]
  // });
}
