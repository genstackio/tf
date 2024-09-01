import {readdirSync} from 'fs';
import {fetched_layer} from '../types';

export const fetchLayers = async (
    sourceDir: string,
): Promise<fetched_layer[]> => {
    return readdirSync(sourceDir, {withFileTypes: true})
        .filter(e => !e.isDirectory() && /.tmpl.tf$/.test(e.name))
        .map(e => ({
            name: e.name.replace(/\.tmpl\.tf$/, ''),
            file: e.name,
            filePath: `${sourceDir}/${e.name}`,
        }));
};

export default fetchLayers;
