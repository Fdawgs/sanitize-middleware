module.exports = {
	env: {
		es6: true,
		node: true
	},
	extends: [
		'airbnb-base',
		'plugin:promise/recommended',
		'plugin:jest/recommended',
		'plugin:jsdoc/recommended',
		'prettier'
	],

	overrides: [
		{
			files: ['*.ts', '*.tsx'],
			extends: ['plugin:@typescript-eslint/recommended'],
			parser: '@typescript-eslint/parser',
			plugins: ['import'],
			rules: {
				'import/first': 'off',
				'@typescript-eslint/ban-types': 'off',
				'@typescript-eslint/no-var-requires': 'warn',
				'@typescript-eslint/no-explicit-any': 'off'
			}
		}
	],

	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module'
	},
	plugins: ['import', 'jest', 'jsdoc', 'json', 'promise'],
	rules: {
		camelcase: 'warn',
		'import/no-extraneous-dependencies': [
			'error',
			{
				devDependencies: true
			}
		],
		'lines-between-class-members': 'error',
		'no-multiple-empty-lines': [
			'error',
			{
				max: 1,
				maxBOF: 0,
				maxEOF: 0
			}
		],
		'prefer-destructuring': 'off',
		'promise/prefer-await-to-then': 'warn',
		'promise/prefer-await-to-callbacks': 'warn'
	}
};
