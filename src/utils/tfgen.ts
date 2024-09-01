import {readdirSync} from 'fs';
import {resolve} from 'path';
import mergeEnvConfig from './mergeEnvConfig';
import generateEnvLayerFromFile from './generateEnvLayerFromFile';
import generateLayerVars from './generateLayerVars';
import {config} from '../types';

export const tfgen = async (
    configFile: string,
    sourceDir: string,
    targetDir: string,
) => {
    const layers = readdirSync(sourceDir, {withFileTypes: true})
        .filter(e => !e.isDirectory() && /.tmpl.tf$/.test(e.name))
        .map(e => ({
            name: e.name.replace(/\.tmpl\.tf$/, ''),
            file: e.name,
            filePath: `${sourceDir}/${e.name}`,
        }));
    const config: config = await import(resolve(configFile));
    await Promise.all(
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
                        `${targetDir}/${name}/${file.replace(/\.tmpl\.tf$/, '')}/main.tf`,
                        generateLayerVars(layerEnv, layerEnv),
                    );
                }),
            );
        }),
    );
};

export default tfgen;
