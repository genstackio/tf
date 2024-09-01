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
};
