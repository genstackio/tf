import {layer} from "../types";

export const buildLayerDepends = async (layer: layer, layers: layer[]) =>
    Object.keys(
        (await Promise.all(
            Object.values(layers).reduce(
                (acc: layer[], l: layer) => {
                    if (l.requires.find((r: string) => r === layer.name)) {
                        acc.push(l);
                    }
                    return acc;
                },
                [] as layer[]
            ).map(
                async (l: layer): Promise<string[]> => {
                    return [...await buildLayerDepends(l, layers), l.name];
                }
            )
        )).reduce(
            (acc: Record<string, boolean>, d: string[] = []) => {
                d.forEach(dd => !acc[dd] && (acc[dd] = true));
                return acc;
            },
            {} as Record<string, boolean>
        )
    )
;

export default buildLayerDepends;
