import replaceVars from './replaceVars';

export const generateLayerVars = (
    vars: unknown,
    layer: Record<string, unknown>,
) => replaceVars(vars, layer) as Record<string, unknown>;

export default generateLayerVars;
