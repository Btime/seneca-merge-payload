# seneca-merge-payload

This package is responsible for formatting the queries used by Entity micro service, which uses Sequelize.js.

It's used through **query string** in a given **HTTP GET** request. Example: `https://api.btime.io/requestOptions={"filters":{"filterName":"filterValue"}}`

## Table of Contents

1. [Setup](#setup)
    1. [Installing](#installing)
1. [Usage](#usage)
    1. [Installing](#installing)
    1. [Example of Requests](#example-of-requests)
1. [Tests](#tests)

## Setup

### Installing

```bash
npm i
```
## Usage

### Installing

```bash
npm i Btime/seneca-merge-payload -S
```

### Example of Requests

- **Using filter for only one `customer.name` - Service Order:**

```
GET /service-orders?requestOptions=
{"filters":{"customer.name": "teste bruno"}}
```

- **Using like by `yearlyId` or `customer.name`, fields, paginate and ordination - Service Order:**

```
GET /service-orders?requestOptions=
{"fields":["id","yearlyId","scheduling","createdAt","updatedAt"],
"paginate":{"limit":10,"page":1},
"ordination":{"field":"customer.name","type":"DESC"},
"like":{"yearlyId": "000002/18","customer.name":"teste bruno"},
"likeOperator":"or"}
```

- **Using like by `yearlyId` and `customer.name`, fields, paginate and ordination - Service Order:**

```
GET /service-orders?requestOptions=
{"fields":["id","yearlyId","scheduling","createdAt","updatedAt"],
"paginate":{"limit":10,"page":1},
"ordination":{"field":"customer.name","type":"DESC"},
"like":{"yearlyId": "000002/18","customer.name":"teste bruno"},
"likeOperator":"and"}
```

**Obs.:** When using `like` the default behavior uses `and` operator when more than one field is used.

- **Using filters of `serviceStatus.name`, fields, paginate, ordination and like - Service Order:**

```
GET /service-orders?requestOptions=
{"fields":["id","yearlyId","scheduling","createdAt","updatedAt"],
"filters":{"serviceStatus.name":["canceled"]},
"paginate":{"limit":10,"page":1},
"ordination":{"field":"customer.name","type":"DESC"},
"like":{"yearlyId": "000002/18","customer.name":"teste bruno"},
"likeOperator":"or"}
```

- **Using filters of `serviceStatus.name` with more than one item, fields, paginate, ordination and like - Service Order:**

```
GET /service-orders?requestOptions=
{"fields":["id","yearlyId","scheduling","createdAt","updatedAt"],
"filters":{"serviceStatus.name":["canceled","open"]},
"paginate":{"limit":10,"page":1},
"ordination":{"field":"customer.name","type":"DESC"},
"like":{"yearlyId": "000002/18","customer.name":"teste bruno"},
"likeOperator":"or"}
```

- **Using filters of `customer.name` with more than one item, fields, paginate and ordination - Service Order:**

```
GET /service-orders?requestOptions=
{"fields":["id","yearlyId","scheduling","createdAt","updatedAt"],
"filters":{"customer.name":["teste bruno", "teste"]},
"paginate":{"limit":10,"page":1},
"ordination":{"field":"customer.name","type":"DESC"}}
```

- **Using filters of `createdAt` between two dates, fields, paginate and ordination - Service Order:**

```
GET /service-orders?requestOptions=
{"fields":["id","yearlyId","scheduling","createdAt","updatedAt"],
"filters":{"createdAt":["2018-01-01", "2018-08-08"]},
"paginate":{"limit":10,"page":1},
"ordination":{"field":"customer.name","type":"DESC"}}
```

- **Using filters of `lastLogin` between two dates, fields, paginate and ordination - User:**

```
GET /users?requestOptions=
{"fields":["id","name","email","createdAt","updatedAt"],
"filters":{"lastLogin":["2018-01-01", "2018-08-10"]},
"paginate":{"limit":10,"page":1},
"ordination":{"field":"name","type":"DESC"}}
```

## Tests

```bash
$ npm test
```

- Running tests with coverage in terminal:

```bash
$ npm run coverage
```

- Running tests with coverage in HTML:

```bash
$ npm run htmlCoverage
```
