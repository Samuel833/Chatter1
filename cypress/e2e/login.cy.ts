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

  it('should login a user successfully', () => {
    // Enter valid email
    cy.get('input[name="email"]').clear().type('kingkae.kk@gmail.com')
    // Enter correct password
    cy.get('input[name="password"]').clear().type('qwerty')

    // Mock the API response
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {},
    }).as('loginUser');

    cy.get('[data-testid="Login"]').click();

    // Check if the user is redirected to the dashboard page
    cy.url().should('include', '/');
  })

})