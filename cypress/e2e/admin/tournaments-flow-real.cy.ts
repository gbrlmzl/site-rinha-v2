// Smoke E2E real — login admin → criar torneio → ver na lista → cancelar
// Pré-requisitos: back rodando, banco com usuário admin, cypress.env.json preenchido

describe('Admin · Fluxo completo (smoke E2E real)', () => {
  // Nome único por execução para não colidir com torneios existentes / migrations futuras
  const tournamentName = `E2E Smoke ${Date.now()}`;

  before(() => {
    cy.loginAsAdmin();
  });

  beforeEach(() => {
    cy.loginAsAdmin();
  });

  it('cria torneio, encontra na listagem e remove', () => {
    cy.visit('/admin/torneios');
    cy.contains('Gerenciar Torneios').should('be.visible');

    cy.contains('button, a', 'Criar Novo Torneio').click();
    cy.contains('Criar Novo Torneio').should('be.visible');

    cy.get('input[placeholder="Ex: Liga dos Campeões 2026"]').type(tournamentName);
    cy.get('input[placeholder="https://exemplo.com/regras.pdf"]').type(
      'https://docs.rinhaufpb.com/regras-e2e'
    );
    cy.get('textarea[placeholder^="Resumo sobre o torneio"]').type(
      'Torneio criado pelo teste E2E. Ignorar.'
    );

    // Imagem PNG mínima (1x1) gerada inline — passa nas validações de tipo do Imgur
    cy.fixture('admin/pixel.png', 'base64').then((b64) => {
      cy.get('input[type=file]').selectFile(
        {
          contents: Cypress.Buffer.from(b64, 'base64'),
          fileName: 'banner-e2e.png',
          mimeType: 'image/png',
        },
        { force: true }
      );
    });

    cy.contains('button', 'Criar Torneio').click();

    // O modal fecha e a listagem mostra o torneio recém-criado.
    // Pode ter um pequeno delay de invalidação da query.
    cy.location('pathname', { timeout: 15000 }).should('eq', '/admin/torneios');
    cy.contains(tournamentName, { timeout: 15000 }).should('be.visible');

    // Cancela (delete, pois não tem equipes inscritas)
    cy.contains(tournamentName).parents().filter('[class*=MuiBox-root]').first()
      .parent()
      .within(() => {
        cy.get('button').last().click();
      });

    cy.contains('Excluir torneio?').should('be.visible');
    cy.contains('button', 'Sim, excluir').click();

    cy.contains('Torneio excluído com sucesso').should('be.visible');
    cy.contains(tournamentName).should('not.exist');
  });
});
