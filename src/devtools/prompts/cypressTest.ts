import { TItem } from '../types';

export default function writeTestPrompt({
  title,
  url,
  intercepts,
  items,
}: {
  title: string;
  url: string;
  intercepts: string;
  items: TItem[];
}) {
  return `
  Write a Cypress test that meets the following conditions:

  1. The test name is ${title}
  
  2. In the before block of the cypress test, the first line is "cy.login(null, false, true);". The second line is cy.visit('${url}');
  
  3. In the beforeEach block of the cypress test, include the following lines of code: "${intercepts}"
  
  4. The following instructions relate to generating lines of a cypress test based on a list of JSON items.
  Each item will have the format {{ "type": "click", "textContent": "Create App", "testId": "create-app-button", "tagName": "BUTTON" }}.
  
  An item with type "click" should be transformed as follows:
  Item: {{ "type": "click", "testId": "create-app-button", "tagName": "BUTTON" }}
  Cypress Line: cy.get('button[data-testid="create-app-button"]').click();
  
  An item with type "assertText" should be transformed as follows:
  Item: {{ "type": "assertText", "assertContainsText": "Create App", "testId": "create-app-button", "tagName": "BUTTON" }}
  Cypress Line: cy.get('button[data-testid="create-app-button"]').should('have.text', 'Create App');
  
  An item with type "assertExists" should be transformed as follows:
  Item: {{ "type": "assertExists", "testId": "create-app-button", "tagName": "BUTTON" }}
  Cypress Line: cy.get('button[data-testid="create-app-button"]').should('exist');
  
  An item with type "keyboard" should be transformed as follows:
  Item: {{ "type": "keyboard", "testId": "create-app-button", "text": "abc", "tagName": "INPUT" }}
  Cypress Line: cy.get('button[data-testid="create-app-button"]').type('abc');
  
  3. Transform each of the following items in the JSON list into cypress lines following the above instructions.
  Add a comment to each line of code to explain what it does.
  Include these cypress lines in the body of the cypress test.
  
  ${JSON.stringify(items)}

  Don't include the question or any explanations in your response.  
`;
}
