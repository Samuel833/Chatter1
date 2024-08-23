describe('Reset Password Page', () => {
    beforeEach(() => {
      cy.visit('/reset-password?token=ec813b9d-fcd4-4477-8a3b-0949b8f04e61'); //! Replace with the correct route to your ResetPasswordPage
    });
  
    it('should display the reset password form', () => {
      cy.get('h1').should('contain.text', 'Reset Password');
      cy.get('input[type="password"]').should('have.length', 2);
      cy.get('button[type="submit"]').should('exist');
    });
  
    it('should show an error if passwords do not match', () => {
      cy.get('input[placeholder="New Password"]').type('newpassword');
      cy.get('input[placeholder="Confirm New Password"]').type('differentpassword');
      cy.get('button[type="submit"]').click();
  
      cy.get('.bg-red-500').should('contain.text', 'Passwords do not match.');
    });
  
    it('should reset the password and redirect to login on success', () => {
      cy.intercept('POST', '/api/auth/reset-password', {
        statusCode: 200,
        body: { message: 'Password reset successfully' },
      }).as('resetPasswordRequest');
  
      cy.get('input[placeholder="New Password"]').type('newpassword');
      cy.get('input[placeholder="Confirm New Password"]').type('newpassword');
      cy.get('button[type="submit"]').click();
  
      cy.wait('@resetPasswordRequest');

      cy.wait(8000); // Wait for the message to be displayed

      cy.url().should('include', '/login');
    });
  
    it('should show an error message on failed password reset', () => {
      cy.intercept('POST', '/api/auth/reset-password', {
        statusCode: 400,
        body: { message: 'Failed to reset password' },
      }).as('resetPasswordRequest');
  
      cy.get('input[placeholder="New Password"]').type('newpassword');
      cy.get('input[placeholder="Confirm New Password"]').type('newpassword');
      cy.get('button[type="submit"]').click();
  
      cy.wait('@resetPasswordRequest');
      cy.get('.bg-red-500').should('contain.text', 'Failed to reset password. Please try again.');
    });
  
  });
  