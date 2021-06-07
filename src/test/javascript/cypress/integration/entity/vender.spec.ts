import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Vender e2e test', () => {
  let startingEntitiesCount = 0;

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });

    cy.clearCookies();
    cy.intercept('GET', '/api/venders*').as('entitiesRequest');
    cy.visit('');
    cy.login('admin', 'admin');
    cy.clickOnEntityMenuItem('vender');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.visit('/');
  });

  it('should load Venders', () => {
    cy.intercept('GET', '/api/venders*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('vender');
    cy.wait('@entitiesRequest');
    cy.getEntityHeading('Vender').should('exist');
    if (startingEntitiesCount === 0) {
      cy.get(entityTableSelector).should('not.exist');
    } else {
      cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
    }
    cy.visit('/');
  });

  it('should load details Vender page', () => {
    cy.intercept('GET', '/api/venders*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('vender');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityDetailsButtonSelector).first().click({ force: true });
      cy.getEntityDetailsHeading('vender');
      cy.get(entityDetailsBackButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should load create Vender page', () => {
    cy.intercept('GET', '/api/venders*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('vender');
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Vender');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.visit('/');
  });

  it('should load edit Vender page', () => {
    cy.intercept('GET', '/api/venders*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('vender');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityEditButtonSelector).first().click({ force: true });
      cy.getEntityCreateUpdateHeading('Vender');
      cy.get(entityCreateSaveButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should create an instance of Vender', () => {
    cy.intercept('GET', '/api/venders*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('vender');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Vender');

    cy.get(`[data-cy="name"]`)
      .type('Factors Algeria Administrator', { force: true })
      .invoke('val')
      .should('match', new RegExp('Factors Algeria Administrator'));

    cy.get(`[data-cy="address"]`).type('COM Credit deploy', { force: true }).invoke('val').should('match', new RegExp('COM Credit deploy'));

    cy.get(`[data-cy="contact"]`).type('90961').should('have.value', '90961');

    cy.get(`[data-cy="date"]`).type('2021-06-05T05:17').invoke('val').should('equal', '2021-06-05T05:17');

    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.intercept('GET', '/api/venders*').as('entitiesRequestAfterCreate');
    cy.visit('/');
    cy.clickOnEntityMenuItem('vender');
    cy.wait('@entitiesRequestAfterCreate');
    cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount + 1);
    cy.visit('/');
  });

  it('should delete last instance of Vender', () => {
    cy.intercept('GET', '/api/venders*').as('entitiesRequest');
    cy.intercept('DELETE', '/api/venders/*').as('deleteEntityRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('vender');
    cy.wait('@entitiesRequest').then(({ request, response }) => {
      startingEntitiesCount = response.body.length;
      if (startingEntitiesCount > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.getEntityDeleteDialogHeading('vender').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest');
        cy.intercept('GET', '/api/venders*').as('entitiesRequestAfterDelete');
        cy.visit('/');
        cy.clickOnEntityMenuItem('vender');
        cy.wait('@entitiesRequestAfterDelete');
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount - 1);
      }
      cy.visit('/');
    });
  });
});
