import {fetch_layer, layer} from "../types";

export const buildLayer = async (root: string, env: string, name: string, fetchLayer: fetch_layer): Promise<layer> => {
    const [ paths, s] = await fetchLayer(root, env, name);
    const requires: string[] = [];
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
