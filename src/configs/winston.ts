import * as path from 'path'
import * as winston from 'winston'

import { globalData } from '../app'
const _LOG_DIR = path.join(globalData.getBaseDir(), 'logs')

const infoTransport = new winston.transports.File({
    filename: 'debug.log',
    dirname: _LOG_DIR,
    level: 'debug'
})

const errorTransport = new winston.transports.File({
    filename: 'error.log',
    dirname: _LOG_DIR,
    level: 'error'
})

const logger = winston.createLogger({
    transports: [infoTransport, errorTransport]
})

const stream = {
    writeDebug: message => {
        logger.debug(new Date().toLocaleString() + ': ' + message)
    },
    writeError: message => {
        logger.error(new Date().toLocaleString() + ': ' + message)
    }
}

export {
    logger, stream
}