const sanitize = require('sanitize-html');
const validator = require('validator');
const xss = require('xss');

/**
 * @author Frazer Smith
 * @description Attempts to derive type of value.
 * @param {*} value - Value to derive type from.
 * @returns {string} type of value.
 */
function deriveType(value) {
	let result;
	if (typeof value === 'object') {
		result = 'object';
	} else if (
		value === 'true' ||
		value === 'false' ||
		typeof value === 'boolean'
	) {
		result = 'boolean';
	} else if (
		(!Number.isNaN(value) && typeof value === 'number') ||
		(validator.isFloat(value) && typeof value === 'string')
	) {
		result = 'number';
	} else if (validator.isISO8601(value, { strict: true })) {
		result = 'date';
	} else {
		result = 'string';
	}

	return result;
}

/**
 * @author Frazer Smith
 * @description Validates that value is of type passed.
 * @param {string} value - Value to validate.
 * @param {('boolean'|'date'|'json'|'number'|'object'|'string')=} type - Expected type of value.
 * @returns {boolean} confirmation that value is valid.
 */
function validateType(value, type) {
	let result;
	switch (type) {
		case 'boolean':
			result =
				value === 'true' ||
				value === 'false' ||
				typeof value === 'boolean';
			break;
		case 'date':
			result = validator.toDate(value) !== null;
			break;
		case 'json':
			result = typeof JSON.parse(value) === 'object';
			break;
		case 'number':
			result =
				(!Number.isNaN(value) && typeof value === 'number') ||
				(validator.isFloat(value) && typeof value === 'string');
			break;
		case 'object':
			result = typeof value === 'object';
			break;
		case 'string':
			result = typeof value === 'string';
			break;
		default:
			result = false;
			break;
	}
	return result;
}

/**
 * @author Frazer Smith
 * @description Sanitizes value based on type passed.
 * @param {string} value - Value to sanitize.
 * @param {('boolean'|'date'|'json'|'number'|'object'|'string')=} type - Expected type of value.
 * @returns {string} parsed value.
 */
function parseValue(value, type) {
	let result;
	switch (type.toLowerCase()) {
		case 'boolean':
			if (typeof value === 'boolean') {
				result = value;
			} else {
				result = validator.toBoolean(value, true);
			}
			break;
		case 'date':
			result = validator.toDate(value);
			break;
		case 'json':
			result = JSON.parse(value);
			break;
		case 'number':
			if (!Number.isNaN(value) && typeof value === 'number') {
				result = value;
			} else {
				result = validator.toFloat(value);
			}
			break;
		case 'object':
			result = JSON.parse(JSON.stringify(value));
			break;
		// String types will be passed to this
		default:
			// Strip any invalid HTML tags, non-word characters, and control characters
			result = validator.stripLow(xss(sanitize(value))).trim();
			break;
	}
	return result;
}

/**
 * @author Frazer Smith
 * @description Checks all mandatory arguments are present.
 * If one or more is missing an error will be returned else it will attempt to validate and sanitize all arguments passed.
 * @param {object} args - Object containing request arguments to be parsed.
 * @param {object=} config - Objects containing accepted arguments as properties, and their types as values.
 * @returns {Error|object} - Error object or object containing sanitized arguments.
 */
function parseValues(args, config) {
	const values = args;
	const keys = Object.keys(values);
	let message;

	// Check mandatory values are present
	const mandatoryArgs = [];
	Object.keys(config).forEach((configKey) => {
		if (
			config[configKey].mandatory &&
			config[configKey].mandatory === true
		) {
			mandatoryArgs.push(configKey);
		}
	});
	if (
		mandatoryArgs.every((element) =>
			keys.map((x) => x.toLowerCase()).includes(element.toLowerCase())
		) === false
	) {
		message = `A mandatory parameter is missing from the list: ${mandatoryArgs
			.join(', ')
			.toString()}`;
		return new Error(message);
	}

	// Check values are under the max length specified
	const maxLengthArgs = {};
	Object.keys(config).forEach((configKey) => {
		if (
			config[configKey].maxLength &&
			typeof config[configKey].maxLength === 'number'
		) {
			maxLengthArgs[configKey] = config[configKey].maxLength;
		}
	});
	Object.keys(maxLengthArgs).forEach((maxLengthKey) => {
		if (values[maxLengthKey].length > maxLengthArgs[maxLengthKey]) {
			message = `${maxLengthKey} is greater than the allowed length of ${maxLengthArgs[maxLengthKey]}`;
		}
	});
	if (message) {
		return new Error(message);
	}

	/**
	 * Compare arguments to accepted arguments in config file.
	 * If config is empty then accept every argument, and
	 * attempt to derive type for sanitizing.
	 */
	keys.forEach((key) => {
		if (
			Object.prototype.hasOwnProperty.call(config, key) &&
			config[key].type &&
			validateType(values[key], config[key].type)
		) {
			values[key] = parseValue(values[key], config[key].type);
		} else if (
			Object.keys(config).length === 0 &&
			validateType(values[key], deriveType(values[key])) !== false
		) {
			values[key] = parseValue(values[key], deriveType(values[key]));
		} else {
			message = `Invalid option provided: ${key}`;
		}
	});

	if (typeof message !== 'undefined') {
		return new Error(message);
	}
	return values;
}

/**
 * @author Frazer Smith
 * @description Validates
 * and sanitizes the query, param and body of requests to protect against
 * cross-site scripting (XSS) and command injection attacks.
 * @param {object} config - Sanitization configuration values.
 * @param {object.<string, {type: ('boolean'|'date'|'json'|'number'|'object'|'string'), mandatory: boolean, maxLength: number}>=} config.body
 * @param {object.<string, {type: ('boolean'|'date'|'json'|'number'|'object'|'string'), mandatory: boolean, maxLength: number}>=} config.params
 * @param {object.<string, {type: ('boolean'|'date'|'json'|'number'|'object'|'string'), mandatory: boolean, maxLength: number}>=} config.query
 * @returns {Function} Express middleware.
 */
module.exports = function sanitizeMiddleware(
	config = { body: {}, params: {}, query: {} }
) {
	return (req, res, next) => {
		if (req.body && Object.keys(req.body).length) {
			req.body = parseValues(req.body, config.body);
			if (req.body instanceof Error) {
				res.status(400);
				return next(req.body);
			}
		}
		if (req.params && Object.keys(req.params).length) {
			req.params = parseValues(req.params, config.params);
			if (req.params instanceof Error) {
				res.status(400);
				return next(req.params);
			}
		}
		if (req.query && Object.keys(req.query).length) {
			req.query = parseValues(req.query, config.query);
			if (req.query instanceof Error) {
				res.status(400);
				return next(req.query);
			}
		}
		return next();
	};
};
