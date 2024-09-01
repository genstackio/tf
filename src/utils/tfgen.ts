import fetchLayers from './fetchLayers';
import fetchConfig from './fetchConfig';
import generateEnvLayers from './generateEnvLayers';

export const tfgen = async (
    configFile: string,
    sourceDir: string,
    targetDir: string,
    defaultLayerConfig?: Record<string, unknown>,
) => {
    await generateEnvLayers(
        await fetchLayers(sourceDir),
        await fetchConfig(configFile),
        targetDir,
        defaultLayerConfig,
    );
};

export default tfgen;
