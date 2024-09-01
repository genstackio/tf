export const flattenJsonVars = (v: { variables: Record<string, { value?: string }> }) => Object.keys(v.variables || {}).reduce((acc, k) => Object.assign(acc, {[k]: v.variables[k].value}), {});

export default flattenJsonVars;
