import Handlebars from 'handlebars';
Handlebars.registerHelper('slugify', s => s.replace(/[^a-z0-9_]+/g, '-'));

export const replaceVars = (a: unknown, b: Record<string, unknown>) => {
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
    return Handlebars.compile(a)(b);
};

export default replaceVars;
