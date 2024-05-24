# api-middleware

A [Sumor Cloud](https://sumor.cloud) Tool.  
[More Documentation](https://sumor.cloud/api-middleware)
API Middleware is a middleware for Node.JS.
It can easily expose function to api, and validate parameters

[![CI](https://github.com/sumor-cloud/api-middleware/actions/workflows/ci.yml/badge.svg)](https://github.com/sumor-cloud/api-middleware/actions/workflows/ci.yml)
[![Test](https://github.com/sumor-cloud/api-middleware/actions/workflows/ut.yml/badge.svg)](https://github.com/sumor-cloud/api-middleware/actions/workflows/ut.yml)
[![Coverage](https://github.com/sumor-cloud/api-middleware/actions/workflows/coverage.yml/badge.svg)](https://github.com/sumor-cloud/api-middleware/actions/workflows/coverage.yml)
[![Audit](https://github.com/sumor-cloud/api-middleware/actions/workflows/audit.yml/badge.svg)](https://github.com/sumor-cloud/api-middleware/actions/workflows/audit.yml)

## Installation

```bash
npm i @sumor/api-middleware --save
```

## Prerequisites

### Node.JS version

Require Node.JS version 16.x or above

### require Node.JS ES module

As this package is written in ES module,
please change the following code in your `package.json` file:

```json
{
  "type": "module"
}
```

## Usage

### Basic Usage

##### 1. Add a file named `plus.js` in your project folder `api`

```js
export default async (context, req, res) => {
  const { data } = context
  const { a, b } = data
  return a + b
}
```

##### [Optional] 2. Add a file named `plus.json` in your project folder `api`

```json
{
  "name": "plus",
  "parameters": {
    "a": {
      "name": "parameter a",
      "type": "number",
      "length": 3
    },
    "b": {
      "name": "parameter b",
      "type": "number"
    }
  }
}
```

##### 3. Add the following code in your `index.js` file

```javascript
import express from 'express'
import apiMiddleware from '@sumor/api-middleware'

const app = express()
apiMiddleware(app, process.cwd() + '/api')

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
```

##### 4. run index.js

```bash
node index.js
```
