'use strict';

module.exports = {
    plugins: [],
    bracketSpacing: false,
    singleQuote: true,
    bracketSameLine: true,
    trailingComma: 'es5',
    printWidth: 80,
    arrowParens: 'avoid',
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            options: {
                trailingComma: 'all',
                parser: 'typescript',
            },
        },
    ],
};
