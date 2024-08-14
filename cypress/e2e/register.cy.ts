describe('Registration Page', () => {
  beforeEach(() => {
    // Navigate to the registration page before each test
    cy.visit('/register');
  });

  it('should display the registration form', () => {
    // Check if the registration form is displayed
    cy.get('input[name="username"]').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('input[name="confirm-password"]').should('be.visible');
    cy.get('[data-testid="Sign Up"]').click();
  });

  it('should display validation errors for invalid input', () => {
    // Attempt to submit the form with invalid data
    cy.get('input[name="username"]').clear().type('a');
    cy.get('input[name="email"]').clear().type('invalid-email');
    cy.get('input[name="password"]').clear().type('123');
    cy.get('input[name="confirm-password"]').clear().type('321');
    cy.get('[data-testid="Sign Up"]').click();

    // Check for validation error messages
    cy.contains('Username should have a minimum length of 3 characters').should('be.visible');
    cy.contains('Please enter a valid email address').should('be.visible');
    cy.contains('Password should have a minimum length of 6 characters').should('be.visible');
    cy.contains('Passwords do not match').should('be.visible');
  });

  it('should register a new user successfully', () => {
    // Enter valid data into the form
    cy.get('input[name="username"]').clear().type('testuser');
    cy.get('input[name="email"]').clear().type('testuser@example.com');
    cy.get('input[name="password"]').clear().type('password123');
    cy.get('input[name="confirm-password"]').clear().type('password123');

    // Mock the API response
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 200,
      body: {},
    }).as('registerUser');

    // Submit the form
    cy.get('[data-testid="Sign Up"]').click();

    // Wait for the API response
    cy.wait('@registerUser');

    // Check if the user is redirected to the home page
    cy.url().should('include', '/');
  });
});
