export const buildVarValue = (
    s: string,
    d: string,
    ss: Record<string, Record<string, string>>,
) => {
    const v = (
        '_' === s ? `${d}` : ss[s] ? (ss[s][d] ? `${ss[s][d]}` : '') : ''
    ).trim();
    return 0 <= v.indexOf(' ') || 0 <= v.indexOf(';') ? `"${v}"` : v;
};

export default buildVarValue;
