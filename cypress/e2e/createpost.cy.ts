describe('Create Post Page', () => {
    beforeEach(() => {
        // Navigate to the create post page before each test
        cy.visit('/post');
    })


    it('should display the create post form', () => {
        // Check if the create post form is displayed
        cy.contains('Drag and drop your cover picture or click to select a file').should('be.visible');
        cy.get('input[name="title"]').should('be.visible');
        cy.get('input[name="tags"]').should('be.visible');
        cy.get('textarea[name="content"]').should('be.visible');
        cy.get('[data-testid="Upload Post"]').should('be.visible');
    });

    it('should display validation errors for invalid input', () => {
        // Attempt to submit the form with invalid data
        cy.get('input[name="title"]').clear()
        cy.get('input[name="tags"]').clear()
        cy.get('textarea[name="content"]').clear()
        cy.get('[data-testid="Upload Post"]').click();

        // Check for validation error messages
        cy.contains('Please fill in all fields and select a file.').should('be.visible');
    });

    it('should upload a post successfully when all fields are filled', () => {
        // Simulate file upload
        const fileName = 'test-image.jpg';
        cy.get('input[type="file"]').attachFile(fileName);
    
        // Fill out the title
        cy.get('input[name="title"]').type('Test Post Title');
    
        // Fill out the tags
        cy.get('input[name="tags"]').type('test, cypress');
    
        // Fill out the markdown content
        cy.get('textarea[name="content"]').type('This is a **bold** statement!');
    
        // Mock the API response for the image upload
        cy.intercept('POST', '/api/upload', {
          statusCode: 200,
          body: { fileURL: 'http://localhost:3000/images/test-image.jpg' }
        }).as('imageUpload');
    
        // Mock the API response for the post submission
        cy.intercept('POST', '/api/post', {
          statusCode: 200,
          body: { message: 'Post uploaded successfully!' }
        }).as('postUpload');


        cy.get('[data-testid="Upload Post"]').should('not.be.disabled');
    
        // Submit the form
        cy.get('[data-testid="Upload Post"]').click();
    
        // Check that the toast success message is displayed
        cy.contains('Post uploaded successfully!').should('be.visible');
    
        cy.wait(8000);
        // Ensure the form redirects to the all posts page
        cy.url().should('include', '/allposts');
      });
})