beforeEach('reset and create one user and one blog', function () {
  cy.request('POST', 'http://localhost:3003/api/testing/reset');

  const testUser = {
    username: 'zoe',
    name: 'zoe saldana',
    password: 'love2code',
  };

  const testBlog = {
    title: 'test',
    author: 'randomperson',
    url: 'test.com',
    likes: 0,
    user: {
      username: 'zoe',
    },
  };

  // Create a user and get the token  to create a blog
  cy.request('POST', 'http://localhost:3003/api/users', testUser)
    .its('body')
    .then((user) => {
      const loginCredentials = {
        username: testUser.username,
        password: testUser.password,
      };

      cy.request('POST', 'http://localhost:3003/api/login', loginCredentials)
        .its('body')
        .then((body) => {
          const token = body.token;

          // Send the testBlog with Authorization header
          cy.request({
            method: 'POST',
            url: 'http://localhost:3003/api/blogs',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: testBlog,
          });
        });
    });
});

describe('login form', () => {
  it('Login form can be opened', function () {
    cy.visit('http://localhost:3000');
    cy.contains('login').click();
  });
});

describe('Blog app log in tests', () => {
  beforeEach('visits page', function () {
    cy.visit('http://localhost:3000');
    cy.contains('login');
    cy.contains('Blogs');
    cy.contains('login').click();
  });

  it('login form can be opened', function () {
    cy.contains('username');
    cy.contains('password');
    cy.contains('login');
  });

  it('login fails with wrong credentials', function () {
    cy.get('.username').type('zoe');
    cy.get('.password').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    cy.contains('invalid username or password');
  });

  it('login succesful with right credentials', function () {
    cy.get('.username').type('zoe');
    cy.get('.password').type('love2code');
    cy.get('button[type="submit"]').click();
    cy.contains('zoe saldana logged in');
  });
});

describe('home page functionality', () => {
  beforeEach('visits page', function () {
    cy.visit('http://localhost:3000');
    cy.contains('login');
    cy.contains('Blogs');
    cy.contains('login').click();
    cy.get('.username').type('zoe');
    cy.get('.password').type('love2code');
    cy.get('button[type="submit"]').click();
    cy.contains('zoe saldana logged in');
  });

  it('users homepage is shown with blogs', function () {
    cy.get('.blog').should('have.length.greaterThan', 0);
    cy.get('.blog').each((blog) => {
      cy.wrap(blog).find('.blogTitle').should('be.visible');
    });
  });

  it('blog information can be viewed', function () {
    cy.get('.viewHidden').click();
    cy.get('.url').should('be.visible');
    cy.get('.likes').should('be.visible');
    cy.get('.username').should('be.visible');
  });

  it.only('blog information can be hidden', function () {
    cy.get('.viewHidden').click();
    cy.get('.hide').click();
    cy.get('.blog').should(($blog) => {
      // Use find() to select child elements that match the given selector
      const blogTitlesInViewHidden = $blog.find('.blogTitle');

      // Assert that there is exactly one matching child element
      expect(blogTitlesInViewHidden).to.have.length(1);
    });
  });

  it('blog can be liked', function () {});

  it('blog can be removed and warning shown, then deletion cancelled', function () {});

  it('blog can be removed and warning shown, then confirmed', function () {});

  it('blog can be created', function () {});
});
