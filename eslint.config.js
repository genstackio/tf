// @ts-check

const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config({
        ignores: [
            'src/**/*.js',
            'test/**/*.js',
            'lib/**/*.js',
            'lib/**/*.d.ts',
            '.prettierrc.js',
            'eslint.config.js',
        ],
        extends: [
                eslint.configs.recommended,
                ...tseslint.configs.recommended,
        ],
        rules: {
                'eslint-comments/no-unused-disable': 'off',
                "@typescript-eslint/no-unused-expressions": [
                    "error",
                    {
                        "allowShortCircuit": true
                    }
                ],
                "@typescript-eslint/no-unused-vars": [
                    "error",
                    {
                        "args": "all",
                        "argsIgnorePattern": "^_",
                        "caughtErrors": "all",
                        "caughtErrorsIgnorePattern": "^_",
                        "destructuredArrayIgnorePattern": "^_",
                        "varsIgnorePattern": "^_",
                        "ignoreRestSiblings": true
                    }
                ]
        },
});
