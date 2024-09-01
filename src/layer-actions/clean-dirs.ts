import {layer_run} from '../types';

export default async (run: layer_run) => {
    await run(['rm', '-rf', '.terraform/plugins', '.terraform/providers']);
}
