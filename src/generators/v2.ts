import {enriched_layer_config, layer_region_config} from '../types';
import replace from '../utils/replaceVars';

export default async (
    s: string,
    {
        regions,
        defaultRegion,
    }: {regions: Record<string, layer_region_config>; defaultRegion: string},
    vars: Record<string, unknown>,
    _: enriched_layer_config,
) => {
    return [
        [`terraform.tf`, replace(s, {...vars, is_terraform_file: true})],
        [`data.tf`, replace(s, {...vars, is_data_file: true})],
        [`locals.tf`, replace(s, {...vars, is_locals_file: true})],
        [`variables.tf`, replace(s, {...vars, is_variables_file: true})],
        [
            `providers.tf`,
            replace(s, {
                ...vars,
                extra_providers: Object.entries(regions)
                    .map(([rCode, r]: [string, layer_region_config]) => {
                        const region = r?.id || rCode;
                        const isMain = region === defaultRegion;
                        return isMain
                            ? undefined
                            : {type: 'aws', alias: rCode, region};
                    })
                    .filter(x => !!x)
                    .sort((a, b) =>
                        (a?.alias as string).localeCompare(b?.alias as string),
                    ),
                is_providers_file: true,
            }) as unknown as string,
        ],
        // region outputs files
        ...Object.entries(regions).map(
            ([rCode, r]: [string, layer_region_config]) => {
                const isDefault = (r?.id || rCode) === defaultRegion;
                return [
                    `outputs${isDefault ? '' : `_${rCode.replace(/-/g, '_')}`}.tf`,
                    replace(s, {
                        ...vars,
                        region: r?.id || rCode,
                        is_default_outputs: isDefault,
                        is_outputs_file: true,
                        is_default_region: isDefault,
                        psuffix: isDefault ? '' : `.${rCode}`,
                        rsuffix: isDefault ? '' : `-${rCode}`,
                        ...r,
                        ...(vars?.id ? {id: vars.id} : {}),
                    }) as unknown as string,
                ];
            },
        ),
        // region main files
        ...Object.entries(regions).map(
            ([rCode, r]: [string, layer_region_config]) => {
                const isMain = (r?.id || rCode) === defaultRegion;
                return [
                    `main${(r?.id || rCode) === defaultRegion ? '' : `_${rCode.replace(/-/g, '_')}`}.tf`,
                    replace(s, {
                        ...vars,
                        region: r?.id || rCode,
                        is_main: isMain,
                        is_default_main: isMain,
                        is_main_file: true,
                        is_default_region: isMain,
                        psuffix: isMain ? '' : `.${rCode}`,
                        rsuffix: isMain ? '' : `-${rCode}`,
                        ...r,
                        ...(vars?.id ? {id: vars.id} : {}),
                    }) as unknown as string,
                ];
            },
        ),
        // region sub files
        ...Object.entries(regions).map(
            ([rCode, r]: [string, layer_region_config]) => {
                const isSub = (r?.id || rCode) === defaultRegion;
                return [
                    `sub${(r?.id || rCode) === defaultRegion ? '' : `_${rCode.replace(/-/g, '_')}`}.tf`,
                    replace(s, {
                        ...vars,
                        region: r?.id || rCode,
                        is_sub: isSub,
                        is_default_sub: isSub,
                        is_sub_file: true,
                        is_default_region: isSub,
                        psuffix: isSub ? '' : `.${rCode}`,
                        rsuffix: isSub ? '' : `-${rCode}`,
                        ...r,
                        ...(vars?.id ? {id: vars.id} : {}),
                    }) as unknown as string,
                ];
            },
        ),
    ]
        .map(x => [x[0], (x[1] as string)?.trim()])
        .filter(x => x[1]) as [string, string][];
};
