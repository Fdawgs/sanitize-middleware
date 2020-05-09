const httpMocks = require('node-mocks-http');
const sanitizeMiddleware = require('./index');

const args = {
	argString: 'hello',
	argNumber: 2,
	argNumberString: '2',
	argObject: { test1: 1, test2: 2 },
	argBoolean: true,
	argBooleanString: 'true',
	argDate: '2020-04-24',
	argJson: '{ "test1": 1, "test2": 2 }',
	argHtml: "<a href='https://www.nhs.uk/'><c>b</c></a>",
	argCtrlChars: '\x01\x09',
	argInvalid: "i'm not valid"
};

const requiredArgs = {
	argString: { type: 'string', mandatory: false, maxLength: 5 },
	argNumber: { type: 'number', mandatory: false },
	argNumberString: { type: 'number', mandatory: false },
	argObject: { type: 'object', mandatory: false },
	argBoolean: { type: 'boolean', mandatory: false },
	argBooleanString: { type: 'boolean', mandatory: false },
	argDate: { type: 'date', mandatory: false },
	argJson: { type: 'json', mandatory: false },
	argHtml: { type: 'string' },
	argCtrlChars: { type: 'string' }
};

describe('Sanitization and validation middleware', () => {
	test('Should return a middleware function', () => {
		const middleware = sanitizeMiddleware();
		expect(typeof middleware).toBe('function');
	});

	test('Should continue if no required arguments are provided', () => {
		const middleware = sanitizeMiddleware();

		const query = {};
		const req = httpMocks.createRequest({
			method: 'GET',
			query: Object.assign(query, args)
		});
		const res = httpMocks.createResponse();
		const next = jest.fn();

		middleware(req, res, next);
		expect(req.query).toMatchObject({
			argString: expect.any(String),
			argNumber: expect.any(Number),
			argNumberString: expect.any(Number),
			argBoolean: expect.any(Boolean),
			argBooleanString: expect.any(Boolean),
			argObject: expect.any(Object),

			// Test HTML parsing
			argHtml: '<a href="https://www.nhs.uk/">b</a>',

			// Test control character removal
			argCtrlChars: ''
		});
		expect(res.statusCode).toBe(200);
		expect(next).toHaveBeenCalledTimes(1);
		expect(next.mock.calls[0][0]).toBeUndefined();
	});

	test('Should parse GET query values if all arguments are valid', () => {
		const middleware = sanitizeMiddleware({ query: requiredArgs });

		const query = {};
		const req = httpMocks.createRequest({
			method: 'GET',
			query: Object.assign(query, args)
		});
		const res = httpMocks.createResponse();
		const next = jest.fn();
		delete req.query.argInvalid;

		middleware(req, res, next);
		expect(req.query).toMatchObject({
			argString: expect.any(String),
			argNumber: expect.any(Number),
			argNumberString: expect.any(Number),
			argBoolean: expect.any(Boolean),
			argBooleanString: expect.any(Boolean),
			argObject: expect.any(Object),

			// Test HTML parsing
			argHtml: '<a href="https://www.nhs.uk/">b</a>',

			// Test control character removal
			argCtrlChars: ''
		});
		expect(res.statusCode).toBe(200);
		expect(next).toHaveBeenCalledTimes(1);
		expect(next.mock.calls[0][0]).toBeUndefined();
	});

	test('Should pass an error to next if invalid GET query values are provided', () => {
		const middleware = sanitizeMiddleware({ query: requiredArgs });

		const query = {};
		const req = httpMocks.createRequest({
			method: 'GET',
			query: Object.assign(query, args)
		});
		const res = httpMocks.createResponse();
		const next = jest.fn();

		middleware(req, res, next);
		expect(next).toHaveBeenCalledTimes(1);
		expect(next.mock.calls[0][0].message).toBe(
			'Invalid option provided: argInvalid'
		);
	});

	test('Should parse params values if all arguments are valid', () => {
		const middleware = sanitizeMiddleware({ params: requiredArgs });

		const query = {};
		const req = httpMocks.createRequest({
			method: 'GET',
			params: Object.assign(query, args)
		});
		const res = httpMocks.createResponse();
		const next = jest.fn();
		delete req.params.argInvalid;

		middleware(req, res, next);
		expect(req.params).toMatchObject({
			argString: expect.any(String),
			argNumber: expect.any(Number),
			argNumberString: expect.any(Number),
			argBoolean: expect.any(Boolean),
			argBooleanString: expect.any(Boolean),
			argObject: expect.any(Object),

			// Test HTML parsing
			argHtml: '<a href="https://www.nhs.uk/">b</a>',

			// Test control character removal
			argCtrlChars: ''
		});
		expect(res.statusCode).toBe(200);
		expect(next).toHaveBeenCalledTimes(1);
		expect(next.mock.calls[0][0]).toBeUndefined();
	});

	test('Should pass an error to next if invalid param values are provided', () => {
		const middleware = sanitizeMiddleware({ params: requiredArgs });

		const query = {};
		const req = httpMocks.createRequest({
			method: 'GET',
			params: Object.assign(query, args)
		});
		const res = httpMocks.createResponse();
		const next = jest.fn();

		middleware(req, res, next);
		expect(next).toHaveBeenCalledTimes(1);
		expect(next.mock.calls[0][0].message).toBe(
			'Invalid option provided: argInvalid'
		);
	});

	test('Should parse PUT body values if all arguments are valid', () => {
		const middleware = sanitizeMiddleware({ body: requiredArgs });

		const query = {};
		const req = httpMocks.createRequest({
			method: 'PUT',
			body: Object.assign(query, args)
		});
		const res = httpMocks.createResponse();
		const next = jest.fn();
		delete req.body.argInvalid;

		middleware(req, res, next);

		expect(req.body).toMatchObject({
			argString: expect.any(String),
			argNumber: expect.any(Number),
			argNumberString: expect.any(Number),
			argBoolean: expect.any(Boolean),
			argBooleanString: expect.any(Boolean),
			argObject: expect.any(Object),

			// Test HTML parsing
			argHtml: '<a href="https://www.nhs.uk/">b</a>',

			// Test control character removal
			argCtrlChars: ''
		});
		expect(res.statusCode).toBe(200);
		expect(next).toHaveBeenCalledTimes(1);
		expect(next.mock.calls[0][0]).toBeUndefined();
	});

	test('Should pass an error to next if invalid PUT body values are provided', () => {
		const middleware = sanitizeMiddleware({ body: requiredArgs });

		const query = {};
		const req = httpMocks.createRequest({
			method: 'PUT',
			body: Object.assign(query, args)
		});
		const res = httpMocks.createResponse();
		const next = jest.fn();

		middleware(req, res, next);
		expect(next).toHaveBeenCalledTimes(1);
		expect(next.mock.calls[0][0].message).toBe(
			'Invalid option provided: argInvalid'
		);
	});

	test('Should pass an error to next if mandatory value is missing', () => {
		const adjustedArgs = JSON.parse(JSON.stringify(requiredArgs));
		adjustedArgs.argString.mandatory = true;

		const middleware = sanitizeMiddleware({ params: adjustedArgs });

		const query = {};
		const req = httpMocks.createRequest({
			method: 'GET',
			params: Object.assign(query, args)
		});
		const res = httpMocks.createResponse();
		const next = jest.fn();
		delete req.params.argString;

		middleware(req, res, next);
		expect(next).toHaveBeenCalledTimes(1);
		expect(next.mock.calls[0][0].message).toBe(
			'A mandatory parameter is missing from the list: argString'
		);
	});

	test('Should pass an error to next if value is greater than max length specified', () => {
		const adjustedArgs = JSON.parse(JSON.stringify(requiredArgs));
		adjustedArgs.argString.maxLength = 2;

		const middleware = sanitizeMiddleware({ params: adjustedArgs });

		const query = {};
		const req = httpMocks.createRequest({
			method: 'GET',
			params: Object.assign(query, args)
		});
		const res = httpMocks.createResponse();
		const next = jest.fn();
		delete req.params.argInvalid;

		middleware(req, res, next);
		expect(next).toHaveBeenCalledTimes(1);
		expect(next.mock.calls[0][0].message).toBe(
			'argString is greater than the allowed length of 2'
		);
	});

	test('Should pass an error to next if invalid type provided for argument in config', () => {
		const adjustedArgs = JSON.parse(JSON.stringify(requiredArgs));
		adjustedArgs.argInvalid = { type: 'gibberish', mandatory: false };

		const middleware = sanitizeMiddleware({ params: adjustedArgs });

		const query = {};
		const req = httpMocks.createRequest({
			method: 'GET',
			params: Object.assign(query, args)
		});
		const res = httpMocks.createResponse();
		const next = jest.fn();

		middleware(req, res, next);
		expect(next).toHaveBeenCalledTimes(1);
		expect(next.mock.calls[0][0].message).toBe(
			'Invalid option provided: argInvalid'
		);
	});
});
