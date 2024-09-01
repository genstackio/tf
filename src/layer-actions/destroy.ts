import {layer_run} from '../types';

export default async (run: layer_run) => {
    await run(['terraform', 'plan', '-destroy', '-out', 'destroy.tfplan']);
    await run(['terraform', 'apply', 'destroy.tfplan']);
}
