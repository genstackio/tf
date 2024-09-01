import {readFileSync} from 'fs';
import parseLayerVariableDsn from './parseLayerVariableDsn';
import flattenJsonVars from './flattenJsonVars';
import buildVarKey from './buildVarKey';
import buildVarValue from './buildVarValue';

export const buildVars = (vars: Record<string, string>, repo: string) => {
    const [layers, variables]: [
        Record<string, boolean>,
        Record<string, [string, string]>,
    ] = Object.keys(vars).reduce(
        (acc, k) => {
            const [layer, varName] = parseLayerVariableDsn(vars[k]);
            acc[0][layer] = true;
            acc[1][k] = [layer, varName] as [string, string];
            return acc;
        },
        [{}, {}] as [Record<string, boolean>, Record<string, [string, string]>],
    );
    const layerNames = Object.keys(layers);
    layerNames.sort();
    const sources: Record<string, Record<string, string>> = {};
    layerNames.forEach(l => {
        try {
            sources[l] =
                flattenJsonVars(
                    JSON.parse(readFileSync(`${repo}/${l}.json`, 'utf8')),
                ) || {};
        } catch (_) {
            sources[l] = {};
        }
    });
    return Object.keys(variables)
        .reduce(
            (acc, k) => {
                const [source, data] = variables[k];
                acc.push(
                    `${buildVarKey(k)}=${buildVarValue(source, data, sources)}`,
                );
                return acc;
            },
            <string[]>[],
        )
        .join('\n');
};

export default buildVars;
