import { access, constants, mkdir as baseMkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

import config from "./configuration.mjs";

export const doesExist = async (path) => {
    path = resolve(config.workingDir, path)

    try {
        await access(path, constants.R_OK | constants.W_OK)
        return true
    } catch (e) {
        return false
    }
}

export const mkdir = async (path) => {
    path = resolve(config.workingDir, path)

    if (await doesExist(path)) {
        return undefined;
    }

    await mkdir(dirname(path))
    await baseMkdir(path)
}
