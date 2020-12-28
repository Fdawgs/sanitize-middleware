module.exports = {
	env: {
		es2021: true,
		node: true,
	},
	extends: [
		"airbnb-base",
		"plugin:promise/recommended",
		"plugin:jest/recommended",
		"plugin:jsdoc/recommended",
		"plugin:security/recommended",
		"prettier",
	],
	overrides: [
		{
			files: ["*.ts", "*.tsx"],
			extends: ["plugin:@typescript-eslint/recommended"],
			parser: "@typescript-eslint/parser",
			plugins: ["import"],
			rules: {
				"import/first": "off",
				"@typescript-eslint/ban-types": "off",
				"@typescript-eslint/no-var-requires": "warn",
				"@typescript-eslint/no-explicit-any": "off",
			},
		},
	],
	parserOptions: {
		sourceType: "module",
		ecmaFeatures: {
			impliedStrict: true,
		},
	},
	plugins: ["import", "jest", "jsdoc", "promise", "security"],
	root: true,
	rules: {
		"import/no-extraneous-dependencies": "warn",
		"no-multiple-empty-lines": [
			"error",
			{
				max: 1,
			},
		],
		"prefer-destructuring": "off",
		"promise/prefer-await-to-callbacks": "warn",
		"promise/prefer-await-to-then": "warn",
	},
};
