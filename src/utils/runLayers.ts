import runLayer from './runLayer';
import buildLayers from './buildLayers';
import {fetch_layer} from '../types';

const actions: Record<
    string,
    {executeDepends?: boolean; executeRequires?: boolean}
> = {
    init: {executeDepends: false},
    get: {executeDepends: false},
    update: {executeDepends: false},
    plan: {executeDepends: false},
    apply: {executeDepends: false},
    output: {executeDepends: false},
    sync: {executeDepends: true},
    destroy: {executeRequires: true, executeDepends: true},
};

export const runLayers = async (
    root: string,
    env: string,
    layerNames: string[],
    action: string,
    fetchLayer: fetch_layer,
    _: Record<string, unknown> = {},
    opts: {transitive?: boolean} = {},
) => {
    const layers = await buildLayers(root, env, fetchLayer);
    const allMode = !!layerNames.find(n => n === 'all');
    layerNames = allMode ? layers.map(l => l.name) : layerNames;
    layerNames = layerNames.reduce((acc, ln) => {
        if (/\*/.test(ln)) {
            const lnr = new RegExp(ln.replace(/\*/, '[^/]+'));
            acc = [
                ...acc,
                ...layers.filter(l => lnr.test(l.name)).map(l => l.name),
            ];
        } else {
            acc.push(ln);
        }
        return acc;
    }, [] as string[]);
    const done: Record<string, boolean> = {};
    await layers
        .filter(l => layerNames.find(n => n === l.name))
        .reduce(async (p, l) => {
            await p;
            if (opts.transitive && actions[action].executeRequires) {
                await l.requires.reduce(
                    async (p: Promise<void>, ll: string) => {
                        await p;
                        if (!done[ll]) {
                            const lll = layers.find(x => ll === x.name);
                            lll && (await runLayer(lll, action));
                            done[ll] = true;
                        }
                    },
                    Promise.resolve(),
                );
            }
            if (!done[l.name]) {
                await runLayer(l, action);
                done[l.name] = true;
            }
            if (opts.transitive && !allMode && actions[action].executeDepends) {
                await l.depends.reduce(async (p, ll) => {
                    await p;
                    if (!done[ll]) {
                        const lll = layers.find(x => ll === x.name);
                        lll && (await runLayer(lll, action));
                        done[ll] = true;
                    }
                }, Promise.resolve());
            }
        }, Promise.resolve());
};

export default runLayers;
