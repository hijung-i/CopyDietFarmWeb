import { NextFunction, Request, Response, Router } from 'express'
import { setUserResult, StatusCode, StatusMessage, UserResult } from '../models/response'
import { NiceUser, SessionUser, User } from '../models/user'
import userService from '../services/userService'

import * as winston from '../configs/winston'
import { globalData } from '../app'

const STREAM = winston.stream

const router = Router()
const client_id = 'Kaft2327QoUkggPhMChf'
const client_secret = 'qojmNfIAbA'
const state = 'RANDOM_STATE'
const redirectURI = encodeURI(userService.CALLBACK_SERVER + '/user/callback/naver')

router.get('/naverLoginBtn', function (req: Request, res: Response) {
    const api_url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirectURI + '&state=' + state
    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
    res.end("<a href='" + api_url + "' onclick=\"window.open(this.href, 'naverloginpop', 'titlebar=1, resizable=1, scrollbars=yes, width=600, height=550'); return false\"'><img height='50' src='/images/naver_login@2x.png'/></a>")
})

router.get('/result/kakao', async (req: Request, res: Response, next: NextFunction) => {
    console.log('GET /result/kakao req.query >> ', req.query)
    try {
        const result = await userService.requestKakaoToken(req.query.code)

        const callback = {
            type: 'K',
            code: req.query.code,
            token: result.access_token,
            refreshToken: result.refresh_token,
            kakaoNo: '',
            userId: '',
            password: '',
            userEmail: '',
            userGender: '',
            userCellNo: '',
            userInfo: '',
            userName: ''
        }

        res.locals.callback = callback

        render(req, res, 'loginCallback', {})
    } catch (error) {
        console.log('에러 발생', error)
        STREAM.writeError(JSON.stringify(error))
        res.send('<script>alert("오류가 발생했습니다."); location.href="/";</script>')
    }
})

router.get('/result/naver', async (req: Request, res: Response, next: NextFunction) => {
    console.log('GET /result/naver req.query >> ', req.query)
    try {
        const callback = {
            type: 'N',
            code: req.query.code,
            tokenNaver: req.query.tokenNaver,
            userId: req.query.userId,
            password: req.query.password,
            userEmail: req.query.userEmail,
            userGender: req.query.userGender,
            userCellNo: req.query.userCellNo,
            userInfo: req.query.userInfo,
            userName: req.query.userName
        }

        res.locals.callback = callback

        render(req, res, 'loginCallback', {})
    } catch (error) {
        console.log('에러 발생', error)
        STREAM.writeError(JSON.stringify(error))
        res.send('<script>alert("오류가 발생했습니다."); location.href="/";</script>')
    }
})

router.get('/callback/naver', (req: Request, res: Response, next: NextFunction) => {
    console.log('GET /callback/naver req.query >> ', req.query)

    try {
        const code = req.query.code
        const state = req.query.state
        console.log(code, state)
        const api_url = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id='
        + client_id + '&client_secret=' + client_secret + '&redirect_uri=' + redirectURI + '&code=' + code + '&state=' + state
        const request = require('request')
        const options = {
            url: api_url,
            headers: { 'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret }
        }

        request.get(options, async function (error, response, body) {
            if (!error && response.statusCode === 200) {
                const obj = JSON.parse(body)

                let result = await userService.getNaverUserInfo(obj.access_token)
                console.log('result >>>>', result)
                if (!result?.userCellNo.includes('010') && result?.userCellNo.indexOf('010') > 1) {
                    STREAM.writeError('naver callback -> 잘못된 휴대폰 번호 형식', JSON.stringify(result))
                    res.send('<script>opener.naverCallback(true, "' + JSON.stringify({ reason: 'INVALID_PHONE_NUMBER' }) + '")</script>')
                }

                if (result !== null) {
                    res.send('<script>opener.naverCallback(true, \'' + JSON.stringify(result) + '\');window.close();</script>')
                    return
                }

                res.send('<script>opener.naverCallback(false)</script>')
            } else {
                res.send('<script>opener.naverCallback(false)</script>')
                console.log('error = ' + response.statusCode)
            }
        })
    } catch (error) {
        console.log('에러 발생', error)
        STREAM.writeError(JSON.stringify(error))
        res.send('<script>alert("오류가 발생했습니다."); location.href="/";</script>')
    }
})

router.post('/callback/apple', (req: Request, res: Response, next: NextFunction) => {
    STREAM.writeDebug(`POST /user/callback/apple req.body => ${JSON.stringify(req.body)}`)

    const tokens = req.body.id_token.split('.')

    const parsed = decodeBase64(tokens)

    let params = {
        header: parsed[0],
        content: parsed[1],
        user: req.body.user
    }

    const appleNo = params.content?.email.split('@')[0]
    const userId = appleNo + '@A'

    const lastName: string = (params.user?.name?.lastName === undefined) ? '' : params.user?.name?.lastName
    const firstName: string = (params.user?.name?.firstName === undefined) ? '' : params.user?.name?.firstName

    const callback = {
        type: 'A',
        code: req.body.code,
        token: req.body.id_token,
        refreshToken: '',
        appleNo,
        userId,
        password: userId,
        userEmail: params.content?.email,
        userGender: 'X', // 나이스 인증 임시 비활성화
        userCellNo: userId, // 나이스 인증 임시 값
        userInfo: '',
        userName: lastName.concat(firstName)
    }

    res.locals.callback = callback

    render(req, res, 'loginCallback', {})
    // res.status(200).send('<script>alert("기능 준비중입니다."); location.href="/";</script>')
})

const render = (req: Request, res: Response, view: any, data: any | null) => {
    res.locals.webroot = globalData.getBaseDir()

    const defaultData: any = {
        currentPage: ''
    }
    data.currentPage = data.currentPage || ''
    res.render(view, data || defaultData)
}

const decodeBase64 = (array: Array<any>) => {
    const decodes = new Array()
    array.forEach((v: any) => {

        const decoded = Buffer.from(v, 'base64').toString('utf8')
        if (decoded.includes('{') && decoded.includes(':') && decoded.includes('}')) {
            let json = JSON.parse(decoded)
            decodes.push(json)
        }
    })

    return decodes
}

export default router
