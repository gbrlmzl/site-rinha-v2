// Criação de torneio — testes do form modal com cy.intercept
// Foco: validação client-side (zod) e submit happy path com FormData

describe('Admin · Criar torneio', () => {
  beforeEach(() => {
    cy.loginAsAdmin();

    cy.intercept('GET', '/api/admin/tournaments*', {
      fixture: 'admin/tournaments-page.json',
    }).as('list');

    cy.visit('/admin/torneios');
    cy.wait('@list');

    // Abre o modal via Intercepting Route do Next
    cy.contains('button, a', 'Criar Novo Torneio').click();
    cy.contains('Criar Novo Torneio').should('be.visible'); // título do modal
  });

  it('exibe erros de validação client-side ao submeter form vazio', () => {
    // O nome inicial é '' e zod rejeita; basta clicar em submit
    cy.contains('button', 'Criar Torneio').click();

    // Mensagens de helperText do react-hook-form devem aparecer
    cy.get('.MuiFormHelperText-root.Mui-error').should('have.length.greaterThan', 0);
  });

  it('rejeita imagem ausente como erro do schema', () => {
    cy.get('input[placeholder="Ex: Liga dos Campeões 2026"]').type('Torneio Teste E2E');
    cy.get('input[placeholder="https://exemplo.com/regras.pdf"]').type('https://docs.rinha/regras');
    cy.get('textarea[placeholder^="Resumo sobre o torneio"]').type('Descrição válida do torneio.');

    cy.contains('button', 'Criar Torneio').click();

    cy.contains('Imagem obrigatória').should('be.visible');
  });

  it('envia POST multipart com payload correto e fecha modal no sucesso', () => {
    cy.intercept('POST', '/api/admin/tournaments', {
      statusCode: 201,
      body: {
        id: 999,
        slug: 'torneio-teste-e2e',
        name: 'Torneio Teste E2E',
        game: 'LEAGUE_OF_LEGENDS',
        status: 'OPEN',
        maxTeams: 16,
        prizePool: 1000,
        startsAt: new Date(Date.now() + 7 * 86400000).toISOString(),
        endsAt: new Date(Date.now() + 8 * 86400000).toISOString(),
        createdAt: new Date().toISOString(),
        description: 'Descrição válida do torneio.',
        imageUrl: 'https://i.imgur.com/stub.png',
        rulesUrl: 'https://docs.rinha/regras',
      },
    }).as('createTournament');

    cy.get('input[placeholder="Ex: Liga dos Campeões 2026"]').type('Torneio Teste E2E');
    cy.get('input[placeholder="https://exemplo.com/regras.pdf"]').type('https://docs.rinha/regras');
    cy.get('textarea[placeholder^="Resumo sobre o torneio"]').type('Descrição válida do torneio.');

    // Anexa a imagem (Cypress envia o arquivo ao input file de fato)
    cy.get('input[type=file]').selectFile(
      {
        contents: Cypress.Buffer.from('fake-png-bytes'),
        fileName: 'banner.png',
        mimeType: 'image/png',
      },
      { force: true }
    );

    cy.contains('button', 'Criar Torneio').click();

    cy.wait('@createTournament').then((interception) => {
      // O front envia FormData multipart; o body chega como string/Buffer.
      // Validamos: (1) header é multipart, (2) o boundary contem a parte `data` (payload JSON)
      // e (3) a parte `image` com o filename, garantindo que a imagem foi anexada de verdade.
      expect(interception.request.headers['content-type']).to.match(/multipart\/form-data/);

      const rawBody = interception.request.body;
      const bodyAsString =
        typeof rawBody === 'string'
          ? rawBody
          : new TextDecoder().decode(rawBody as ArrayBuffer);

      expect(bodyAsString, 'parte data do FormData').to.match(
        /name="data"[\s\S]+Torneio Teste E2E/
      );
      expect(bodyAsString, 'parte image do FormData').to.match(
        /name="image"[\s\S]+filename="banner\.png"/
      );
      expect(bodyAsString, 'content-type da imagem').to.include('image/png');
    });

    // Modal deve fechar após sucesso (volta pra rota /admin/torneios)
    cy.location('pathname').should('eq', '/admin/torneios');
  });
});
