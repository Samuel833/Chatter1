describe('Login Page', () => {
  beforeEach(() => {
    // Navigate to the login page before each test
    cy.visit('/login');
  });

  it('should display the login form', () => {
    // Check if the login form is displayed
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('[data-testid="Login"]').click();
  });

  it('should display validation errors for invalid input', () => {
    // Attempt to submit the form with invalid data
    cy.get('input[name="email"]').clear().type('invalid-email');
    cy.get('input[name="password"]').clear().type('123');
    cy.get('[data-testid="Login"]').click();

    // Check for validation error messages
    cy.contains('User not found').should('be.visible');
  });

  it('should display error message for wrong password', () => {
    // Enter valid email
    cy.get('input[name="email"]').clear().type('segundej7@gmail.com')
    // Enter wrong password
    cy.get('input[name="password"]').clear().type('wrongpassword')

    // Mock the API response
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: { error: 'Password does not match.' },
    }).as('loginUser');

    cy.get('[data-testid="Login"]').click();

    // Check for error message
    cy.contains('Password does not match.').should('be.visible');
  })

  it('should login a user successfully', () => {
    // Enter valid email
    cy.get('input[name="email"]').clear().type('segundej7@gmail.com')
    // Enter correct password
    cy.get('input[name="password"]').clear().type('qwerty')

    // Mock the API response
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {},
    }).as('loginUser');

    cy.get('[data-testid="Login"]').click();

    // Wait for the API response
    cy.wait('@loginUser');

    // Check if the user is redirected to the dashboard page
    cy.url().should('include', '/');
  })

})