import rawLogger from "./rawLogger";
import {spawn} from "child_process";
import {layer} from "../types";

export const runLayerCommand = async ({ name, path }: layer, {logger = rawLogger, silent = false}, cmd: string, ...args: string[]) =>
    new Promise((resolve, reject) => {
        const p = spawn(cmd, args, {cwd: path});
        logger({group: name, type: 'starting', data: {cmd, args, path}});
        p.stdout.on('data', (data) => {
            data.toString().replace(/(\r\n|\n)$/, '').split(/\r\n/).forEach((s: string) => {
                s.split(/\n/).forEach((ss: string) => {
                    logger({group: name, type: 'message', data: ss});
                });
            });
        });
        p.stderr.on('data', (data) => {
            data.toString().replace(/(\r\n|\n)$/, '').split(/\r\n/).forEach((s: string) => {
                s.split(/\n/).forEach((ss: string) => {
                    logger({group: name, type: 'message', data: ss, error: true});
                });
            });
        });
        p.on('error', (code) => {
            logger({group: name, type: 'not-launched', data: {cmd, args, code, path}});
            throw new Error(`Failed to execute ${cmd} ${args.join(' ')} in ${path} (layer: ${name}, exit-code: ${code})`);
        });
        p.on('close', (code) => {
            if (0 === code) {
                logger({group: name, type: 'completed', data: {cmd, args, code, path}});
                resolve(code);
            } else {
                if (silent) {
                    logger({group: name, type: 'completed', data: {cmd, args, code, path}});
                    resolve(code);
                } else {
                    logger({group: name, type: 'aborted', data: {cmd, args, code, path}});
                    reject(new Error(`Layer '${name}' command [${cmd} ${args.join(' ')}] exited with code [${code}] (cwd: ${path})`));
                }
            }
        });
    })
;

export default runLayerCommand;
