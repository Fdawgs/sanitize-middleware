# sanitize-middleware

[![GitHub Release](https://img.shields.io/github/release/Fdawgs/sanitize-middleware.svg)](https://github.com/Fdawgs/sanitize-middleware/releases/latest/) [![npm version](https://img.shields.io/npm/v/sanitize-middleware)](https://www.npmjs.com/package/sanitize-middleware) ![Build Status](https://github.com/Fdawgs/sanitize-middleware/workflows/CI/badge.svg?branch=master) [![Coverage Status](https://coveralls.io/repos/github/Fdawgs/sanitize-middleware/badge.svg?branch=master)](https://coveralls.io/github/Fdawgs/sanitize-middleware?branch=master) [![Known Vulnerabilities](https://snyk.io/test/github/Fdawgs/sanitize-middleware/badge.svg)](https://snyk.io/test/github/Fdawgs/sanitize-middleware) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

> Connect/Express middleware that sanitizes and escapes the query, params and body of requests to protect against cross-site scripting (XSS) and command injection attacks

## Installation

Install using [`npm`](https://www.npmjs.com/package/sanitize-middleware):

```bash
npm install sanitize-middleware
```

Or [`yarn`](https://yarnpkg.com/en/package/sanitize-middleware):

```bash
yarn add sanitize-middleware
```

sanitize-middleware's test scripts use npm commands.

## API

```js
const sanitizeMiddleware = require("sanitize-middleware");
```

### Options

The `sanitizeMiddleware` function takes an optional `config` object that may contain any of the following properties, mapped to the `req` object property of the same name:

-   body
-   params
-   query

Each of the above properties must be objects, with further properties as objects inside named after the properties you want to parse and sanitize from that respective request element.

```js
const exampleConfig = {
	body: {
		bodyProperty1: {},
		bodyProperty2: {},
	},
	query: {
		queryProperty1: {},
	},
	params: {
		paramsProperty1: {},
	},
};
```

Each of the object properties within `body`, `query`, and/or `params` have properties themselves:

| Property             | Type      | Description                                |
| -------------------- | --------- | ------------------------------------------ |
| mandatory (optional) | `Boolean` | Whether the property is mandatory          |
| maxLength (optional) | `Number`  | The maximum accepted length of a property  |
| type (required)      | `String`  | The expected type of the received property |

## Examples

If no options are provided to the middleware, the middleware will accept every property found in the `body`, `query`, and `params` object properties of a `req` and then attempt to derive the type before sanitizing.

```js
const sanitizeMiddleware = require("sanitize-middleware");
const express = require("express");
const app = express();

app.use(sanitizeMiddleware());
```

With options provided, if a received property that is mandatory is missing, is the wrong type, or is longer than the max length, an error will be passed to `next()` to be handled by your error handler middleware.

```js
const sanitizeMiddleware = require("sanitize-middleware");
const express = require("express");
const app = express();

// localhost:8204/test?id=hello&status=current would throw an error as type of the id query key is wrong
// localhost:8204/test?id=1 would throw an error as the mandatory status query key is missing
// localhost:8204/test?subject=bananas would throw an error as the length is greater than the maxLength allowed
const options = {
	query: {
		status: { type: "string", mandatory: true },
		type: { type: "string", mandatory: false },
		id: { type: "number", mandatory: false },
		specialty: { type: "string", mandatory: false },
		subject: { type: "string", mandatory: false, maxLength: 5 },
	},
};

app.use(sanitizeMiddleware(options));
```

The `mandatory` property is optional, if not present it is assumed a received property matching its parent key name is not mandatory.

```js
const sanitizeMiddleware = require("sanitize-middleware");
const express = require("express");
const app = express();

const options = {
	query: {
		specialty: { type: "string", mandatory: false },
		subject: { type: "string", mandatory: false },
	},
	params: {
		id: { type: "string" },
	},
};

app.use(sanitizeMiddleware(options));
```

## Contributing

Please see [CONTRIBUTING.md](https://github.com/Fdawgs/sanitize-middleware/blob/master/CONTRIBUTING.md) for more details regarding contributing to this project.

## License

`sanitize-middleware` is licensed under the [MIT](https://github.com/Fdawgs/sanitize-middleware/blob/master/LICENSE) license.
