import {layer, layer_action, logger_factory} from "../types";
import * as layerActions from "../layer-actions";
import lrun from "./runLayerCommand";
import rawLogger from "./rawLogger";

export const runLayer = async (layer: layer, action: string) => {
    const a: layer_action = (layerActions as Record<string, layer_action>)[action?.replace(/-/g, '_') || ''];
    if (!a) throw new Error(`Unsupported layer action '${action}'`);
    await a(
        async (args: string[], loggerFactory?: logger_factory, silent?: boolean) => {
            await lrun(layer, {...(loggerFactory ? {logger: loggerFactory(rawLogger)} : {}), ...(silent ? {silent} : {})}, args[0], ...args.slice(1));
        },
        layer
    );
};

export default runLayer;
