describe('Home Page Security', () => {

  beforeEach(() => {
    sessionStorage.clear();
  });

  it('should logout and return to login page', () => {
    sessionStorage.setItem('token', 'FAKE_ABC');
    cy.visit('/');

    cy.contains('Logout').click();

    cy.url().should('include', '/login');

    cy.window().then(win => {
      expect(win.sessionStorage.getItem('token')).to.be.null;
    });
  });

});
