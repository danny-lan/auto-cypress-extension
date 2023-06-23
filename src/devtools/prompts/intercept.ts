import { TNetworkRequest } from "../types";

export default function getPrompt(requests: TNetworkRequest[]) {
  if (!requests.length) return undefined;
  const url = requests[0].url;
  return `
Write a Cypress intercept that stubs the URL:
${url}

Use a JSON list of objects with the fields:
1. requestQuery, a JSON of keys and values
2. requestBody, a JSON of key paths and values, 
3. response

Use each object in the list to generate conditions that return response when:
1. the request query string matches requestQuery's keys and values
2. the request body matches requestBody's key paths and corresponding values

The list of objects is:
${JSON.stringify(
  requests.map(({ requestBody, requestQuery, response }) => ({
    requestBody,
    requestQuery,
    response,
  }))
)}

Don't include the question or any explanations in your response.
`;
}
