# EtudiantFrontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.16.

## 🛠️ Prerequisites

Before running this project, ensure you have the following software installed on your machine:

* **Node.js**: Version 18 or later (LTS recommended).
* **npm** (Node Package Manager): Automatically installed with Node.js.
* **Angular CLI**: Install globally using `npm install -g angular/cli`.

## 🚀 Installation

To set up the project locally and install all dependencies:

1.  **Clone the repository:**
    ```bash
    git clone [Your Repository URL]
    cd EtudiantFrontend
    ```

2.  **Install project dependencies:**
    ```bash
    npm install
    ```

## 🖥️ Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## 🏗️ Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## 📦 Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## 🧪 Testing

The project includes two levels of testing: Unit Tests (Jest) for core logic and End-to-End Tests (Cypress) for full user flows.

### 1. Running Unit Tests

Unit tests are executed using the **Jest** runner. They cover services logic, component behavior, and authentication logic.

To execute unit tests:

```bash
npm run test
# or (if you use the Jest command directly)
jest --runInBand --coverage --verbose
```

#### Detailed Unit Test Coverage

* **`StudentService`**: Tests for all CRUD operations (`create`, `get all`, `get by id`, `update`, `delete`) and error handling.
* **`UserService`**: Verifies API interactions for registration (`/api/register`) and login (`/api/login`), including token storage.
* **`AuthService`**: Verifies authentication mechanisms including token management (setting, retrieval, deletion), authentication state (`isAuthenticated`), and logging out (`logout`).
* **`RegisterComponent`**: Verifies form validity and the correct call to `UserService.register` followed by navigation to the login page (`/login`).
* **`LoginComponent`**: Verifies login form validity and the correct call to `UserService.login` followed by navigation to the home page (`/`).
* **`StudentComponent`**: Verifies loading and displaying the student list, handling add/edit forms, and interactions with `StudentService` (CRUD).

### 2. Running End-to-End (E2E) Tests

End-to-End tests are handled by **Cypress** and validate the full application workflow from the user's perspective, relying on network mocking (cy.intercept or custom mock functions) to ensure reliable execution.

To execute E2E tests:

```bash
ng e2e
# This command will start Cypress in interactive mode.
# or (if you use the Cypress command directly)
npx cypress open
```

#### Detailed E2E User Flow

The Cypress suite covers the main journey of a user:

| Feature | Description |
| :--- | :--- |
| **Registration** | Successful registration and redirection to `/login`. |
| **Login** | Successful login and redirection to the application homepage (`/`). |
| **Student List Display** | Verifies the display of the mocked student list. |
| **Student Creation (CRUD)** | Tests the form input and API call for creating a new student, then checks the list update. |
| **Student Edition (CRUD)** | Tests the workflow for editing an existing student's data and verifying the update. |
| **Student Deletion (CRUD)** | Confirms deletion via UI and checks for the corresponding API call and list update. |
| **Logout** | Clicks the Logout button, verifies redirection to `/login`, and confirms the session token is cleared from `sessionStorage`. |

## 📚 Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
