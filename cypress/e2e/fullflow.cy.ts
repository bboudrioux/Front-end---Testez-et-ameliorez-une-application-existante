describe('Full user flow', () => {

  it('should register successfully and redirect to /login', () => {
    cy.visit('/register');
    cy.mockRegisterSuccess();

    cy.get('input[formControlName="login"]').type('john@gmail.com');
    cy.get('input[formControlName="password"]').type('secret');
    cy.get('input[formControlName="firstName"]').type('john');
    cy.get('input[formControlName="lastName"]').type('Wick');

    cy.get('button[type="submit"]').click();

    cy.wait('@registerRequest');

    cy.url().should('include', '/login');
  });

  it('should login successfully and redirect to /', () => {
    cy.visit('/login');
    cy.mockLoginSuccess();

    cy.get('input[formControlName="login"]').type('john');
    cy.get('input[formControlName="password"]').type('secret');

    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');

    cy.url().should('eq', Cypress.config().baseUrl);
  });

  it("should display student list", () => {
    cy.mockLoginSuccess()
      .then(() => cy.mockGetStudents())
      .then(() => {
        cy.visit("/students");
        cy.wait('@getStudents');
        cy.get("table tbody tr").should("have.length", 2);
        cy.contains("John");
        cy.contains("Jane");
      });
  });

  it("should create a new student", () => {
    cy.mockLoginSuccess()
      .then(() => cy.mockGetStudents())
      .then(() => {
        cy.visit("/students");
        cy.mockCreateStudent();
        cy.get('input[formControlName="firstName"]').type("Alice");
        cy.get('input[formControlName="lastName"]').type("Wonderland");

        cy.get('button[type="submit"]').contains("Add").click();

        cy.wait("@createStudent").its("request.body").should("deep.equal", {
          firstName: "Alice",
          lastName: "Wonderland"
        });

        cy.get("table tbody tr").should("have.length", 3);
        cy.contains("Alice");
      });
  });

  it("should edit a student", () => {
    cy.mockLoginSuccess()
      .then(() => cy.mockGetStudents())
      .then(() => {
        cy.visit("/students");
        cy.mockUpdateStudent();
        cy.contains("John").parent("tr").within(() => {
          cy.contains("Edit").click();
        });
        cy.get('input[formControlName="firstName"]').clear().type("Johnny");
        cy.get('input[formControlName="lastName"]').clear().type("DoeUpdated");
        cy.contains("Update").click();

        cy.wait("@updateStudent");
        cy.contains("Johnny");
        cy.contains("DoeUpdated");
      });
  });

  it("should delete a student", () => {
    cy.mockLoginSuccess()
      .then(() => cy.mockGetStudents())
      .then(() => {
        cy.visit("/students");
        cy.mockDeleteStudent();
        cy.contains("Jane").parent("tr").within(() => {
          cy.contains("Delete").click();
        });
        cy.on("window:confirm", () => true);

        cy.wait("@deleteStudent");
        cy.get("table tbody tr").should("have.length", 1);
        cy.contains("Jane").should("not.exist");
      });
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
