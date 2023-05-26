import { parse } from 'node-html-parser';
import * as fs from 'node:fs/promises'
import * as path from 'node:path';
import Handlebars from "handlebars";
import { decode } from "html-entities";

import config from "./configuration.mjs"
import logger from "./logger.mjs";
import * as fsUtils from "./fsUtils.mjs"

let template = undefined

const loadTemplate = async () => {
    if (template) {
        return template
    }

    const content = await fs.readFile(path.join(config.workingDir, 'src/partial.svg.template'), { encoding: 'utf8' })
    template = Handlebars.compile(content)
    return template
}

export default async ({ filename, dirname, fullPath }) => {
    logger.debug('Processing', fullPath)
    const outputDir = path.resolve(config.outputDir, dirname)

    await fsUtils.mkdir(outputDir)

    const htmlString = await fs.readFile(fullPath)
    const html = parse(htmlString)
    const attributes = Object.keys(html.firstChild.attributes)
        .reduce((str, key) => `${str} ${key}="${html.firstChild.attributes[key]}"`, '').trim()
    const template = await loadTemplate()
    const rawSvg = template({ attributes, content: html.firstChild.innerHTML.trim() })
    const svg = decode(rawSvg)

    await fs.writeFile(path.join(outputDir, filename), svg, { encoding: 'utf8' })
}
