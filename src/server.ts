import app, { globalData } from './app'
import * as path from 'path'
import * as fs from 'fs'

import * as http from 'http'
import * as https from 'https'

const options = {
    pfx: fs.readFileSync(path.join(globalData.getBaseDir(), '/cert/cert.pfx')),
    passphrase: 'dataflow0327!@'
}

const httpServer = http.createServer(app)
const httpsServer = https.createServer(options, app)

httpServer.listen(80, () => {
    console.log('SERVER IS LISTENING PORT 80')
})

// httpsServer.listen(443, () => {
//     console.log('SERVER IS LISTENING PORT 443')
// })
