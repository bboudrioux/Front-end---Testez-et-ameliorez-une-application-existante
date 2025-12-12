export { };

declare global {
  namespace Cypress {
    interface Chainable {
      mockLoginSuccess(): Chainable<void>;
      mockLoginFailure(): Chainable<void>;
      mockRegisterSuccess(): Chainable<void>;
      mockRegisterFailure(): Chainable<void>;
      mockGetStudents(): Chainable<void>;
      mockCreateStudent(): Chainable<void>;
      mockUpdateStudent(): Chainable<void>;
      mockDeleteStudent(): Chainable<void>;
    }
  }
}

// ---------------------- Auth Mocks ----------------------
Cypress.Commands.add("mockLoginSuccess", () => {
  cy.fixture("login-success.json").then((body) => {
    cy.intercept("POST", "/api/login", { statusCode: 200, body }).as("loginRequest");
    cy.window().then((win) => {
      win.sessionStorage.setItem("token", body.token);
    });
  });
});

Cypress.Commands.add("mockLoginFailure", () => {
  cy.fixture("login-failure.json").then((body) => {
    cy.intercept("POST", "/api/login", { statusCode: 401, body }).as("loginRequest");
  });
});

Cypress.Commands.add("mockRegisterSuccess", () => {
  cy.fixture("register-success.json").then((body) => {
    cy.intercept("POST", "/api/register", { statusCode: 201, body }).as("registerRequest");
  });
});

Cypress.Commands.add("mockRegisterFailure", () => {
  cy.fixture("register-failure.json").then((body) => {
    cy.intercept("POST", "/api/register", { statusCode: 400, body }).as("registerRequest");
  });
});

// ---------------------- Student Mocks ----------------------
let studentsFixture: any[] = [];

Cypress.Commands.add("mockGetStudents", () => {
  cy.fixture("students.json").then((students) => {
    studentsFixture = JSON.parse(JSON.stringify(students));
    cy.intercept("GET", "/api/students", (req) => {
      req.reply({ statusCode: 200, body: studentsFixture });
    }).as("getStudents");
  });
});

Cypress.Commands.add("mockCreateStudent", () => {
  cy.intercept("POST", "/api/students", (req) => {
    const newStudent = { id: 999, ...req.body };
    studentsFixture.push(newStudent);
    req.reply({ statusCode: 201, body: newStudent });
  }).as("createStudent");
});

Cypress.Commands.add("mockUpdateStudent", () => {
  cy.intercept("PUT", "/api/students/*", (req) => {
    const id = Number(req.url.split("/").pop());
    const index = studentsFixture.findIndex(s => s.id === id);
    if (index !== -1) {
      studentsFixture[index] = { ...studentsFixture[index], ...req.body };
      req.reply({ statusCode: 200, body: studentsFixture[index] });
    } else {
      req.reply({ statusCode: 404 });
    }
  }).as("updateStudent");
});

Cypress.Commands.add("mockDeleteStudent", () => {
  cy.intercept("DELETE", "/api/students/*", (req) => {
    const id = Number(req.url.split("/").pop());
    studentsFixture = studentsFixture.filter(s => s.id !== id);
    req.reply({ statusCode: 200 });
  }).as("deleteStudent");
});

