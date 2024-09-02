import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'fs';
import replaceVars from './replaceVars';
import {enriched_layer_config, layer_region_config} from '../types';

export const generateEnvLayerFromFile = async (
    sourceFile: string,
    targetDir: string,
    vars: Record<string, unknown>,
    layerConfig: enriched_layer_config,
) => {
    existsSync(targetDir) || mkdirSync(targetDir, {recursive: true});

    const defaultRegion = layerConfig.defaultRegion;
    const regions: Record<string, layer_region_config> =
        layerConfig.regions || {};

    const mappedRegions = Object.entries(
        regions && Object.keys(regions).length
            ? regions
            : ({[defaultRegion]: {}} as Record<string, layer_region_config>),
    ).map(
        ([rCode, r]: [string, layer_region_config]) =>
            [
                r,
                `${targetDir}/main${(r?.id || rCode) === defaultRegion ? '' : `_${rCode.replace(/-/g, '_')}`}.tf`,
                rCode,
            ] as [layer_region_config, string, string],
    );

    const reports = await Promise.allSettled(
        mappedRegions.map(
            async ([r, targetFile, rCode]: [
                layer_region_config,
                string,
                string,
            ]) => {
                const isMain = (r?.id || rCode) === defaultRegion;
                writeFileSync(
                    targetFile,
                    replaceVars(readFileSync(sourceFile, 'utf8') as string, {
                        ...vars,
                        region: r?.id || rCode,
                        is_main: isMain,
                        is_default_region: isMain,
                        rsuffix: isMain ? '' : `-${rCode}`,
                        ...r,
                        ...(vars?.id ? {id: vars.id} : {}),
                    }) as unknown as string,
                );
            },
        ),
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
