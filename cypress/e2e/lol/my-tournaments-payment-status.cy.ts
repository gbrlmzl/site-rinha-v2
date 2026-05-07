// Atualização de status do pagamento no carrossel "Minhas Competições"
//
// O front chama http://localhost:8080/tournaments/me direto (sem o proxy /api),
// então o intercept aponta pra URL absoluta.
//
// Em produção, a aprovação chega via WebSocket → paymentApprovedNotifier → refetch.
// Aqui simulo o trigger trocando o stub e recarregando — observamos o efeito visível.

const TOURNAMENTS_ME = 'http://localhost:8080/tournaments/me*';

describe('LoL · MyTournaments — atualização de status do pagamento', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
  });

  it('renderiza PendingPaymentCard com chip "Aguardando Pagamento" quando o time está em PENDING_PAYMENT', () => {
    cy.intercept('GET', TOURNAMENTS_ME, {
      fixture: 'lol/my-tournaments-pending.json',
    }).as('myTournaments');

    cy.visit('/lol/torneios');
    cy.wait('@myTournaments');

    cy.contains('Minhas Competições').should('be.visible');
    cy.contains('Torneio Demo E2E').should('be.visible');
    cy.contains('Equipe: Cypress Squad').should('be.visible');
    cy.contains('Aguardando Pagamento').should('be.visible');
    cy.contains('button', /PAGAR AGORA/i).should('be.visible');
  });

  it('substitui o card amarelo pelo verde "Confirmado" após a aprovação do pagamento', () => {
    // 1. Estado inicial — pendente de pagamento
    cy.intercept('GET', TOURNAMENTS_ME, {
      fixture: 'lol/my-tournaments-pending.json',
    }).as('pending');

    cy.visit('/lol/torneios');
    cy.wait('@pending');

    cy.contains('Aguardando Pagamento').should('be.visible');

    // 2. Webhook do MP "aprova" o pagamento → API agora retorna READY
    //    Em prod, o WS dispararia o notifier; aqui forço o refetch via reload.
    cy.intercept('GET', TOURNAMENTS_ME, {
      fixture: 'lol/my-tournaments-ready.json',
    }).as('ready');

    cy.reload();
    cy.wait('@ready');

    // 3. UI agora mostra ActiveTournamentCard — chip "Confirmado", sem botão de pagar
    cy.contains('Confirmado').should('be.visible');
    cy.contains('Aguardando Pagamento').should('not.exist');
    cy.contains('button', /PAGAR AGORA/i).should('not.exist');
  });

  it('não exibe a seção "Minhas Competições" quando o usuário não tem times inscritos', () => {
    cy.intercept('GET', TOURNAMENTS_ME, {
      body: {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: 20,
        number: 0,
        first: true,
        last: true,
        empty: true,
      },
    }).as('empty');

    cy.visit('/lol/torneios');
    cy.wait('@empty');

    cy.contains('Minhas Competições').should('not.exist');
  });
});
