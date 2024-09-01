import {config} from '../types';

export const mergeEnvConfig = (config: config, name: string) => ({
    ...config.common,
    ...config.environments[name],
    env: name,
});

export default mergeEnvConfig;
