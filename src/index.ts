import type express from "express";
import { encode } from "html-entities";
import serialize from "serialize-javascript";
import validator from "validator";

export interface LooseObject {
	[key: string]: any;
}

/**
 * @author Frazer Smith
 * @description Attempts to derive JavaScript data type of value.
 * @param {*} value - Value to derive JavaScript data type from.
 * @returns {string} type of value.
 */
function deriveType(value: unknown): string {
	let result: string;

	if (typeof value === "object" || validator.isJSON(value.toString())) {
		result = "object";
	} else if (
		value === "true" ||
		value === "false" ||
		typeof value === "boolean"
	) {
		result = "boolean";
	} else if (
		value.toString().substring(0, 1) !== "0" &&
		(typeof value === "number" ||
			(typeof value === "string" && validator.isFloat(value as string)))
	) {
		result = "number";
	} else if (validator.isDate(value as string)) {
		result = "date";
	} else {
		result = "string";
	}

	return result;
}

/**
 * @author Frazer Smith
 * @description Validates that value is of JavaScript data type passed.
 * @param {string} value - Value to validate.
 * @param {string} type - Expected JavaScript data type.
 * @returns {boolean} confirmation that value is valid.
 */
function validateType(value: string, type: string): boolean {
	let result: boolean;
	switch (type.toLowerCase()) {
		case "boolean":
			result =
				value === "true" ||
				value === "false" ||
				typeof value === "boolean";
			break;
		case "date":
			result = validator.toDate(value) !== null;
			break;
		case "number":
			result =
				value.toString().substring(0, 1) !== "0" &&
				(typeof value === "number" ||
					(typeof value === "string" &&
						validator.isFloat(value as string)));
			break;
		case "object":
			result =
				typeof value === "object" || validator.isJSON(value.toString());
			break;
		case "string":
			result = typeof value === "string";
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
 * @param {string} type - Expected JavaScript data type.
 * @returns {boolean|Date|number|string} parsed value.
 */
function parseValue(
	value: string,
	type: string
): boolean | Date | number | string {
	let result: boolean | Date | number | string;
	switch (type.toLowerCase()) {
		case "boolean":
			if (typeof value === "boolean") {
				result = value;
			} else {
				result = validator.toBoolean(value, true);
			}
			break;
		case "date":
			// Check for valid date type occurs in validateType function, no need to convert here
			result = value;
			break;
		case "number":
			if (typeof value === "number") {
				result = value;
			} else {
				result = validator.toFloat(value);
			}
			break;
		case "object":
			if (validator.isJSON(value.toString())) {
				result = serialize(JSON.parse(value));
			} else {
				result = serialize(value);
			}

			break;
		// String types will be passed to this
		default:
			/**
			 * Below does the following:
			 * - Removes non-word characters, and control characters using `stripLow` function of `validator`
			 * - Escapes HTML tags using `encode` function of `entities`, replacing them with HTML entities
			 */
			result = encode(validator.stripLow(value.toString())).trim();
			break;
	}
	return result;
}

/**
 * @author Frazer Smith
 * @description Checks all mandatory arguments are present, if one or more
 * is missing an error will be returned.
 *
 * If all mandatory arguments are present, function will attempt to validate
 * and sanitize all arguments passed.
 * @param {object} args - Object containing request arguments to be parsed.
 * @param {object=} config - Objects containing accepted arguments as properties, and their types as values.
 * @returns {Error|object} - Error object or object containing sanitized arguments.
 */
function parseValues(args: object, config: object | undefined): Error | object {
	const values = args;
	const keys = Object.keys(values);
	let message: string;

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
			.join(", ")
			.toString()}`;
		return new Error(message);
	}

	// Check values are under the max length specified
	const maxLengthArgs = {};
	Object.keys(config).forEach((configKey) => {
		if (
			config[configKey].maxLength &&
			typeof config[configKey].maxLength === "number"
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

	if (typeof message !== "undefined") {
		return new Error(message);
	}
	return values;
}

/**
 * @author Frazer Smith
 * @description Validates, sanitizes, and escapes the query, param and body of requests to protect against
 * cross-site scripting (XSS) and command injection attacks.
 * @param {object=} config - Sanitization configuration values.
 * @returns {Function} Express middleware.
 */
module.exports = function sanitizeMiddleware(
	config: LooseObject | undefined = { body: {}, params: {}, query: {} }
): Function {
	return (
		req: express.Request,
		res: express.Response,
		next: (...args: unknown[]) => void
	) => {
		if (req.body && Object.keys(req.body).length) {
			const result = parseValues(req.body, config.body);
			if (result instanceof Error) {
				res.status(400);
				return next(result);
			}
			req.body = result;
		}
		if (req.params && Object.keys(req.params).length) {
			const result = parseValues(req.params, config.params);
			if (result instanceof Error) {
				res.status(400);
				return next(result);
			}
			req.params = result as {};
		}
		if (req.query && Object.keys(req.query).length) {
			const result = parseValues(req.query, config.query);
			if (result instanceof Error) {
				res.status(400);
				return next(result);
			}
			req.query = result as {};
		}
		return next();
	};
};
