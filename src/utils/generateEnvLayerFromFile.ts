import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'fs';
import {enriched_layer_config, generator, layer_region_config} from '../types';
import * as generators from '../generators';

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
    const format = layerConfig.format || 'v1';
    const generator = (generators as Record<string, generator>)[format];

    if (!generator) throw new Error(`Unsupported layer format '${format}'`);

    const files = await generator(
        readFileSync(sourceFile, 'utf8') as string,
        {
            regions:
                regions && Object.keys(regions).length
                    ? regions
                    : ({[defaultRegion]: {}} as Record<
                          string,
                          layer_region_config
                      >),
            defaultRegion,
        },
        vars,
        layerConfig,
    );

    (files || []).map(([file, content]) =>
        writeFileSync(`${targetDir}/${file}`, content),
    );
};

export default generateEnvLayerFromFile;
