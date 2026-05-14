// Listagem de torneios (admin) — testes com cy.intercept
// Não dependem do back: stubbamos a resposta de /api/admin/tournaments

describe('Admin · Listagem de torneios', () => {
  beforeEach(() => {
    // O admin/layout.tsx é Server Component e valida a role real no Next.
    // Login fica fora do escopo do teste — só os dados de torneios são mockados.
    cy.loginAsAdmin();

    cy.intercept('GET', '/api/admin/tournaments*', {
      fixture: 'admin/tournaments-page.json',
    }).as('listTournaments');

    cy.visit('/admin/torneios');
    cy.wait('@listTournaments');
  });

  it('renderiza os torneios da fixture', () => {
    cy.contains('Gerenciar Torneios').should('be.visible');
    cy.contains('Torneio Inter Cursos LoL').should('be.visible');
    cy.contains('Copa Valorant 2026').should('be.visible');
    cy.contains('Campeonato CS2 UFPB').should('be.visible');
  });

  it('exibe o contador "confirmadas/max" no formato esperado', () => {
    // Linha do torneio LoL: 5 confirmadas de 16 max
    cy.contains('Torneio Inter Cursos LoL')
      .closest('[class*=MuiBox-root]')
      .parent()
      .should('contain.text', '5/16');
  });

  it('filtra por jogo enviando o parâmetro correto à API', () => {
    cy.intercept('GET', '/api/admin/tournaments*game=VALORANT*', {
      body: {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: 10,
        number: 0,
        first: true,
        last: true,
        empty: true,
      },
    }).as('filterValorant');

    // O select de jogo abre clicando no texto "Todos os jogos"
    cy.contains('Todos os jogos').click();
    cy.contains('[role=option], li', 'Valorant').click();

    cy.wait('@filterValorant').its('request.url').should('include', 'game=VALORANT');
    cy.contains('Nenhum torneio encontrado.').should('be.visible');
  });

  it('filtra por nome no campo de busca (filtro client-side)', () => {
    cy.get('input[placeholder="Filtrar por nome..."]').type('Valorant');
    cy.contains('Copa Valorant 2026').should('be.visible');
    cy.contains('Torneio Inter Cursos LoL').should('not.exist');
  });

  it('exibe alerta quando a API retorna erro', () => {
    // Sobrescreve o intercept padrão para forçar 500
    cy.intercept('GET', '/api/admin/tournaments*', {
      statusCode: 500,
      body: { error: 'Falha interna no servidor' },
    }).as('listError');

    cy.reload();
    cy.wait('@listError');
    // O componente mostra Alert de erro
    cy.get('[role=alert]').should('be.visible');
  });
});
