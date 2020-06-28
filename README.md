# PicCollage Assignment 2: Building Shorten URL service

[Design Document]((https://bit.ly/2YrFNZr))

README Outline:

* System Requirements
* Quick Start
* Service API
* Project Structure
* Testing

## System Requirements

* [Docker](https://www.docker.com/)
    * Required, we use `docker-compose` to start the whole system.
* [Node.js](https://nodejs.org/) 8+
    * Optional, if we want to run unit and integration tests locally.

## Quick Start

```bash
# In project root folder, execute:
docker-compose up

# When service is ready, we will see:
shorten-url-service_1  | > piccollage-problem2-shorten-url@1.0.0 start /usr/app
shorten-url-service_1  | > node ./index.js
shorten-url-service_1  |
shorten-url-service_1  | {"message":"Shorten URL service is listening on port 8080!","level":"info"}

# Service endpoint: http://localhost:8080
```

## Service API

### Shorten a URL [POST] /shorten

**Request**

```bash

curl -X POST http://localhost:8080/shorten \
  -H 'content-type: application/json' \
  -d '{
	"originalUrl": "https://piccollage.com/"
}'
```

Body Fields:

* `originalUrl` (Required)
    * Type: `String`
    * MaxLength: 512
    * Example: `"https://piccollage.com/"`

**200 Response**

```jsonc
{
    "shortenedUrl": "http://localhost:8080/Yv"
}
```

**400 Response**

Missing required fields or content is invalid.

```jsonc
{
    "code": 400,
    "message": "should have required property 'originalUrl'"
}
```

### Redirect [GET] /:shortenedPath

**Request**

```bash
curl -X GET http://localhost:8080/Yv 
```

**Response 301**

Headers:

```bash
Location: https://piccollage.com/
```

**Response 404**

```jsonc
{
    "code": 404,
    "message": "Shortened url not found!"
}
```

## Project Structure

Source Code:

```bash
.
├── config/                      # service config
├── src/
│  ├── components/
│  │  └── urlPairs/              # url pairing
│  │     ├── UrlPair.js          #  - class
│  │     ├── UrlPairCache.js     #  - cache
│  │     └── UrlPairDAL.js       #  - data access layer
│  ├── middlewares/              # service middlewares
│  │  ├── appErrorHandler.js     #  - handle errors and build response
│  │  └── requestValidator.js    #  - validate request content
│  ├── repositories/             # build database connection
│  ├── routes/                   # routing
│  │  ├── index.js               #  - entry 
│  │  ├── redirect.js            #  - redirect shortened URL
│  │  └── shorten.js             #  - shorten a URL
│  ├── util.js                   # service utils
│  │  ├── AppError.js            #  - service error class
│  │  └── logger.js              #  - mature logger
│  └── index.js                  # web layer entry
├── index.js                     # main entry
└── package.json                 # service dependencies
```

Testing and Infrastructure:

```bash
.
├── localDBInit/                 # .sql files for initializing MySQL
├── seeds/                       # seed data for integration test
├── test/                        # all test cases
├── docker-compose.yml           # we use docker-compose to run our service, cache, and database.
├── Dockerfile                   # building service image
├── knexfile.js                  # database connection config for integration test
├── integrationSetup.js          # setup testing environment before integration test
├── jest.config.js               # global test config
├── jest.config.integration.js   # integration test config
└── jest.config.unit.js          # unit test config
```

## Testing

All test cases are located under `test/`

Each test case includes 3 parts in description and structure by the AAA pattern.

For example:

```javascript
// Part 1: What is being tested?
describe('[Integration][Route][POST] /shorten', () => {
  // Part 2 & 3: Under what circumstances and what is the expected result?
  test('Shorten a new url, after response, check database and compare with response', async () => {
    // Arrange
    const originalUrl = 'http://shorten.int.test/shorten/a/new/url'

    // Act
    const { body: result } = await request(app)
      .post('/shorten')
      .send({ originalUrl })
      .expect(200)

    // Assert
    expect(result).toHaveProperty('shortenedUrl')
    // ...
    expect(urlPairFromDB.originalUrl).toBe(originalUrl)
  })
})
```

Run tests locally:

```bash
# prerequisite
docker-compose up
npm install

# run all tests (checking code style, unit tests, integration tests)
npm test

# run unit tests only
npm run unit

# run integration tests only
npm run integration
```

We should see the test results in the console, and it will be like:

```bash
 PASS  test/routes/redirect.int.test.js
  [Integration][Route][GET] /:shortenedPath
    ✓ urlPair exists, response should be 301, check database and compare with response (69 ms)
    ✓ urlPair does not exist, response should be 404 (12 ms)
```

And the test report will be like:

```bash
-------------------------|---------|----------|---------|---------|-------------------
File                     | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------------|---------|----------|---------|---------|-------------------
All files                |   91.19 |    69.09 |   91.18 |   92.31 |                   
 config                  |   78.57 |    83.33 |       0 |   84.62 |                   
  index.js               |   57.14 |    83.33 |       0 |   66.67 | 31-32             
  schema.js              |     100 |      100 |     100 |     100 |                   
 src                     |     100 |      100 |     100 |     100 |                   
  index.js               |     100 |      100 |     100 |     100 |                   
 src/components/urlPairs |   90.48 |    85.71 |     100 |   90.36 |                   
  UrlPair.js             |     100 |      100 |     100 |     100 |                   
  UrlPairCache.js        |   89.66 |      100 |     100 |   89.66 | 19,33,48          
  UrlPairDAL.js          |   90.38 |       80 |     100 |    90.2 | 28,51,69,105,116  
...               
-------------------------|---------|----------|---------|---------|-------------------
Test Suites: 5 passed, 5 total
Tests:       22 passed, 22 total
Snapshots:   0 total
Time:        3.958 s
Ran all test suites.
```