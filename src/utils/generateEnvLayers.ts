import mergeEnvConfig from './mergeEnvConfig';
import generateEnvLayerFromFile from './generateEnvLayerFromFile';
import generateLayerVars from './generateLayerVars';
import {fetched_layer, config, enriched_layer_config} from '../types';

const defaultRegion = 'eu-west-3';

export const generateEnvLayers = async (
    layers: fetched_layer[],
    config: config,
    targetDir: string,
    defaultLayerConfig: Record<string, unknown> = {},
) => {
    return Promise.all(
        Object.keys(config.environments || {}).map(async (name: string) => {
            const env = mergeEnvConfig(config, name);
            await Promise.all(
                layers.map(async ({name: layer, file, filePath}) => {
                    const layerEnv = {...env, env: name, layer: layer};
                    const layerConfig =
                        (config && config.layers && config.layers[layer]) || {};
                    if (layerConfig) {
                        if (
                            layerConfig.only_on_envs &&
                            !layerConfig.only_on_envs.includes(name)
                        )
                            return;
                        if (
                            layerConfig.not_on_envs &&
                            layerConfig.not_on_envs.includes(name)
                        )
                            return;
                    }
                    await generateEnvLayerFromFile(
                        filePath,
                        `${targetDir}/${name}/${file.replace(/\.tmpl\.tf$/, '')}`,
                        generateLayerVars(layerEnv, layerEnv),
                        {
                            defaultRegion,
                            ...defaultLayerConfig,
                            ...(layerConfig?.['envs']?.['common'] || {}),
                            ...(layerConfig?.['envs']?.[name] || {}),
                        } as enriched_layer_config,
                    );
                }),
            );
        }),
    );
};

export default generateEnvLayers;
