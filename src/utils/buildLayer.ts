import {existsSync, readFileSync} from "fs";
import {resolve} from "path";
import {layer} from "../types";

export const buildLayer = async (root: string, env: string, name: string): Promise<layer> => {
    const dir = `${root}/${env}/${name}`;
    if (!existsSync(dir)) throw new Error(`Unknown layer '${name}'`);
    const paths: Record<string, string> = {
        '.': resolve(dir),
        'main.tf': resolve(`${dir}/main.tf`),
        'outputs.tf': resolve(`${dir}/outputs.tf`),
        'variables.tf': resolve(`${dir}/variables.tf`),
    };
    const requires: string[] = [];
    const s = readFileSync(paths['main.tf'], 'utf8');
    let array1: RegExpExecArray | null;
    const pattern = new RegExp('data "terraform_remote_state" "([^"]+)" {', 'g');
    let v: string|undefined;
    while ((array1 = pattern.exec(s)) as unknown !== null) {
        v = array1?.[1]?.replace(/_/g, '-');
        v && requires.push(v);
    }
    return { name, path: paths['.'], requires, paths, depends: [] };
};

export default buildLayer;
