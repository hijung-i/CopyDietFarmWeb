import { NextFunction, Request, Response, Router } from 'express'
import { StatusCode, StatusMessage, UserResult } from '../models/response'
import { SessionUser, User } from '../models/user'
import userService from '../services/userService'

const router = Router()

/****************************
 * api명: login
 * get -> 현재 로그인 한 유저 정보 환
 * post -> 로그인 요청
 */
router.get('/login', (req: Request, res: Response, next: NextFunction) => {
    let isLoggedIn: boolean | undefined = req.session.isLoggedIn
    isLoggedIn = (isLoggedIn) ? isLoggedIn : false

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
            name: loginResult.data?.name!
        }

        req.session.user = sessionUser
        req.session.isLoggedIn = true
        req.session.save()

        console.log('save user on session', req.session.user)
    }
    res.status(loginResult.statusCode).send(loginResult.data || loginResult.message)
})

export default router