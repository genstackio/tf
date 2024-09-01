import {existsSync, readFileSync} from "fs";
import {resolve} from "path";
import {fetch_layer} from "../types";

export const fetchLayer: fetch_layer = async (root: string, env: string, name: string): Promise<[ Record<string, string>, string ]> => {
    const dir = `${root}/${env}/${name}`;
    if (!existsSync(dir)) throw new Error(`Unknown layer '${name}'`);
    const paths: Record<string, string> = {
        '.': resolve(dir),
        'main.tf': resolve(`${dir}/main.tf`),
        'outputs.tf': resolve(`${dir}/outputs.tf`),
        'variables.tf': resolve(`${dir}/variables.tf`),
    };
    const s = readFileSync(paths['main.tf'], 'utf8');
    return [ paths, s ];
};

export default fetchLayer;
