import {layer_run, loggable, logger_factory, raw_logger} from '../types';

export default async (run: layer_run) => {
    await run(['terraform', 'init', '-upgrade=true'], createLogger);
};

const createLogger: logger_factory = (rawLogger: raw_logger) => {
    let messagesBuffer: (loggable | string)[] = [];
    return ({
        group,
        type,
        data,
        error,
    }: {
        group: string;
        type: string;
        data: unknown;
        error?: boolean;
    }) => {
        switch (type) {
            case 'starting':
                rawLogger({
                    group,
                    type: 'message',
                    data: 'Re-initializing terraform workspace...',
                });
                break;
            case 'message':
                messagesBuffer.push({group, type, data, error});
                break;
            case 'aborted':
                messagesBuffer.forEach(m => rawLogger(m as loggable));
                messagesBuffer = [];
                break;
            case 'completed':
                break;
        }
    };
};
