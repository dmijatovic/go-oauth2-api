# E2E oauth2 api test with Cypress

This folder holds e2e tests of oauth2. The tests are automated with Cypress. The approach used is based on [this article](https://mtlynch.io/painless-web-app-testing/).

The test should be runned in docker containers using docker-compose.

```bash
# run from the root of the project
docker-compose -f docker-compose-e2e.yml up --exit-code-from cypress
```
