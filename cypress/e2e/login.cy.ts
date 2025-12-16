describe('Login Flow', () => {

  beforeEach(() => {
    cy.visit('/login', {
      onBeforeLoad(win) {
        cy.stub(win.console, 'log').as('consoleLog')
        cy.stub(win.console, 'error').as('consoleError')
      }
    });
  })

  it('should login successfully and redirect to /', () => {
    cy.mockLoginSuccess();

    cy.get('input[formControlName="login"]').type('john');
    cy.get('input[formControlName="password"]').type('secret');

    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');

    cy.url().should('eq', Cypress.config().baseUrl);
  });

  it('should log error message on invalid credentials', () => {
    cy.mockLoginFailure();

    cy.get('input[formControlName="login"]').type('john');
    cy.get('input[formControlName="password"]').type('badpass');

    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');

    cy.get('@consoleError').should('be.calledWith', 'Login failed')
  });

});
