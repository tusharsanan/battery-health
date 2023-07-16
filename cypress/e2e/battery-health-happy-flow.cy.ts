describe('Battery health status: happy flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the dashboard page to list all the academies', () => {
    cy.url().should('include', '/dashboard');
    cy.get('.dashboard__academy').should('have.length', 5);
  });

  it('should sort the academies based on the number of battery issues they have', () => {
    cy.get('.dashboard__academy').first().should('have.class', 'high');
    cy.get('.dashboard__academy h3').first().contains('30015');
  });

  it('should display the total number of unhealthy batteries next to the academy number', () => {
    cy.get('.dashboard__academy').first().should('have.class', 'high');
    cy.get('.dashboard__academy h3').eq(3).contains('30006 (3)');
  });

  it('should display the legend at the bottom of the page', () => {
    cy.get('aside').should('be.visible');
    cy.get('.dashboard--legend').should('have.length', 3);
  });

  it('should show the unhealthy batteries on click of a particular academy', () => {
    cy.get('.dashboard__academy').eq(3).click();
    cy.url().should('include', '/academy-details?academyId=30006');
    cy.get('.academy_details--unhealthy_batteries_block').should('be.visible');
    cy.get('.academy_details--unhealthy_batteries_block ul li').should(
      'have.length',
      3
    );
  });

  it('should show the healthy batteries on click of a particular academy', () => {
    cy.get('.dashboard__academy').eq(3).click();
    cy.url().should('include', '/academy-details?academyId=30006');
    cy.get('.academy_details--healthy_batteries_block').should('be.visible');
    cy.get('.academy_details--healthy_batteries_block ul li').should(
      'have.length',
      7
    );
  });

  it('should go back to the dashboard page if the academy details page is refreshed', () => {
    cy.get('.dashboard__academy').eq(2).click();
    cy.url().should('include', '/academy-details?academyId=30019');
    cy.reload();
    cy.url().should('include', '/dashboard');
  });
});
