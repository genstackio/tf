export const parseLayerVariableDsn = (d: string) => (!/^@[^:]+:.+$/.test(d)) ? ['_', d] : d.slice(1).split(/:/).slice(0, 2);

export default parseLayerVariableDsn;
