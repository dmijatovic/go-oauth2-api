/// <reference types="Cypress" />

const user={
  email:"demo.user@gmail.com",
  password:"password"
}

describe('/verify',()=>{
  it('POST to login returns valid access_token',()=>{
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
      return resp.body.payload['access_token']
    }).then(token=>{
      // console.log("token passed in:", token)
      return cy.request({
        method:"GET",
        url: "/verify",
        headers:{
          "Authorization":`Bearer ${token}`
        },
        failOnStatusCode: false
      })
    }).then(resp=>{
      // console.log("response...", resp)
      expect(resp).to.have.property('status',200)
      expect(resp.body).to.have.property('payload')
      expect(resp.body.payload).to.have.property('access_token')
    })
  })
  it('GET to verify returns 403 when token is expired',()=>{
    // OLD expired token
    const token ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9maWxlIjp7ImlkIjoiOTI2M2QzMDQtOTEyZS00MTE1LWI1ZGEtM2RjZDkzODU0NTljIiwicm9sZXMiOiJ1c2VyLGFkbWluIiwiZmlyc3RfbmFtZSI6IkRlbW8iLCJsYXN0X25hbWUiOiJVc2VyIiwiZW1haWwiOiJkZW1vLnVzZXJAZ21haWwuY29tIn0sImF1ZCI6InVzZXIsYWRtaW4iLCJleHAiOjE1OTUxODEwMjYsImp0aSI6IjkyNjNkMzA0LTkxMmUtNDExNS1iNWRhLTNkY2Q5Mzg1NDU5YyIsImlhdCI6MTU5NTE4MDkwNiwiaXNzIjoiZHY0YWxsLW9hdXRoMi1nby1zZXJ2aWNlIiwic3ViIjoiRGVtbyBVc2VyIn0.vu9RfRstc7suO-Hx7UI4Xv79nQ-JLIIOln5HwBWNTbE'
    cy.request({
      method:"GET",
      url: "/verify",
      headers:{
        "Authorization":`Bearer ${token}`
      },
      failOnStatusCode: false
    }).then(resp=>{
      expect(resp).to.have.property('status',403)
    })
  })
  it('GET to verify returns 403 if token not in the header',()=>{
    cy.request({
      method:"GET",
      url: "/verify",
      failOnStatusCode: false
    }).then(resp=>{
      expect(resp).to.have.property('status',403)
    })
  })
})