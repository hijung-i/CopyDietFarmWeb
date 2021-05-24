import { NextFunction, Request, Response, Router } from 'express'
import { setUserResult, StatusCode, StatusMessage, UserResult } from '../models/response'
import { NiceUser, SessionUser, User } from '../models/user'
import userService from '../services/userService'

const router = Router()
const client_id = 'Kaft2327QoUkggPhMChf'
const client_secret = 'qojmNfIAbA'
const state = 'RANDOM_STATE'
const redirectURI = encodeURI('http://192.168.0.3/user/callback/naver')

router.get('/naverlogin', function (req: Request, res: Response) {
    const api_url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirectURI + '&state=' + state
    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
    res.end("<a href='" + api_url + "' onclick=\"window.open(this.href, 'naverloginpop', 'titlebar=1, resizable=1, scrollbars=yes, width=600, height=550'); return false\"'><img height='50' src='/images/naver_login@2x.png'/></a>")
 })

router.get('/callback/naver', (req: Request, res: Response, next: NextFunction) => {
    console.log('GET /callback/naver req.query >> ', req.query)

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
    request.get(options, function (error, response, body) {
      if (!error && response.statusCode === 200) {
            res.writeHead(200, { 'Content-Type': 'text/jsoncharset=utf-8' })
            console.log(body)
            res.end(body)
        } else {
            res.status(response.statusCode).end()
            console.log('error = ' + response.statusCode)
        }
    })

})

const userToSession = (req: Request, user: User) => {
    const sessionUser: SessionUser = {
        userId: user?.userId!,
        userCellNo: user?.userCellNo!,
        userEmail: user?.userEmail!,
        userInfo: user?.userInfo!,
        userName: user?.name!
    }

    req.session.user = sessionUser
    req.session.isLoggedIn = true
    req.session.save()
}

export default router
