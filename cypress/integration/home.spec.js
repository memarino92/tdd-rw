describe('Renders the homepage successfully', () => {
  it('can navigate to the home page', () => {
    cy.visit('localhost:8910')
  })

  it('contains the word "Home"', () => {
    cy.visit('localhost:8910')

    cy.contains('Home')
  })
})
