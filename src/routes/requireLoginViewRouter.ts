import { NextFunction, request, Request, Response, Router } from 'express'
import { SessionUser } from '../models/user'
const router = Router()

router.get('/cart', (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId
    checkLogin(req, res, (sessionUser: SessionUser) => {
        if (userId !== sessionUser.userId) {
            res.send('<script>alert("로그인 후 이용해주세요");location.href = "/login-form";</script>')
            return
        }
        res.redirect('/cart/' + userId)
    })
})

router.get('/cart/:userId', (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId

    checkLogin(req, res, (sessionUser: SessionUser) => {
        if (userId !== sessionUser.userId) {
            res.send('<script>alert("잘못된 접근입니다.");location.href = "/";</script>')
        }
    })

    render(res, 'cart', { userId: userId })
})

router.get('/product-inquiry-form', (req: Request, res: Response, next: NextFunction) => {
    checkLogin(req, res, (sessionUser: SessionUser) => {
        render(res, 'product_inquiry', {})
    })
})

const render = (res: Response, view: any, data: any | null) => {
    res.render(view, data || null)
}

function checkLogin(req: Request, res: Response, next: Function) {
    const isLoggedIn = req.session.isLoggedIn
    if (isLoggedIn !== true) {
        res.send('<script>alert("로그인이 필요한 페이지입니다.");location.href = "/";</script>')
    } else {
        next(req.session.user)
    }
}

export default router