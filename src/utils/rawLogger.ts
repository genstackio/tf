import {raw_logger} from '../types';

export const rawLogger: raw_logger = ({
    group,
    type,
    data,
    error = false,
}: {
    group: string;
    type: string;
    data: unknown;
    error?: boolean;
}) => {
    (type === 'message' && console[error ? 'error' : 'log']) ||
        ((..._: unknown[]) => {})(`[${group}] ${data}`);
};

export default rawLogger;
