# oAuth2 Authorisation Server in Go

This demo project uses basis Go database/sql module and official pg driver for postgres and users storage. It supports basic CRUD operations on users.

The intention is to create simple api with less as possible dependencies, so we use:

- basic go database module and postgres driver
- basic go http router (defaul mux)
- encode/json for json marshaling
- bcrypt module for password hashing

This results in the images with minimal footprint:

- goauth2 server image is ca. 15MB
- postgres uses alpine image with footprint of 157MB

I did [similair approach with NodeJS](https://github.com/dmijatovic/ts-polka-oauth) using Polka web server and PotsgreSQL. The footpring of NodeJS solution is larger. The minimum image size I achived is 40MB for web server. In the NodeJS solution I also used NGINX as reverse proxy and potentialy as SSL provider. For Go it seems that all can be implemented within Go which I plan to do later :-).

## Usage

This server can be used via docker-compose file.

`docker-compose up -d` to run server on localhost:8080 in detached mode.
`docker-compose down` to stop the service.

For more information about the setup and the project itself see the rest of README.

### API points

The following api points are available (by default on localhost:8080).

- `\` (GET): home route with simple static html
- `\login` (POST): login route defined in routes\login.go file
- `\verify` (GET,POST): jwt verification point
- `\users` (GET,POST,PUT,DELETE): CRUD user management. Protected routes. Defined in `routes\users.go` file

### CI/CD

This project uses Github actions for e2e testing and building Docker container.

Every push to master branch (or pull request) will run cypress e2e test.

To publish new version to Docker Hub push to docker branch to run docker action.

## Requirements

This module depends on Postgres database. The postgres container is included in the docker-compose file. User table is created on initialization of postgres container. The database connection parameters are defined in oauth2.env file. Defaults should work out-of-the-box when using docker-compose file.

### Users table

This module expects users table with the structure as defined below. The table is defined in init.sql of postgres folder. The inital user is `demo.user@gmail.com` and the password is `password`. Note that password value is hashed using bcrypt.

```sql
CREATE TABLE users (
  id uuid DEFAULT public.uuid_generate_v4(),
  roles character varying(100) NOT NULL,
  first_name character varying(100) NOT NULL,
  last_name character varying(100) NOT NULL,
  email character varying(100) NOT NULL CHECK (length(email)>5),
  password character varying(255) NOT NULL CHECK (length(password)>5),
  birth_date date NOT NULL,
  createdate date DEFAULT CURRENT_DATE NOT NULL,
  PRIMARY KEY (email)
);
```

## Environment variables

All required settings are included in env file oauth2.env and are used by docker-compose. In the app code default values are defined which are equal to values shown here.

```env
# go oauth2
OAUTH2_HOST=:8080

# postgres db
PG_HOST=pgdb
PG_PORT=5432
PG_USER=postgres
PG_PASS=changeme
PG_DB=oauth_db

# jwt
JWT_EXP_TIME_SEC=120
JWT_KEY=01545c0cdd271a8177bea35d4d4b0517

#bcrypt
SALT_ROUNDS=7
```

## Folder stucture

There are some ideas about MVC structure but I am inclined using a custom structure:

- e2e: end-to-end testing with cypress using docker-compose-test.yml
- logger: basic logger middleware to log request
- password: module resposible for hashing the passwords. bcrypt is used.
- pgdb: module responsible for postgres database connection and models
- postgres: folder for Postgres Docker container definitions
- response: defines api response structure
- routes module: container routes and calls appropriate method in models
- token: module for signing and verifying JWT.
- utils: utility functions. Currently only one for extracting env variables.
- views: static index.html page for root of the api

## Dependencies

These modules need to be installed if you do not have them already

```bash
# pg driver
go get github.com/lib/pq
# bcrypt
go get golang.org/x/crypto/bcrypt
# jwt-go
go get github.com/dgrijalva/jwt-go

```

## Golang remarks/learnings

- json backticks definitions need to be enclosed with "" and no spaces between `json:` and value.

```go
// ServerStatus is send as part of api response
// this is quite similair how axios responds
type ServerStatus struct {
 Status     int    `json:"status"`
 StatusText string `json:"statusText"`
}

```

- json ignore field use `json:"-"`
- private/Public methods, functions and properties in Go are defined by first letter. If it is Capital then method or property is Public, if it start with smallCase it is private.
- Response Headers can be added with method Add. This need to be done BEFORE setting return status code using WriteHeader method. If not the Header value will not be written back to consumer!!!

```go
// ReturnResponse will return response to api consumer
// including the status code
// NOTE! When setting header values, this need to be
// done before setting status using WriteHeader!!!
func (r *Response) ReturnResponse(rw http.ResponseWriter) {
 // set content-type
 rw.Header().Add("content-type", "application/json")
 rw.Header().Add("x-server", "dv4all-basic-go-http-server")
 // SET ALL HEADER PROPS BEFORE setting state
 // NOTE! GO requirement
 rw.WriteHeader(r.Status)
 // log.Println(rw)
 json.NewEncoder(rw).Encode(r)
}
```

## Deployment

We deploy using Docker and docker-compose. Go app is build using Dockerfile in the root of the app. We build oauth2-api executable in the container using golang-alpine image. We run app in the apline container. Potgres is also runned in apline container.

First version of compiled app was about 9MB size.

```bash
# build go app
go build -o=goauth2
# build Dockerfile
docker build . -t dv4all/go-oauth:0.0.1
```

### Go modules

Building Go app did not work properly in Docker. Third party libraries were not found. I needed to create module app.

In generall module names use refrence to github repo something like this:
**github.com/dmijatovic/go-concepts/oauth2-api**. In this example I simply used shorter name to see is there any problems/difference?!?

I then runned `go mod tidy` which added dependecies used in the scripts into my go.mod definition file.

```bash
# intialize module
go mod init dv4all/goauth2

# update 3rd party dependecies
# this will add/remove dependencies of the module
go mod tidy
```
