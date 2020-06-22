import { cloneDeep } from 'lodash';
import httpMocks = require('node-mocks-http');
import faker = require('faker');

const sanitizeMiddleware = require('./index.ts');

interface LooseObject {
	[key: string]: any;
}

const args: LooseObject = {
	argBoolean: faker.random.boolean(),
	argBooleanString: faker.random.boolean().toString(),
	argCtrlChars: '\x01\x09',
	argDate: faker.date.past().toISOString().split('T')[0],
	argHtml: `<a href='https://www.nhs.uk/'><c>b</c></a>`,
	argInvalid: faker.random.words(5),
	argJson: '{ "test1": 1, "test2": 2 }',
	argNumber: faker.random.number(),
	argNumberString: faker.random.number().toString(),
	argObject: { test1: faker.random.number(), test2: faker.random.number() },
	argString: faker.random.word().substring(0, 5)
};

const requiredArgs: LooseObject = {
	argBoolean: { type: 'boolean', mandatory: false },
	argBooleanString: { type: 'boolean', mandatory: false },
	argCtrlChars: { type: 'string' },
	argDate: { type: 'date', mandatory: false },
	argHtml: { type: 'string' },
	argJson: { type: 'json', mandatory: false },
	argNumber: { type: 'number', mandatory: false },
	argNumberString: { type: 'number', mandatory: false },
	argObject: { type: 'object', mandatory: false },
	argString: { type: 'string', mandatory: false, maxLength: 5 }
};

describe('Sanitization and validation middleware', () => {
	test('Should return a middleware function', () => {
		const middleware = sanitizeMiddleware(undefined);

		expect(typeof middleware).toBe('function');
	});

	test('Should continue when no required arguments are provided', () => {
		const middleware = sanitizeMiddleware(undefined);
		const query = {};
		const req = httpMocks.createRequest({
			method: 'GET',
			query: Object.assign(query, args)
		});
		const res = httpMocks.createResponse();
		const next = jest.fn();

		middleware(req, res, next);

		expect(req.query).toMatchObject({
			argBoolean: expect.any(Boolean),
			argBooleanString: expect.any(Boolean),
			argCtrlChars: '',
			argDate: expect.any(String),
			argHtml: '<a href="https://www.nhs.uk/">b</a>',
			argNumber: expect.any(Number),
			argNumberString: expect.any(Number),
			argObject: expect.any(Object),
			argString: expect.any(String)
		});
		expect(res.statusCode).toBe(200);
		expect(next).toHaveBeenCalledTimes(1);
		expect(next.mock.calls[0][0]).toBeUndefined();
	});

	test('Should parse GET query values when all arguments are valid', () => {
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
			argBoolean: expect.any(Boolean),
			argBooleanString: expect.any(Boolean),
			argCtrlChars: '',
			argDate: expect.any(String),
			argHtml: '<a href="https://www.nhs.uk/">b</a>',
			argNumber: expect.any(Number),
			argNumberString: expect.any(Number),
			argObject: expect.any(Object),
			argString: expect.any(String)
		});
		expect(res.statusCode).toBe(200);
		expect(next).toHaveBeenCalledTimes(1);
		expect(next.mock.calls[0][0]).toBeUndefined();
	});

	test('Should pass an error to next when invalid GET query values are provided', () => {
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

	test('Should parse params values when all arguments are valid', () => {
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
			argBoolean: expect.any(Boolean),
			argBooleanString: expect.any(Boolean),
			argCtrlChars: '',
			argDate: expect.any(String),
			argHtml: '<a href="https://www.nhs.uk/">b</a>',
			argNumber: expect.any(Number),
			argNumberString: expect.any(Number),
			argObject: expect.any(Object),
			argString: expect.any(String)
		});
		expect(res.statusCode).toBe(200);
		expect(next).toHaveBeenCalledTimes(1);
		expect(next.mock.calls[0][0]).toBeUndefined();
	});

	test('Should pass an error to next when invalid param values are provided', () => {
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

	test('Should parse PUT body values when all arguments are valid', () => {
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
			argBoolean: expect.any(Boolean),
			argBooleanString: expect.any(Boolean),
			argCtrlChars: '',
			argDate: expect.any(String),
			argHtml: '<a href="https://www.nhs.uk/">b</a>',
			argNumber: expect.any(Number),
			argNumberString: expect.any(Number),
			argObject: expect.any(Object),
			argString: expect.any(String)
		});
		expect(res.statusCode).toBe(200);
		expect(next).toHaveBeenCalledTimes(1);
		expect(next.mock.calls[0][0]).toBeUndefined();
	});

	test('Should pass an error to next when invalid PUT body values are provided', () => {
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

	test('Should pass an error to next when mandatory value is missing', () => {
		const modArgs = cloneDeep(requiredArgs);
		modArgs.argString.mandatory = true;
		const middleware = sanitizeMiddleware({ params: modArgs });
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

	test('Should pass an error to next when value is greater than max length specified', () => {
		const modArgs = cloneDeep(requiredArgs);
		modArgs.argString.maxLength = 2;
		const middleware = sanitizeMiddleware({ params: modArgs });
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

	test('Should pass an error to next when invalid type is provided for argument in config', () => {
		const modArgs = cloneDeep(requiredArgs);
		modArgs.argInvalid = { type: 'gibberish', mandatory: false };
		const middleware = sanitizeMiddleware({ params: modArgs });
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
