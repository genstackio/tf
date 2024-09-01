import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'fs';
import replaceVars from './replaceVars';
import {enriched_layer_config} from '../types';

export const generateEnvLayerFromFile = async (
    sourceFile: string,
    targetDir: string,
    vars: Record<string, unknown>,
    layerConfig: enriched_layer_config,
) => {
    existsSync(targetDir) || mkdirSync(targetDir, {recursive: true});

    const defaultRegion = layerConfig.defaultRegion;
    const regions: string[] = layerConfig.regions || [];

    const mappedRegions = (regions || [defaultRegion]).map(
        r =>
            [
                r,
                `${targetDir}/main${r === defaultRegion ? '' : `_${r.replace(/-/g, '_')}`}.tf`,
            ] as [string, string],
    );

    const reports = await Promise.allSettled(
        mappedRegions.map(async ([r, targetFile]: [string, string]) => {
            writeFileSync(
                targetFile,
                replaceVars(readFileSync(sourceFile, 'utf8') as string, {
                    ...vars,
                    region: r,
                    rsuffix: r === defaultRegion ? '' : `-${r}`,
                }) as unknown as string,
            );
        }),
    );

    const errors: {reason: Error}[] = reports.filter(
        x => x.status !== 'fulfilled',
    ) as unknown as {reason: Error}[];

    if (errors.length)
        throw new Error(
            `Unable to generate all env layer files for ${sourceFile}: ${errors.map((x: {reason: Error}) => x.reason.message).join('\n')}`,
        );
};

export default generateEnvLayerFromFile;
