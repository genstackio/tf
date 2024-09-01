import buildLayers from "./buildLayers";
import runLayers from "./runLayers";

export const tflayer = ({layerNameString, env, action, actionArgs, targetDir}: { layerNameString?: string; env: string; action: string; actionArgs?: Record<string, unknown>; targetDir: string }) => {
    let layerNames: string[];
    const opts = {transitive: false};
    if (layerNameString && /\+$/.test(layerNameString)) {
        layerNames = layerNameString.slice(0, -1).split(/,/);
        opts.transitive = true;
    } else {
        layerNames = (layerNameString || 'all').split(/,/)
    }
    if (action === 'list-layers') return buildLayers(targetDir, env).then(layers => {
        console.log(Object.values(layers).map(l => l.name).join("\n"));
        process.exit(0);
    });
    return runLayers(targetDir, env, layerNames, action, actionArgs, opts)
};

export default tflayer;
