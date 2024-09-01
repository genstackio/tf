import {layer_run} from '../types';

export default async (run: layer_run) => {
    await run([
        'terraform',
        'providers',
        'lock',
        '-platform=darwin_amd64',
        '-platform=linux_amd64',
        '-platform=windows_amd64',
        '-platform=darwin_arm64',
    ]);
};
