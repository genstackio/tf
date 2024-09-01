import {dirname} from 'path';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'fs';
import replaceVars from './replaceVars';

export const generateEnvLayerFromFile = async (
    sourceFile: string,
    targetFile: string,
    vars: Record<string, unknown>,
) => {
    const parentDir = dirname(targetFile);
    existsSync(parentDir) || mkdirSync(parentDir, {recursive: true});
    writeFileSync(
        targetFile,
        replaceVars(
            readFileSync(sourceFile, 'utf8') as string,
            vars,
        ) as unknown as string,
    );
};

export default generateEnvLayerFromFile;
