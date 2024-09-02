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
    type === 'message' &&
        (error ? console.error : console.log)(`[${group}] ${data}`);
};

export default rawLogger;
