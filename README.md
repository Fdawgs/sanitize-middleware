# sanitize-middleware

[![GitHub Release](https://img.shields.io/github/release/Fdawgs/sanitize-middleware.svg)](https://github.com/Fdawgs/sanitize-middleware/releases/latest/) [![npm version](https://img.shields.io/npm/v/sanitize-middleware)](https://www.npmjs.com/package/sanitize-middleware)
[![Build Status](https://travis-ci.org/Fdawgs/sanitize-middleware.svg?branch=master)](https://travis-ci.org/Fdawgs/sanitize-middleware) [![Coverage Status](https://coveralls.io/repos/github/Fdawgs/sanitize-middleware/badge.svg?branch=master)](https://coveralls.io/github/Fdawgs/sanitize-middleware?branch=master) [![Dependabot Status](https://api.dependabot.com/badges/status?host=github&identifier=244321598)](https://dependabot.com) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

> Connect/Express middleware to sanitize requests

# Installation

Install using [`yarn`](https://yarnpkg.com/en/package/sanitize-middleware):

```bash
yarn add sanitize-middleware
```

Or [`npm`](https://www.npmjs.com/package/sanitize-middleware):

```bash
npm install sanitize-middleware
```

sanitize-middleware's test scripts use yarn commands.

# API

```js
const sanitizeMiddleware = require('sanitize-middleware');
```

## sanitizeMiddleware([options])

Returns the sanitization middleware using the given optional `options`.
The middleware check all mandatory values are present and then validates and sanitizes the query, param and body of requests to protect against cross-site scripting (XSS) and command injection attacks.

If no options are provided, the middleware will accept every arguement and then attempt to derive the type before sanitizing.

# Example uses

```js
const sanitizeMiddleware = require('sanitize-middleware');
const express = require('express');

const options = {
	status: { type: 'string', mandatory: true },
	type: { type: 'string', mandatory: true },
	id: { type: 'number', mandatory: false },
	specialty: { type: 'string', mandatory: false },
	subject: { type: 'string', mandatory: false }
};

const app = express();
app.use(sanitizeMiddleware(options));
```

# Contributing

Please see [CONTRIBUTING.md](https://github.com/Fdawgs/sanitize-middleware/blob/master/CONTRIBUTING.md) for more details regarding contributing to this project.

# License

`sanitize-middleware` is licensed under the [MIT](https://github.com/Fdawgs/sanitize-middleware/blob/master/LICENSE) license.
