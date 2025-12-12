describe("Student Page E2E", () => {
  beforeEach(() => {
    cy.mockLoginSuccess()
      .then(() => cy.mockGetStudents())
      .then(() => {
        cy.visit("/students");
      });
  });

  it("should display student list", () => {
    cy.wait('@getStudents');
    cy.get("table tbody tr").should("have.length", 2);
    cy.contains("John");
    cy.contains("Jane");
  });

  it("should create a new student", () => {
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

  it("should edit a student", () => {
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

  it("should delete a student", () => {
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
