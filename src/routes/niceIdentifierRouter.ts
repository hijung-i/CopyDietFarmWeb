import { NextFunction, Request, Response, Router } from 'express'
import { StatusCode, StatusMessage, UserResult } from '../models/response'
import { SessionUser, User } from '../models/user'
import userService from '../services/userService'

const router = Router()

/****************************
 *  SCRIPTS FOR NICE IDENTIFIER
 *  Author: jgpark
 */

const sSiteCode = 'BT514'
const sSitePW = 'tQSumidmqcYh'

const sModulePath = 'D:\dataflow\nodejs\dietfarmweb\nice_modules\window\CPClient.exe'
// const sModulePath = '/home/dataflow1/DietFarm/Api/nice_modules/linux/CPClient_64bit'

// 우분투
// const serverIp = '112.217.209.162'
const serverIp = '127.0.0.1'
const sAuthType = ''
const sPopGubun = 'Y'
const sCustomize = ''
const sGender = ''

const sReturnUrl = `http://${serverIp}':9090/niceId/checkplus_success` // 성공시 이동될 URL (방식 : 프로토콜을 포함한 절대 주소)
const sErrorUrl = `http://${serverIp}:9090/niceId/checkplus_fail` // 실패시 이동될 URL (방식 : 프로토콜을 포함한 절대 주소)

router.post('/checkplus_success', (req: Request, res: Response, next: NextFunction) => {
    let sEncData = req.body.EncodeData
    const cmd = ''

    if (/^0-9a-zA-Z+\/=/.test(sEncData) === true) {
        const sRtnMSG = '입력값 오류'
        const requestnumber = ''
        const authtype = ''
        const errcode = ''
        res.render('checkplus_fail.ejs', { sRtnMSG, requestnumber, authtype, errcode })
      }

    res.render('')
})

export default router