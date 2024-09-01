import {layer_run, loggable} from '../types';
import rawLogger from "../utils/rawLogger";

export default async (run: layer_run) => {
    let needApply: boolean | undefined;
    const createLogger = () => {
        let messagesBuffer: (loggable | string)[] = [];
        return ({ group, type, data, error }: { group :string; type: string, data: unknown; error?: boolean }) => {
            switch (type) {
                case 'starting':
                    rawLogger({group, type: 'message', data: 'Planning changes...'});
                    break;
                case 'message':
                    if (undefined === needApply) {
                        if (/ 0 to add, 0 to change, 0 to destroy/.test(data as string)) {
                            needApply = false;
                        } else if (/To perform exactly these actions, run the following command to apply/.test(data as string)) {
                            needApply = true;
                            messagesBuffer.forEach(m => rawLogger(m as loggable));
                            messagesBuffer = [];
                        } else if (/No changes. Infrastructure is up-to-date./.test(data as string)) {
                            needApply = false;
                        }
                    }
                    if (needApply) {
                        rawLogger({group, type, data, error});
                    } else {
                        messagesBuffer.push({group, type, data, error});
                    }
                    break;
                case 'aborted':
                    needApply = false;
                    messagesBuffer.forEach(m => rawLogger(m as loggable));
                    messagesBuffer = [];
                    break;
                case 'completed':
                    if (!needApply) {
                        rawLogger({group, type: 'message', data: 'No changes detected, skipping.'})
                    } else {
                        messagesBuffer.forEach(m => rawLogger(m as loggable));
                        messagesBuffer = [];
                    }
                    break;
            }
        };
    }
    await run(['terraform', 'plan', '-out', 'plan.tfplan'], createLogger);
    needApply && await run(['terraform', 'apply', 'plan.tfplan']);
}
