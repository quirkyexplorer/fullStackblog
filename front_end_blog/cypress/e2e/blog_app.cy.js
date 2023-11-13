describe('template spec', () => {
  beforeEach('front page can be opened', function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    const testUser = {
      username: 'testUser',
      name: 'testUser',
      password: 'testUser',
    };
    cy.request('POST', 'http://localhost:3003/api/users', testUser);
    // cy.visit('http://localhost:3000');
  });

  it('Login form is shown', function () {
    cy.visit('http://localhost:3000');
    // cy.contains('Log in');
    // cy.contains('username');
    // cy.contains('password');
    // cy.contains('login');
  });
});