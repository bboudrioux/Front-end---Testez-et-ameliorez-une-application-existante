describe('Register Flow', () => {

  beforeEach(() => {
    cy.visit('/register', {
      onBeforeLoad(win) {
        cy.stub(win.console, 'log').as('consoleLog')
        cy.stub(win.console, 'error').as('consoleError')
      }
    });
  })

  it('should register successfully and redirect to /login', () => {
    cy.mockRegisterSuccess();

    cy.get('input[formControlName="login"]').type('john@gmail.com');
    cy.get('input[formControlName="password"]').type('secret');
    cy.get('input[formControlName="firstName"]').type('john');
    cy.get('input[formControlName="lastName"]').type('Wick');

    cy.get('button[type="submit"]').click();

    cy.wait('@registerRequest');

    cy.url().should('include', '/login');
  });

  it('should show error message if register fails', () => {
    cy.mockRegisterFailure();

    cy.get('input[formControlName="login"]').type('john@gmail.com');
    cy.get('input[formControlName="password"]').type('secret');
    cy.get('input[formControlName="firstName"]').type('john');
    cy.get('input[formControlName="lastName"]').type('Wick');

    cy.get('button[type="submit"]').click();

    cy.wait('@registerRequest');

    cy.get('@consoleError').should('be.calledWith', 'Register failed')
  });

});
