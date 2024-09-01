import {layer_run} from '../types';

export default async (run: layer_run) => {
    await run(['rm', '-f', '.terraform.lock.hcl']);
}
