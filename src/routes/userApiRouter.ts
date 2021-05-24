import { Console } from 'console'
import { NextFunction, Request, Response, Router } from 'express'
import { setUserResult, StatusCode, StatusMessage, UserResult } from '../models/response'
import { NiceUser, SessionUser, User } from '../models/user'
import userService from '../services/userService'

const router = Router()
const client_id = 'Kaft2327QoUkggPhMChf'
const client_secret = 'qojmNfIAbA'
const state = "RANDOM_STATE"
const redirectURI = encodeURI("http://data-flow.co.kr:3000/user/callback/naver")

/****************************
 * api명: login
 * get -> 현재 로그인 한 유저 정보 환
 * post -> 로그인 요청
 */
router.get('/login', (req: Request, res: Response, next: NextFunction) => {
    let isLoggedIn: boolean | undefined = req.session.isLoggedIn
    console.log('get /user/login,  isLoggedIn=> ', isLoggedIn)
    isLoggedIn = (isLoggedIn === undefined) ? false : isLoggedIn

    res.status(StatusCode.success).send({
        result: {
            user: req.session.user,
            isLoggedIn: isLoggedIn
        }, message: StatusMessage.success
    })
})

router.post('/login/naver', async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body as User
    const loginResult: UserResult = await userService.loginNaver(user)

    if (loginResult.message === StatusMessage.success) {
        console.log('loginSuccess -> ', loginResult.data)
        userToSession(req, user)

        console.log('save user on session', req.session.user)
    }
    res.status(loginResult.statusCode).send(loginResult.data || loginResult.message)
})

router.post('/login/kakao', async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body as User
    const loginResult: UserResult = await userService.loginKakao(user)

    if (loginResult.message === StatusMessage.success) {
        console.log('loginSuccess -> ', loginResult.data)
        userToSession(req, loginResult.data!)

        console.log('save user on session', req.session.user)
    }
    res.status(loginResult.statusCode).send(loginResult.data || loginResult.message)
})

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body as User
    const loginResult: UserResult = await userService.login(user)

    if (loginResult.message === StatusMessage.success) {
        console.log('loginSuccess -> ', loginResult.data)
        userToSession(req, user)

        console.log('save user on session', req.session.user)
    }
    res.status(loginResult.statusCode).send(loginResult.data || loginResult.message)
})

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body as User
    const niceUser: NiceUser | undefined = req.session.niceUserData
    let registerResult: UserResult
    console.log(user, niceUser)

    if (niceUser === undefined || (user.userName !== niceUser.userName
        || user.dupInfo !== niceUser.dupInfo
        || user.userInfo !== niceUser.userInfo
        || user.userCellNo !== niceUser.userCellNo)) {
        registerResult = setUserResult(StatusCode.error, StatusMessage.forbidden, {})

        res.status(registerResult.statusCode).send(registerResult.data || registerResult.message)
        return
    }
    console.log('user data on register', user)

    registerResult = await userService.register(user)

    if (registerResult.message === StatusMessage.success) {
        console.log('registerSuccess -> ', registerResult)

    }
    res.status(registerResult.statusCode).send(registerResult.data || registerResult.message)
})

router.get('/callback/naver', (req: Request, res: Response, next: NextFunction) => {
    console.log('GET /callback/naver req.body >> ', req.body)
    console.log('GET /callback/naver req.query >> ', req.query)
    console.log('GET /callback/naver req.params >> ', req.params)

    const code = req.query.code
    const state = req.query.state
    const api_url = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id='
    + client_id + '&client_secret=' + client_secret + '&redirect_uri=' + redirectURI + '&code=' + code + '&state=' + state
    const request = require('request')
    const options = {
        url: api_url,
        headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
    }
    request.get(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
            console.log(response, body)
            res.writeHead(200, {'Content-Type': 'text/jsoncharset=utf-8'})
            res.end(body)
        } else {
            res.status(response.statusCode).end()
            console.log('error = ' + response.statusCode)
        }
    })

    res.status(200).send('')
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