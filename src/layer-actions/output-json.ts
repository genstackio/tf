import {layer_run, loggable, logger_factory, raw_logger} from '../types';

export default async (run: layer_run) => {
    await run(
        ['terraform', 'output', '-json', '-no-color'],
        createLogger,
        true,
    );
};

const createLogger: logger_factory = (rawLogger: raw_logger) => {
    const messagesBuffer: (loggable | string)[] = [];
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
            case 'message':
                if (error) {
                    rawLogger({group, type, data, error});
                } else {
                    messagesBuffer.push(data as unknown as string);
                }
                break;
            case 'completed':
                console.log(
                    JSON.stringify({
                        id: group,
                        variables: JSON.parse(messagesBuffer.join('\n')),
                    }),
                );
                break;
            default:
        }
    };
};
