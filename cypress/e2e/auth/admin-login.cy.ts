// Login do admin — E2E real contra back rodando em http://localhost:8080
// Pré-requisitos:
//   - back rodando, banco com usuário admin
//   - cypress.env.json com ADMIN_USERNAME e ADMIN_PASSWORD

describe('Admin · Fluxo de login (real)', () => {
  it('rejeita credenciais inválidas e mantém o usuário na tela de login', () => {
    cy.visit('/login');

    cy.get('input[name=username]').type('usuario_inexistente');
    cy.get('input[name=password]').type('senha_errada_123');
    cy.contains('button', 'Entrar').click();

    cy.contains('Credenciais inválidas', { timeout: 10000 }).should('be.visible');
    cy.location('pathname').should('eq', '/login');
  });

  it('autentica admin válido e libera acesso ao painel /admin/torneios', () => {
    const username = Cypress.env('ADMIN_USERNAME');
    const password = Cypress.env('ADMIN_PASSWORD');

    cy.visit('/login?next=/admin/torneios');

    cy.get('input[name=username]').type(username);
    cy.get('input[name=password]').type(password, { log: false });
    cy.contains('button', 'Entrar').click();

    // Após login, AuthContext faz refreshUser e router.push pro `next`
    cy.location('pathname', { timeout: 15000 }).should('eq', '/admin/torneios');
    cy.contains('Gerenciar Torneios').should('be.visible');
  });
});
