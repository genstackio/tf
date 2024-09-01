import getDirectories from "./getDirectories";
import buildLayer from "./buildLayer";
import buildLayerRequires from "./buildLayerRequires";
import buildLayerDepends from "./buildLayerDepends";
import {fetch_layer, layer} from "../types";

export const buildLayers = async (root: string, env: string, fetchLayer: fetch_layer) => {
    const layers = await Promise.all<layer>(getDirectories(`${root}/${env}`).map(async (l: string) => buildLayer(root, env, l, fetchLayer)));
    const sorted = (await Promise.all(layers.map(async l => {
        const requires = await buildLayerRequires(l, layers);
        const depends = await buildLayerDepends(l, layers);
        return ({...l, requires, depends});
    })));
    sorted.sort((a, b) => {
        let r: number = 0;
        if (a.requires.find((x: string) => b.name === x)) {
            r = 1;
        } else if (b.requires.find((x: string) => a.name === x)) {
            r = -1;
        } else if (a.requires.length > b.requires.length) {
            r = 1;
        } else if (a.requires.length < b.requires.length) {
            r = -1
        }
        return r;
    });
    return sorted as layer[];
};

export default buildLayers;
