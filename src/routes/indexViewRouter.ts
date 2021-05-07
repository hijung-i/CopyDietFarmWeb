import { NextFunction, request, Request, Response, Router } from 'express'
import { DeliveryInfo, User } from '../models/user'
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
    render(res, 'login_new', {})
})
router.get('/sign-up-form', (req: Request, res: Response, next: NextFunction) => {
    const isLoggedIn: boolean | undefined = req.session.isLoggedIn
    console.log(isLoggedIn)
    if (isLoggedIn === true) {
        res.redirect('/')
        return
    }

    const userData: User = req.query

    render(res, 'sign_up', { userData })
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

router.get('/search-list', (req: Request, res: Response, next: NextFunction) => {
    const keyword = req.query.keyword

    render(res, 'products', {
        keyword: keyword,
        listType: 'SEARCH'
    })
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
router.get('/privacypolicy', (req: Request, res: Response, next: NextFunction) => {
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

router.get('/order', (req: Request, res: Response, next: NextFunction) => {
    const deliveryGroupList = req.query.deliveryGroupList
    const orderDTO = JSON.parse(req.query.orderDTO as string)

    const deliveryInfo: DeliveryInfo = {
        userId: '',
        userName: '',
        userCellNo: '',
        addressName: '',
        address: '',
        mainAddressYn: ''
    }

    if (req.session.isLoggedIn === true) {
        orderDTO.userId = 'jgpark'
        orderDTO.userName = '박진국'
        orderDTO.email = 'jgpark@data-flow.co.kr'
        orderDTO.userCellNo = '01055431787'
    } else {
        orderDTO.userId = '비회원주문'
    }

    orderDTO.delivery = deliveryInfo
    orderDTO.deliveryDesc = ''
    orderDTO.paidPointAmount = 0
    orderDTO.paidCouponAmount = 0

    render(res, 'order_info', { deliveryGroupList, orderDTO: JSON.stringify(orderDTO) })
})

router.get('/orderlist', (req: Request, res: Response, next: NextFunction) => {
    render(res, 'mypage_orderList', {})
})
router.get('/ol_detail', (req: Request, res: Response, next: NextFunction) => {
    render(res, 'mypage_orderList_detail', {})
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
    render(res, 'mypage_point', {})
})
router.get('/login-fail', (req: Request, res: Response, next: NextFunction) => {
    render(res, 'login_fail', {})
})

router.get('/mem-with', (req: Request, res: Response, next: NextFunction) => {
    render(res, 'membership_withdrawal', {})
})
router.get('/myinfo-modify', (req: Request, res: Response, next: NextFunction) => {
    render(res, 'myinfo', {})
})
router.get('/myinfo-modify', (req: Request, res: Response, next: NextFunction) => {
    render(res, 'myinfo', {})
})
router.get('/myinfo-usercheck', (req: Request, res: Response, next: NextFunction) => {
    render(res, 'myinfoUserCheck', {})
})
router.get('/order-details', (req: Request, res: Response, next: NextFunction) => {
    render(res, 'order_details', {})
})
router.get('/login002', (req: Request, res: Response, next: NextFunction) => {
    render(res, 'login_tracking', {})
})

const render = (res: Response, view: any, data: any | null) => {
    res.render(view, data || null)
}

export default router