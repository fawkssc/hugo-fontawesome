import config from "./configuration.mjs";

const logger = {
    ...console,
    debug: (...data) => {
        if (config.verbose) {
            console.debug(...data)
        }
    }
}

export default logger
