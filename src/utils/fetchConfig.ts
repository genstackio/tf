import {resolve} from 'path';
import {fetch_config} from '../types';

export const fetchConfig: fetch_config = async (configFile: string) => {
    return import(resolve(configFile));
};

export default fetchConfig;
