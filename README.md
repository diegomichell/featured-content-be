## Description

Wikipedia Featured Content Api Proxy developed with NestJS

## Installation

```bash
$ yarn install
```

## Setup env variables
Copy the content of `.env.example` into `.env` and set the value for `LIBRE_TRANSLATE_API_KEY` with your provided api key

## Running the app

```bash
# Before running the any of the "start" commands make sure the database service is running
$ yarn run docker:up:db

# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Running the app with Docker

```bash
# To initialize only the database service
$ yarn run docker:up:db

# To create a production build of the app and initialize all services
$ yarn run docker:up:db:all
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Stay in touch

- Author - [Diego Ivan Perez Michel](https://www.linkedin.com/in/diego-ivan-perez-michel/)

