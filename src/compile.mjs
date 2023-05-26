import process from 'node:process'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { glob } from "glob"
import yargs from "yargs"

const argv = yargs(process.argv.slice(2)).argv

import config, { setConfig } from "./configuration.mjs"
setConfig({ verbose: argv.verbose })

import * as fsUtils from "./fsUtils.mjs"
import logger from "./logger.mjs";
import convertIcon from "./convertIcon.mjs";

if (fsUtils.doesExist(config.outputDir)) {
    logger.info('Cleaning output directory')
    const outputFiles = await glob(path.join(config.outputDir, '**/*.svg'))

    for (const file of outputFiles) {
        await fs.unlink(file)
    }
} else {
    await fs.mkdir(config.outputDir)
}

const files = await glob(path.join(config.inputDir, '**/*.svg'))

if (files.length === 0) {
    logger.error(`!!! Could not find the Hero Icons under "${config.inputDir}". Make sure the Hero Icon submodule is cloned.`)
    process.exit(1)
}

for(const file of files) {
    await convertIcon({
        fullPath: file,
        filename: path.basename(file),
        dirname: path.relative(config.inputDir, path.dirname(file))
    })
}
