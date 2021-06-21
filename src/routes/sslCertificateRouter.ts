import { globalData } from '../app'
import { NextFunction, Request, Response, Router } from 'express'
import * as fs from 'fs'
import * as path from 'path'

const router = Router()

router.get('/acme-challenge/:fileName', async (req: Request, res: Response, next: NextFunction) => {
    const acmeDir = '.well-known/acme-challenge'
    const fileName = req.params.fileName
    const filePath = path.join(globalData.getBaseDir(), path.join(acmeDir, fileName))
    console.log(filePath)

    try {
        fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
	    if (err) console.log(err)
	    console.log(data)
            res.send(data)
        })
    } catch (err) {
        res.send('')
        console.error(err)
    }
})

export default router
