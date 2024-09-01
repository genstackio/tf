export type layer = {
    name: string;
    requires: string[];
    depends: string[];
    paths: Record<string, string>;
    path: string;
};

export type config = {
    common: Record<string, unknown>;
    environments: Record<string, Record<string, unknown>>;
    layers?: Record<string, layer_config>;
};

export type layer_config = {
    only_on_envs?: string[];
    not_on_envs?: string[];
};

export type loggable = {
    group: string;
    type: string;
    data: unknown;
    error?: boolean;
};

export type raw_logger = ({
    group,
    type,
    data,
    error,
}: {
    group: string;
    type: string;
    data: unknown;
    error?: boolean;
}) => void;

export type logger = ({
    group,
    type,
    data,
    error,
}: {
    group: string;
    type: string;
    data: unknown;
    error?: boolean;
}) => void;
export type logger_factory = (rawLogger: raw_logger) => logger;

export type layer_run = (
    args: string[],
    loggerFactory?: logger_factory,
    silent?: boolean,
) => Promise<void>;
export type layer_action = (run: layer_run, layer: layer) => Promise<void>;

export type fetch_layer = (
    root: string,
    env: string,
    name: string,
) => Promise<[Record<string, string>, string]>;
