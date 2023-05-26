import process from 'node:process'
import * as path from 'node:path';

const settings = {
    verbose: false,
    inputPath: 'font-awesome/svgs',
    outputPath: 'layouts/partials/font-awesome',

    get workingDir() {
        return process.cwd()
    },
    get inputDir() {
        return path.resolve(this.workingDir, this.inputPath)
    },
    get outputDir() {
        return path.resolve(this.workingDir, this.outputPath)
    }
}

export const setConfig = (config) => Object.assign(settings, config)

export default settings
