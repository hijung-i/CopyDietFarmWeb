import { NextFunction, Request, Response, Router } from 'express'
import { SessionUser } from '../models/user'
const router = Router()

router.get('/cart', (req: Request, res: Response, next: NextFunction) => {
    checkLogin(req, res, (sessionUser: SessionUser) => {
        res.redirect('/cart/' + sessionUser.userId)
    })
})

router.get('/cart/:userId', (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId

    checkLogin(req, res, (sessionUser: SessionUser) => {
        if (userId !== sessionUser.userId) {
            res.send('<script>alert("잘못된 접근입니다.");location.href = "/";</script>')
        } else {
            render(req, res, 'cart', { userId: userId })
        }
    })
})

router.get('/delivery-management', (req: Request, res: Response, next: NextFunction) => {
    checkLogin(req, res, (sessionUser: SessionUser) => {
        res.redirect('/delivery-management/' + sessionUser.userId)
    })
})

router.get('/delivery-management/:userId', (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId
    render(req, res, 'mypage_deliver_mag', { userId })
})

router.get('/pick-product', (req: Request, res: Response, next: NextFunction) => {
    checkLogin(req, res, () => {
        render(req, res, 'products', {
            listTitle: '찜한 상품',
            listType: 'ZZIM'
        })
    })
})

router.get('/product-inquiry-form', (req: Request, res: Response, next: NextFunction) => {
    checkLogin(req, res, (sessionUser: SessionUser) => {

        render(req, res, 'product_inquiry', {})
    })
})

const render = (req: Request, res: Response, view: any, data: any | null) => {
    res.locals.isLoggedIn = req.session.isLoggedIn
    res.locals.user = req.session.user

    res.render(view, data || null)
}

function checkLogin(req: Request, res: Response, next: Function) {
    const isLoggedIn = req.session.isLoggedIn
    if (isLoggedIn !== true) {
        res.send('<script>alert("로그인이 필요한 접근입니다.");location.href = "/login-form";</script>')
    } else {
        next(req.session.user)
    }
}

export default router