import Handlebars from 'handlebars';
import ejs from 'ejs';

Handlebars.registerHelper('slugify', s => s.replace(/[^a-z0-9_]+/g, '-'));

const replaceHandlebars = (a: unknown, b: unknown) => Handlebars.compile(a)(b);
const replaceEjs = (a: string, b: Record<string, unknown>) =>
    ejs.render(a, b, {debug: false});

const defaultFormat = 'handlebars';
export const replaceVars = (
    a: unknown,
    b: Record<string, unknown>,
    {format = defaultFormat} = {},
) => {
    if (Array.isArray(a)) {
        a.forEach((v, i) => {
            a[i] = replaceVars(v, b);
        });
        return a;
    }
    if ('object' === typeof a) {
        return Object.entries(a as object).reduce(
            (acc, [k, v]) => {
                acc[k] = replaceVars(v, b);
                return acc;
            },
            a as Record<string, unknown>,
        );
    }
    switch (format) {
        case 'ejs':
            return replaceEjs(a as string, b);
        default:
        case 'handlebars':
            return replaceHandlebars(a, b);
    }
};

export default replaceVars;
