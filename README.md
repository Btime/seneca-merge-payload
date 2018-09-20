# seneca-merge-payload

This package is responsible for formatting the queries used by Entity micro service, which uses Sequelize.js

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

## Examples of Requests

- **Using like by `yearlyId` or `customer.name`, fields, paginate and ordination - Service Order:**

```
https://v2api.btime.com.br/service-orders?requestOptions=
{"fields":["id","yearlyId","scheduling","createdAt","updatedAt"],
"paginate":{"limit":10,"page":1},
"ordination":{"field":"customer.name","type":"DESC"},
"like":{"yearlyId": "000002/18","customer.name":"teste bruno"},
"likeOperator":"or"}
```

- **Using like by `yearlyId` and `customer.name`, fields, paginate and ordination - Service Order:**

```
https://v2api.btime.com.br/service-orders?requestOptions=
{"fields":["id","yearlyId","scheduling","createdAt","updatedAt"],
"paginate":{"limit":10,"page":1},
"ordination":{"field":"customer.name","type":"DESC"},
"like":{"yearlyId": "000002/18","customer.name":"teste bruno"},
"likeOperator":"and"}
```

**Obs.:** When using `like` the default behavior uses `and` operator when more than one field is used.

- **Using filters of `serviceStatus.name`, fields, paginate, ordination and like - Service Order:**

```
https://v2api.btime.com.br/service-orders?requestOptions=
{"fields":["id","yearlyId","scheduling","createdAt","updatedAt"],
"filters":{"serviceStatus.name":["canceled"]},
"paginate":{"limit":10,"page":1},
"ordination":{"field":"customer.name","type":"DESC"},
"like":{"yearlyId": "000002/18","customer.name":"teste bruno"},
"likeOperator":"or"}
```

- **Using filters of `serviceStatus.name` with more than one item, fields, paginate, ordination and like - Service Order:**

```
https://v2api.btime.com.br/service-orders?requestOptions=
{"fields":["id","yearlyId","scheduling","createdAt","updatedAt"],
"filters":{"serviceStatus.name":["canceled","open"]},
"paginate":{"limit":10,"page":1},
"ordination":{"field":"customer.name","type":"DESC"},
"like":{"yearlyId": "000002/18","customer.name":"teste bruno"},
"likeOperator":"or"}
```

- **Using filters of `customer.name` with more than one item, fields, paginate and ordination - Service Order:**

```
https://v2api.btime.com.br/service-orders?requestOptions=
{"fields":["id","yearlyId","scheduling","createdAt","updatedAt"],
"filters":{"customer.name":["teste bruno", "teste"]},
"paginate":{"limit":10,"page":1},
"ordination":{"field":"customer.name","type":"DESC"}}
```

- **Using filters of `createdAt` between two dates, fields, paginate and ordination - Service Order:**

```
https://v2api.btime.com.br/service-orders?requestOptions=
{"fields":["id","yearlyId","scheduling","createdAt","updatedAt"],
"filters":{"createdAt":["2018-01-01", "2018-08-08"]},
"paginate":{"limit":10,"page":1},
"ordination":{"field":"customer.name","type":"DESC"}}
```

- **Using filters of `lastLogin` between two dates, fields, paginate and ordination - User:**

```
https://v2api.btime.com.br/users?requestOptions=
{"fields":["id","name","email","createdAt","updatedAt"],
"filters":{"lastLogin":["2018-01-01", "2018-08-10"]},
"paginate":{"limit":10,"page":1},
"ordination":{"field":"name","type":"DESC"}}
```
