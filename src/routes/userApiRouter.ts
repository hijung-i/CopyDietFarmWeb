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

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body as User
    const loginResult: UserResult = await userService.login(user)

    if (loginResult.message === StatusMessage.success) {
        console.log('loginSuccess -> ', loginResult.data)

        const sessionUser: SessionUser = {
            userId: loginResult.data?.userId!,
            userCellNo: loginResult.data?.userCellNo!,
            userEmail: loginResult.data?.userEmail!,
            userInfo: loginResult.data?.userInfo!,
            userName: loginResult.data?.userName!
        }

        req.session.user = sessionUser
        req.session.isLoggedIn = true
        req.session.save()

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

export default router