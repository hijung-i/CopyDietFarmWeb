import { NextFunction, request, Request, Response, Router } from 'express'
const router = Router()
router.get('/', (req: Request, res: Response, next: NextFunction) => {
    const isLoggedIn: boolean | undefined = req.session.isLoggedIn
    if (isLoggedIn === true) {
        console.log('session', req.session)
        console.log('sessionId', req.sessionID)
    }
    render(res, 'index', {})
})
router.get('/login-form', (req: Request, res: Response, next: NextFunction) => {
    const isLoggedIn: boolean | undefined = req.session.isLoggedIn
    console.log(isLoggedIn)
    if (isLoggedIn === true) {
        res.redirect('/')
        return
    }
    render(res, 'login', {})
})
router.get('/sign-up-form', (req: Request, res: Response, next: NextFunction) => {
    const isLoggedIn: boolean | undefined = req.session.isLoggedIn
    console.log(isLoggedIn)
    if (isLoggedIn === true) {
        res.redirect('/')
        return
    }
    render(res, 'sign_up', {})
})

router.get('/product/:productCode', (req: Request, res: Response, next: NextFunction) => {
    const productCode = req.params.productCode
    render(res, 'product', { productCode: productCode })
})
router.get('/products/:salesStandCode/event', (req: Request, res: Response, next: NextFunction) => {
    const standCode = req.params.salesStandCode
    console.log(standCode)

    render(res, 'products', {
        standCode: standCode,
        listType: 'EVENT'
    })
})
router.get('/products/:category1Code/category/:category2Code', (req: Request, res: Response, next: NextFunction) => {
    const category1Code = req.params.category1Code
    const category2Code = req.params.category2Code

    render(res, 'products', {
        category1Code: category1Code,
        category2Code: category2Code,
        listType: 'CATEGORY'
    })
})
router.get('/search-form', (req: Request, res: Response, next: NextFunction) => {
    render(res, 'search', {})
})
router.get('/mypage', (req: Request, res: Response, next: NextFunction) => {
    const isLoggedIn = req.session.isLoggedIn || false
    console.log('isLoggedIn ->> ', isLoggedIn)
    render(res, 'my_page', { isLoggedIn: isLoggedIn })
})
router.get('/faq', (req: Request, res: Response, next: NextFunction) => {
    render(res, 'faq', {})
})
router.get('/notice', (req: Request, res: Response, next: NextFunction) => {
    render(res, 'notice', {})
})
router.get('/notice/:boardNo', (req: Request, res: Response, next: NextFunction) => {
    const boardNo = req.params.boardNo
    render(res, 'notice_detail', { boardNo: boardNo })
})
router.get('/cs-center', (req: Request, res: Response, next: NextFunction) => {
    render(res, 'cs_center', {})
})
router.get('/privacyPolicy', (req: Request, res: Response, next: NextFunction) => {
    render(res, 'privacy_policy', {})
})
router.get('/invite', (req: Request, res: Response, next: NextFunction) => {
    render(res, 'invite', {})
})
router.get('/delivery-info', (req: Request, res: Response, next: NextFunction) => {
    render(res, 'delivery_info', {})
})
router.get('/pick-product', (req: Request, res: Response, next: NextFunction) => {
    render(res, 'pick_product', {})
})
router.get('/pwdReset', (req: Request, res: Response, next: NextFunction) => {
    render(res, 'pwdReset', {})
})
router.get('/order-comp', (req: Request, res: Response, next: NextFunction) => {
    render(res, 'order_complete', {})
})
router.get('/order-info', (req: Request, res: Response, next: NextFunction) => {
    render(res, 'order_info', {})
})
router.get('/alarm', (req: Request, res: Response, next: NextFunction) => {
    render(res, 'alarm', {})
})
router.get('/terms', (req: Request, res: Response, next: NextFunction) => {
    render(res, 'terms_of_service', {})
})
router.get('/products', (req: Request, res: Response, next: NextFunction) => {
    render(res, 'products', {})
})
router.get('/product', (req: Request, res: Response, next: NextFunction) => {
    render(res, 'product', {})
})
router.get('/orderlist', (req: Request, res: Response, next: NextFunction) => {
    render(res, 'mypage_orderList', {})
})
router.get('/ol_detail', (req: Request, res: Response, next: NextFunction) => {
    render(res, 'mypage_orderList_detail', {})
})
router.get('/delivermag', (req: Request, res: Response, next: NextFunction) => {
    render(res, 'mypage_deliver_mag', {})
})
router.get('/p_review', (req: Request, res: Response, next: NextFunction) => {
    render(res, 'mypage_productReview', {})
})
router.get('/p_inquiry', (req: Request, res: Response, next: NextFunction) => {
    render(res, 'mypage_productInquiry', {})
})
router.get('/s_inquiry', (req: Request, res: Response, next: NextFunction) => {
    render(res, 'web_seller_inquiry', {})
})
router.get('/point', (req: Request, res: Response, next: NextFunction) => {
    render(res, 'mypage_orderList_point', {})
})
router.get('/login-fail', (req: Request, res: Response, next: NextFunction) => {
    render(res, 'login_fail', {})
})
router.get('/cart', (req: Request, res: Response, next: NextFunction) => {
    render(res, 'cart', {})
})
const render = (res: Response, view: any, data: any | null) => {
    res.render(view, data || null)
}

export default router