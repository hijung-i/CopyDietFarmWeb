import { NextFunction, Request, Response, Router } from 'express'
import { globalData } from '../app'
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
    render(req, res, 'mypage/mypage_deliver_mag', { userId })
})

router.get('/pick-product', (req: Request, res: Response, next: NextFunction) => {
    checkLogin(req, res, () => {
        render(req, res, 'products', {
            listTitle: '찜한 상품',
            listType: 'ZZIM',
            currentPage: '찜한 상품'
        })
    })
})

router.get('/product-inquiry-form', (req: Request, res: Response, next: NextFunction) => {
    checkLogin(req, res, (sessionUser: SessionUser) => {

        render(req, res, 'product_inquiry', {})
    })
})

router.get('/alarm', (req: Request, res: Response, next: NextFunction) => {
    checkLogin(req, res, (sessionUser: SessionUser) => {

        render(req, res, 'alarm', {})
    })

})

router.get('/orderlist', (req: Request, res: Response, next: NextFunction) => {

    checkLogin(req, res, (sessionUser) => {
        render(req, res, 'mypage/mypage_orderList', {})
    })
})

router.get('/point', (req: Request, res: Response, next: NextFunction) => {

    checkLogin(req, res, (sessionUser) => {
        render(req, res, 'mypage/mypage_point', {})
    })
})

router.get('/coupon', (req: Request, res: Response, next: NextFunction) => {

    checkLogin(req, res, (sessionUser) => {
        render(req, res, 'mypage/coupon', { currentPage: '쿠폰' })
    })
})

router.get('/p_review', (req: Request, res: Response, next: NextFunction) => {
    checkLogin(req, res, (sessionUser) => {
        render(req, res, 'mypage/mypage_productReview', {})
    })
})

router.get('/p_inquiry', (req: Request, res: Response, next: NextFunction) => {
    checkLogin(req, res, (sessionUser) => {
        render(req, res, 'mypage/mypage_productInquiry', {})
    })
})

router.get('/s_inquiry', (req: Request, res: Response, next: NextFunction) => {
    checkLogin(req, res, (sessionUser) => {
        render(req, res, 'mypage/mypage_seller_inquiry', {})
    })
})

router.get('/delivery-status', (req: Request, res: Response, next: NextFunction) => {
    checkLogin(req, res, (sessionUser) => {
        render(req, res, 'mypage/mypage_deliveryStatus', {})
    })
})

const render = (req: Request, res: Response, view: any, data: any | null) => {
    res.locals.isLoggedIn = req.session.isLoggedIn || false
    res.locals.user = req.session.user
    res.locals.webroot = globalData.getBaseDir()
    const defaultData: any = {
        currentPage: ''
    }
    data.currentPage = data.currentPage || ''
    res.render(view, data || defaultData)
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