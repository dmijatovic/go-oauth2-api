/// <reference types="Cypress" />

const user={
  email:"demo.user@gmail.com",
  password:"password"
}
let token=""

describe("/users",()=>{
  before(()=>{
    cy.request({
      method:"POST",
      url: "/login",
      body:user,
      failOnStatusCode: false
    }).then(resp=>{
      expect(resp).to.have.property('status',200)
      expect(resp.body).to.have.property('payload')
      expect(resp.body.payload).to.have.property('access_token')
      // we pass token for validation
      token = resp.body.payload['access_token']
    })
  })
  it('GET users returns 403 if no valid token provided',()=>{
    cy.request({
      method:"GET",
      url: "/users",
      // headers:{
      //   "Authorization":`Bearer ${token}`
      // },
      failOnStatusCode: false
    }).then(resp=>{
      expect(resp).to.have.property('status',403)
    })
  })
  it('GET returns array of users',()=>{
    cy.request({
      method:"GET",
      url: "/users",
      headers:{
        "Authorization":`Bearer ${token}`
      },
      failOnStatusCode: false
    }).then(resp=>{
      // console.log("response...", resp)
      expect(resp).to.have.property('status',200)
      expect(resp.body).to.have.property('payload')
      expect(Array.isArray(resp.body.payload)).to.equal(true)
    })
  })
  it('Add (POST),update (PUT) and delete new user',()=>{
    const newUser={
      "roles":"admin,user",
      "first_name":"Cypress",
      "last_name":"Testuser",
      "email":"cypress.test@gmail.com",
      "password":"password",
      "birth_date":"1970-11-25"
    }
    cy.request({
      method:"POST",
      url: "/users",
      headers:{
        "Authorization":`Bearer ${token}`
      },
      body: newUser,
      failOnStatusCode: false
    }).then(resp=>{
      // console.log("response...", resp)
      expect(resp).to.have.property('status',200)
      expect(resp.body).to.have.property('payload')
      expect(resp.body.payload).to.have.property('id')
      return resp.body.payload
    }).then(user=>{
      user.first_name="Changed name"
      return cy.request({
        method:"PUT",
        url: "/users",
        headers:{
          "Authorization":`Bearer ${token}`
        },
        body: user,
        failOnStatusCode: false
      })
    }).then(resp=>{
      expect(resp).to.have.property('status',200)
      expect(resp.body).to.have.property('payload')
      expect(resp.body.payload).to.have.property('first_name')
      expect(resp.body.payload['first_name']).to.equal("Changed name")
      const id = resp.body.payload['id']
      return cy.request({
        method:"DELETE",
        url: "/users",
        headers:{
          "Authorization":`Bearer ${token}`
        },
        body: {id},
        failOnStatusCode: false
      })
    }).then(resp=>{
      expect(resp).to.have.property('status',200)
      expect(resp.body).to.have.property('payload')
      expect(resp.body.payload).to.have.property('id')
    })
  })
})