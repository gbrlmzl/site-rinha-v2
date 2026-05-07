/// <reference types="cypress" />

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Faz login via API e cacheia o cookie JWT entre testes via cy.session.
       * Credenciais vêm de cypress.env.json (não commitado).
       */
      loginAsAdmin(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('loginAsAdmin', () => {
  const username = Cypress.env('ADMIN_USERNAME') as string | undefined;
  const password = Cypress.env('ADMIN_PASSWORD') as string | undefined;

  if (!username || !password) {
    throw new Error(
      'Credenciais admin ausentes. Defina ADMIN_USERNAME e ADMIN_PASSWORD em cypress.env.json'
    );
  }

  // session isola o cookie por chave — login só roda uma vez por chave válida
  cy.session(
    ['admin', username],
    () => {
      cy.request({
        method: 'POST',
        url: '/api/auth/login',
        body: { username, password, keepLoggedIn: true },
      })
        .its('status')
        .should('eq', 200);
    },
    {
      validate: () => {
        // confirma que o cookie ainda autentica
        cy.request('/api/auth/me').its('status').should('eq', 200);
      },
    }
  );
});

export {};
