import { NextFunction, Request, Response, Router } from 'express'
import { setUserResult, StatusCode, StatusMessage, UserResult } from '../models/response'
import { NiceUser, SessionUser, User } from '../models/user'
import userService from '../services/userService'

const router = Router()
const client_id = 'Kaft2327QoUkggPhMChf'
const client_secret = 'qojmNfIAbA'
const state = 'RANDOM_STATE'
const redirectURI = encodeURI('http://data-flow.co.kr:3000/user/callback/naver')

router.get('/naverLoginBtn', function (req: Request, res: Response) {
    const api_url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirectURI + '&state=' + state
    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
    res.end("<a href='" + api_url + "' onclick=\"window.open(this.href, 'naverloginpop', 'titlebar=1, resizable=1, scrollbars=yes, width=600, height=550'); return false\"'><img height='50' src='/images/naver_login@2x.png'/></a>")
})

router.get('/kakaoLogin', async (req: Request, res: Response) => {
    console.log('body >>>>', req.body)
    console.log('body >>>>', req.query)
    console.log('body >>>>', req.params)

    res.send('')
})

router.get('/callback/kakao', async (req: Request, res: Response, next: NextFunction) => {
    console.log('GET /callback/kakao req.query >> ', req.query)
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

    res.render('loginCallback')
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
    request.get(options, async function (error, response, body) {
        if (!error && response.statusCode === 200) {
            const obj = JSON.parse(body)
            console.log('body >>>', obj)

            let result = await userService.getNaverUserInfo(obj.access_token)
            console.log('result >>>>', result)
            if (result !== null) {
                res.locals.callback = result
                res.render('loginCallback')
            }
            res.send('<script>alert("네이버 로그인에 실패했습니다.");location.href="/";</script>')
        } else {
            res.send('<script>alert("네이버 로그인에 실패했습니다.");location.href="/";</script>')
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
