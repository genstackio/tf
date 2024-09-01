import {existsSync, readFileSync} from "fs";
import buildVars from "./buildVars";

export const generateVarsFromTerraformOutputs = (configFile: string, repo: string) => {
    if (!existsSync(configFile)) return '';
    const config = JSON.parse(readFileSync(configFile, 'utf-8'));
    return buildVars(config, repo);
};

export default generateVarsFromTerraformOutputs;
