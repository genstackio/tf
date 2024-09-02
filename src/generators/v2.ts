import {enriched_layer_config, layer_region_config} from '../types';
import replaceVars from '../utils/replaceVars';

export default async (
    source: string,
    {
        regions,
        defaultRegion,
    }: {regions: Record<string, layer_region_config>; defaultRegion: string},
    vars: Record<string, unknown>,
    _: enriched_layer_config,
) => {
    return [
        // terraform file
        [
            `terraform.tf`,
            replaceVars(source, {
                ...vars,
                is_terraform_file: true,
            }) as unknown as string,
        ],
        // providers file
        [
            `providers.tf`,
            replaceVars(source, {
                ...vars,
                is_providers_file: true,
            }) as unknown as string,
        ],
        // data file
        [
            `data.tf`,
            replaceVars(source, {
                ...vars,
                is_data_file: true,
            }) as unknown as string,
        ],
        // outputs file
        [
            `outputs.tf`,
            replaceVars(source, {
                ...vars,
                is_outputs_file: true,
            }) as unknown as string,
        ],
        // region files
        ...Object.entries(regions).map(
            ([rCode, r]: [string, layer_region_config]) => {
                const isMain = (r?.id || rCode) === defaultRegion;
                return [
                    `main${(r?.id || rCode) === defaultRegion ? '' : `_${rCode.replace(/-/g, '_')}`}.tf`,
                    replaceVars(source, {
                        ...vars,
                        region: r?.id || rCode,
                        is_main: isMain,
                        is_main_file: true,
                        is_default_region: isMain,
                        rsuffix: isMain ? '' : `-${rCode}`,
                        ...r,
                        ...(vars?.id ? {id: vars.id} : {}),
                    }) as unknown as string,
                ];
            },
        ),
    ] as [string, string][];
};
