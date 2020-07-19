/// <reference types="Cypress" />

// const url="http://localhost:8080/login"

const user={
  email:"demo.user@gmail.com",
  password:"password",
  token: null
}

describe('/login',()=>{

  it('GET Returns bad request',()=>{
    cy.request({
      url:"/login",
      failOnStatusCode: false
    }).then(resp=>{
      expect(resp).to.have.property('status',400)
    })
  })

  it('POST to login without body returns 400',()=>{
    cy.request({
      method:"POST",
      url:"/login",
      failOnStatusCode: false
    }).then(resp=>{
      expect(resp).to.have.property('status',400)
    })
  })

  it('POST to login with dummy user returns access_token',()=>{
    cy.request({
      method:"POST",
      url:"/login",
      body:user,
      failOnStatusCode: false
    }).then(resp=>{
      expect(resp).to.have.property('status',200)
      expect(resp.body).to.have.property('payload')
      expect(resp.body.payload).to.have.property('access_token')
      // we save the token for validation
      user.token = resp.body.payload
    })
  })
})