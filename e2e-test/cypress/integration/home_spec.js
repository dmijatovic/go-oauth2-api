/// <reference types="Cypress" />

describe('home page',()=>{
  it('Opens home page',()=>{
    cy.visit("/")
    cy.get('h1')
      .should('contain','oAuth2 API in Golang')
  })
})