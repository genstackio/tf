import runLayers from './runLayers';
import buildLayers from './buildLayers';
import {fetch_layer} from '../types';
import defaultFetchLayer from './fetchLayer';

export const tflayer = ({
    layerNameString,
    env,
    action,
    actionArgs,
    targetDir,
    logger,
    fetchLayer,
}: {
    layerNameString?: string;
    env: string;
    action: string;
    actionArgs?: Record<string, unknown>;
    targetDir: string;
    logger?: (msg: string) => void;
    fetchLayer?: fetch_layer;
}) => {
    let layerNames: string[];
    const opts = {transitive: false};
    if (layerNameString && /\+$/.test(layerNameString)) {
        layerNames = layerNameString.slice(0, -1).split(/,/);
        opts.transitive = true;
    } else {
        layerNames = (layerNameString || 'all').split(/,/);
    }
    fetchLayer = fetchLayer || defaultFetchLayer;
    if (action === 'list-layers')
        return buildLayers(targetDir, env, fetchLayer).then(layers => {
            (logger || console.log)(
                Object.values(layers)
                    .map(l => l.name)
                    .join('\n'),
            );
            return;
        });
    return runLayers(
        targetDir,
        env,
        layerNames,
        action,
        fetchLayer,
        actionArgs,
        opts,
    );
};

export default tflayer;
