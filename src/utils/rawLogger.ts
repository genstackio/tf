export const rawLogger = ({group, type, data, error = false}: { group: string; type: string; data: unknown; error?: boolean }) => {
    type === 'message' && console[error ? 'error' : 'log'] || ((..._: unknown[]) => {})(`[${group}] ${data}`);
};

export default rawLogger;
