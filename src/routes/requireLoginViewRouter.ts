import { NextFunction, request, Request, Response, Router } from 'express'

const router = Router()

router.get('/product-inquiry-form', (req: Request, res: Response, next: NextFunction) => {
    const isLoggedIn: boolean | undefined = req.session.isLoggedIn
    // if (isLoggedIn !== true) {
    //     res.send('<script>alert("로그인이 필요한 페이지입니다.");location.href = "/";</script>')
    //     return
    // }

    render(res, 'product_inquiry', {})
})

const render = (res: Response, view: any, data: any | null) => {
    res.render(view, data || null)
}

export default router