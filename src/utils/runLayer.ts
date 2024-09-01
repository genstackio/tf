import rawLogger from "./rawLogger";
import runLayerCommand from "./runLayerCommand";
import { layer } from "../types";

type loggable = { group :string; type: string, data: unknown; error?: boolean };

const platforms: string[] = [
    'darwin_amd64', 'linux_amd64', 'windows_amd64', 'darwin_arm64',
];

export const runLayer = async (layer: layer, action: string) => {
    let logger: ({ group, type, data, error }: { group :string; type: string, data: unknown; error?: boolean } | unknown) => void | undefined;
    let messagesBuffer: (loggable | string)[] = [];
    let needApply: boolean | undefined;
    switch (action) {
        case 'init-full':
            await runLayerCommand(layer, {}, 'terraform', 'init');
            break;
        case 'init-full-upgrade':
            await runLayerCommand(layer, {}, 'terraform', 'init', '-upgrade=true');
            break;
        case 'init':
            logger = ({ group, type, data, error }: { group :string; type: string, data: string; error?: boolean }) => {
                switch (type) {
                    case 'starting':
                        rawLogger({group, type: 'message', data: 'Re-initializing terraform workspace...'});
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
            await runLayerCommand(layer, {logger}, 'terraform', 'init');
            break;
        case 'init-upgrade':
            logger = ({ group, type, data, error }: { group :string; type: string, data: string; error?: boolean }) => {
                switch (type) {
                    case 'starting':
                        rawLogger({group, type: 'message', data: 'Re-initializing terraform workspace...'});
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
            await runLayerCommand(layer, {logger}, 'terraform', 'init', '-upgrade=true');
            break;
        case 'get':
            await runLayerCommand(layer, {}, 'terraform', 'get');
            break;
        case 'providers-lock-delete':
            await runLayerCommand(layer, {}, 'rm', '-f', '.terraform.lock.hcl');
            break;
        case 'clean-dirs':
            await runLayerCommand(layer, {}, 'rm', '-rf', '.terraform/plugins', '.terraform/providers');
            break;
        case 'providers-lock':
            await runLayerCommand(layer, {}, 'terraform', 'providers', 'lock', ...platforms.map(p => `-platform=${p}`));
            break;
        case 'update':
            await runLayerCommand(layer, {}, 'terraform', 'get', '-update');
            break;
        case 'plan':
            await runLayerCommand(layer, {}, 'terraform', 'plan', '-out', 'plan.tfplan');
            break;
        case 'refresh':
            await runLayerCommand(layer, {}, 'terraform', 'refresh');
            break;
        case 'apply':
            await runLayerCommand(layer, {}, 'terraform', 'apply', 'plan.tfplan');
            break;
        case 'output-json':
            logger = ({ group, type, data, error }: { group :string; type: string, data: string; error?: boolean }) => {
                switch (type) {
                    case 'message':
                        if (error) {
                            rawLogger({group, type, data, error});
                        } else {
                            messagesBuffer.push(data);
                        }
                        break;
                    case 'completed':
                        console.log(JSON.stringify({id: group, variables: JSON.parse(messagesBuffer.join("\n"))}));
                        break;
                    default:
                }
            };
            await runLayerCommand(layer, {logger, silent: true}, 'terraform', 'output', '-json', '-no-color');
            break;
        case 'output':
            await runLayerCommand(layer, {silent: true}, 'terraform', 'output');
            break;
        case 'sync':
            logger = ({ group, type, data, error }: { group :string; type: string, data: string; error?: boolean }) => {
                switch (type) {
                    case 'starting':
                        rawLogger({group, type: 'message', data: 'Planning changes...'});
                        break;
                    case 'message':
                        if (undefined === needApply) {
                            if (/ 0 to add, 0 to change, 0 to destroy/.test(data)) {
                                needApply = false;
                            } else if (/To perform exactly these actions, run the following command to apply/.test(data)) {
                                needApply = true;
                                messagesBuffer.forEach(m => rawLogger(m as loggable));
                                messagesBuffer = [];
                            } else if (/No changes. Infrastructure is up-to-date./.test(data)) {
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
            await runLayerCommand(layer, {logger}, 'terraform', 'plan', '-out', 'plan.tfplan');
            if (needApply) {
                await runLayerCommand(layer, {}, 'terraform', 'apply', 'plan.tfplan');
            }
            break;
        case 'sync-full':
            await runLayerCommand(layer, {}, 'terraform', 'plan', '-out', 'plan.tfplan');
            await runLayerCommand(layer, {}, 'terraform', 'apply', 'plan.tfplan');
            break;
        case 'destroy':
            await runLayerCommand(layer, {}, 'terraform', 'plan', '-destroy', '-out', 'destroy.tfplan');
            await runLayerCommand(layer, {}, 'terraform', 'apply', 'destroy.tfplan');
            break;
        default:
            throw new Error(`Unsupported layer action '${action}'`);
    }
};

export default runLayer;
