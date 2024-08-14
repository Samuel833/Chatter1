describe('Forgot Password Page', () => {
    beforeEach(() => {
      cy.visit('/forgot-password'); // Replace with the correct route to your ForgotPasswordPage
    });
  
    it('should display the forgot password form', () => {
      cy.get('h1').should('contain.text', 'Forgot Password');
      cy.get('input[type="text"]').should('exist');
      cy.get('button[type="submit"]').should('exist');
    });
  
    it('should show an error message if the email is invalid', () => {
      cy.intercept('POST', '/api/auth/forgot-password', {
        statusCode: 400,
        body: { message: 'Invalid email address' },
      }).as('forgotPasswordRequest');
  
      cy.get('input[type="text"]').type('invalidemail');
      cy.get('button[type="submit"]').click();
  
      cy.get('.bg-red-500').should('contain.text', 'Failed to send reset email');
    });
  
    it('should send a reset email and show success message', () => {
      cy.intercept('POST', '/api/auth/forgot-password', {
        statusCode: 200,
        body: { message: 'Reset link sent to your email address' },
      }).as('forgotPasswordRequest');
  
      cy.get('input[type="text"]').type('user@example.com');
      cy.get('button[type="submit"]').click();
  
      cy.wait('@forgotPasswordRequest');
      cy.get('.bg-green-500').should('contain.text', 'Reset link sent to your email address');
    });
  
    it('should disable the submit button while loading', () => {
      cy.intercept('POST', '/api/auth/forgot-password', (req) => {
        req.reply((res) => {
          res.send({
            delay: 2000, // Simulate network delay
            statusCode: 200,
            body: { message: 'Reset link sent to your email address' },
          });
        });
      }).as('forgotPasswordRequest');
  
      cy.get('input[type="text"]').type('user@example.com');
      cy.get('button[type="submit"]').click();
  
      cy.get('button[type="submit"]').should('have.class', 'cursor-not-allowed');
      cy.wait('@forgotPasswordRequest');
    });
  
    it('should redirect to login page when clicking the link', () => {
      cy.get('a[href="/login"]').click();
      cy.url().should('include', '/login');
    });
  });
  