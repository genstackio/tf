import {layer} from "../types";

export const buildLayerRequires = async (layer: layer, layers: layer[]): Promise<string[]> =>
    Object.keys(
        (await Promise.all(
            layer.requires.map(
                async (r: string) => {
                    const lll = layers.find((ll: layer) => ll.name === r);
                    if (!lll) return [] as string[];
                    return [...await buildLayerRequires(lll, layers), lll.name] as string[];
                }
            )
        )).reduce(
            (acc: Record<string, boolean>, rrr: string[]) => {
                rrr.forEach((rrrr: string) => {
                    if (!acc[rrrr]) {
                        acc[rrrr] = true;
                    }
                });
                return acc;
            },
            {} as Record<string, boolean>
        )
    )
;

export default buildLayerRequires;
