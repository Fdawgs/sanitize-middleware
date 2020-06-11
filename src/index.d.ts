export interface LooseObject {
	[key: string]: any;
}
/**
 * @author Frazer Smith
 * @description Validates
 * and sanitizes the query, param and body of requests to protect against
 * cross-site scripting (XSS) and command injection attacks.
 * @param {object=} config - Sanitization configuration values.
 * @returns {Function} Express middleware.
 */
export default function sanitizeMiddleware(
	config?: LooseObject | undefined
): Function;
