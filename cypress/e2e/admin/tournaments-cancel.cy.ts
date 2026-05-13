// Cancelar/excluir torneio — fluxos do TournamentCancelDialog
// Regra: totalTeamsCount === 0 → fluxo de delete; > 0 → fluxo de cancel com force=true

describe('Admin · Cancelar torneio', () => {
  beforeEach(() => {
    cy.loginAsAdmin();

    cy.intercept('GET', '/api/admin/tournaments*', {
      fixture: 'admin/tournaments-page.json',
    }).as('list');

    cy.visit('/admin/torneios');
    cy.wait('@list');
  });

  /**
   * Helper: clica no último IconButton da row (é o de cancelar/excluir).
   * Estrutura da row: [thumb+nome] [game] [status] [data] [equipes] [actions: ver, pagamentos, editar, cancelar]
   */
  const openCancelDialog = (tournamentName: string) => {
    cy.contains(tournamentName).parents().filter('[class*=MuiBox-root]').first()
      .parent()
      .within(() => {
        cy.get('button').last().click();
      });
  };

  it('mostra fluxo de cancelar com force=true quando há equipes inscritas', () => {
    cy.intercept('PATCH', '/api/admin/tournaments/1*', {
      statusCode: 204,
    }).as('cancel');

    openCancelDialog('Torneio Inter Cursos LoL');

    cy.contains('Atenção!').should('be.visible');
    cy.contains(/equipe.* inscrita/i).should('be.visible');

    cy.contains('button', 'Sim, cancelar').click();

    cy.wait('@cancel').its('request.url').should('include', 'force=true');
    cy.contains('Torneio cancelado').should('be.visible');
  });

  it('fecha o modal sem chamar API quando admin clica em "Não, voltar"', () => {
    let called = false;
    cy.intercept('PATCH', '/api/admin/tournaments/*', () => {
      called = true;
    });

    openCancelDialog('Torneio Inter Cursos LoL');
    cy.contains('button', 'Não, voltar').click();

    cy.contains('Atenção!').should('not.exist');
    cy.then(() => expect(called, 'PATCH não deve ter sido chamado').to.equal(false));
  });

  it('exibe erro vindo do back quando o cancelamento falha', () => {
    cy.intercept('PATCH', '/api/admin/tournaments/1*', {
      statusCode: 422,
      body: { error: 'Este torneio já está cancelado.' },
    }).as('cancelFail');

    openCancelDialog('Torneio Inter Cursos LoL');
    cy.contains('button', 'Sim, cancelar').click();

    cy.wait('@cancelFail');
    cy.contains('Este torneio já está cancelado.').should('be.visible');
  });
});
