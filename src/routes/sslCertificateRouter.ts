import { NextFunction, Request, Response, Router } from 'express'
import * as fs from 'fs'
import path from 'path'
import { globalData } from '../app'
import userService from '../services/userService'

const router = Router()

router.get('/acme-challenge/:fileName', async (req: Request, res: Response, next: NextFunction) => {
    console.log('GET acme-challenge --> ', req.params.fileName)
    const acmeDir = '.well-known/acme-challenge'
    const fileName = req.params.fileName
    const filePath = path.join(acmeDir, fileName)

    let file;
    try{
        file = fs.readFileSync(path.join(globalData.getBaseDir(), filePath))
    } catch(err) {
        console.error(err)
    }

    console.log(file)
    res.send(file)
})

export default router
