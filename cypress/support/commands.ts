/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

declare namespace Cypress {
  interface Chainable<Subject = any> {
    login(redirectPath: string, admin: boolean, xhr: boolean): Chainable;
  }
}

Cypress.Commands.add(
  'login',
  (redirectPath = '/', admin = false, xhr = false) => {
    Cypress.config('defaultCommandTimeout', 10000);

    const username = 'support-testing@instabase.com';
    const password = '6pZWdcFqTR';

    return cy.session('testuser', () => {
      if (xhr) {
        const formdata = new FormData();
        formdata.append('email', username);
        formdata.append('password', password);

        const requestOptions = {
          method: 'POST',
          body: formdata,
          credentials: 'same-origin' as RequestCredentials,
          redirect: 'follow' as RequestRedirect,
        };

        return new Cypress.Promise((resolve, reject) => {
          fetch(`https://localhost/account/login`, requestOptions)
            .then(res => {
              console.log('res', res);
              resolve();
            })
            .catch(error => {
              console.log('err', error);
              reject(error);
            });
        });
      }

      cy.visit(
        `/account/login?next=${encodeURIComponent(redirectPath ?? '/')}`
      );
      cy.get('input[type="email"]').type(username);
      cy.get('input[type="password"]').type(password);
      cy.get('button[type="submit"]').click();

      return undefined;
    });
  }
);
