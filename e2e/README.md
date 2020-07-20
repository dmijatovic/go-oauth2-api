# E2E oauth2 api test with Cypress

This folder holds e2e tests of oauth2. The tests are automated with Cypress. The approach used is based on [this article](https://mtlynch.io/painless-web-app-testing/).

The test should be runned in docker containers using docker-compose.

```bash
# go to e2e folder
cd e2e
# run docker compose and use cypress exit code
docker-compose up --exit-code-from cypress
# run from the root of the project
docker-compose -f docker-compose-test.yml up --exit-code-from cypress
```
