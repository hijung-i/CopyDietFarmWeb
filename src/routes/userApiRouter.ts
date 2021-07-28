import { Console } from 'console'
import { NextFunction, Request, Response, Router } from 'express'
import { setUserResult, StatusCode, StatusMessage, UserResult } from '../models/response'
import { NiceUser, SessionUser, User } from '../models/user'

import userService from '../services/userService'

const router = Router()

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
    const tokenNaver = req.body.tokenNaver as string
    const loginResult: UserResult = await userService.loginNaver(tokenNaver)

    if (loginResult.message === StatusMessage.success) {
        console.log('loginSuccess -> ', loginResult.data)
        userToSession(req, loginResult.data!)

        console.log('save user on session', req.session.user)
    }
    res.status(loginResult.statusCode).send(loginResult.data || loginResult.message)
})

router.post('/login/kakao', async (req: Request, res: Response, next: NextFunction) => {
    console.log('POST /user/login/kakao >>', req.body)
    const user = req.body as User
    const loginResult: UserResult = await userService.loginKakao(user)

    if (loginResult.message === StatusMessage.success) {
        console.log('loginSuccess -> ', loginResult.data)
        userToSession(req, loginResult.data!)

        console.log('save user on session', req.session.user)
    }

    res.status(loginResult.statusCode).send(loginResult.data || loginResult.message)
})

router.post('/login/apple', async (req: Request, res: Response, next: NextFunction) => {
    console.log('POST /user/login/apple >>', req.body)
    const user = req.body as User
    const loginResult: UserResult = await userService.loginApple(user)

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
        userToSession(req, loginResult.data!)

        console.log('save user on session', req.session.user)
    }
    res.status(loginResult.statusCode).send(loginResult.data || loginResult.message)
})

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body as User
    let registerResult: UserResult
    if (user.userInfo === undefined
        || user.userCellNo === undefined
        || user.userId === undefined
        || user.userGender === undefined
        || user.password === undefined) {
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

router.put('/user', async (req: Request, res: Response, next: NextFunction) => {
    let user = req.body as User
    let resultVO: UserResult

    if (user.userInfo === undefined
        || user.userId === undefined
        || user.name === undefined) {
        resultVO = setUserResult(StatusCode.error, StatusMessage.forbidden, {})
        res.status(resultVO.statusCode).send(resultVO.data || resultVO.message)
        return
    }
    user.userEmail = req.session.user?.userEmail
    user.userCellNo = req.session.user?.userCellNo

    userToSession(req, user)
    resultVO = setUserResult(StatusCode.success, StatusMessage.success, {})
    res.status(resultVO.statusCode).send(resultVO.data || resultVO.message)
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
