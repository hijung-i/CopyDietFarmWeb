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
        file = fs.readFile(path.join(globalData.getBaseDir(), filePath), { encoding: 'utf-8' }, (data) => {
            res.send(data);
        })

    } catch(err) {
        res.send('')
        console.error(err)
    }

})

export default router
