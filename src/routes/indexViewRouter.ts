import { NextFunction, request, Request, Response, Router } from 'express'
import { DeliveryInfo, SessionUser, User } from '../models/user'
const qs = require('querystring')

const router = Router()
router.get('/', (req: Request, res: Response, next: NextFunction) => {
    const isLoggedIn: boolean | undefined = req.session.isLoggedIn
    if (isLoggedIn === true) {
        console.log('session', req.session)
        console.log('sessionId', req.sessionID)
    }
    render(req, res, 'index', { currentPage: 'main' })
})

router.get('/logout', (req: Request, res: Response, next: NextFunction) => {
    req.session.isLoggedIn = false
    req.session.user = undefined
    req.session.destroy(function() {
        res.redirect('/')
    })
})

router.get('/login-form', (req: Request, res: Response, next: NextFunction) => {
    const isLoggedIn: boolean | undefined = req.session.isLoggedIn
    console.log(isLoggedIn)
    if (isLoggedIn === true) {
        res.redirect('/')
        return
    }
    render(req, res, 'login_new', {})
})
router.get('/sign-up-form', (req: Request, res: Response, next: NextFunction) => {
    const isLoggedIn: boolean | undefined = req.session.isLoggedIn
    console.log(isLoggedIn)
    if (isLoggedIn === true) {
        res.redirect('/')
        return
    }

    const userData: User = req.query

    render(req, res, 'sign_up', { userData })
})

router.get('/product/:productCode', (req: Request, res: Response, next: NextFunction) => {
    const productCode = req.params.productCode
    render(req, res, 'product', { productCode: productCode })
})
router.get('/products/:salesStandCode/event', (req: Request, res: Response, next: NextFunction) => {
    const standCode = req.params.salesStandCode
    console.log(standCode)

    render(req, res, 'products', {
        standCode: standCode,
        listType: 'EVENT',
        listTitle: '',
        currentPage: 'products'
    })
})
router.get('/products/:category1Code/category/:category2Code', (req: Request, res: Response, next: NextFunction) => {
    const category1Code = req.params.category1Code
    const category2Code = req.params.category2Code

    render(req, res, 'products', {
        category1Code: category1Code,
        category2Code: category2Code,
        listType: 'CATEGORY',
        listTitle: '',
        currentPage: 'products'
    })
})
router.get('/search-form', (req: Request, res: Response, next: NextFunction) => {
    render(req, res, 'search', { currentPage: '검색' })
})

router.get('/search-list', (req: Request, res: Response, next: NextFunction) => {
    const keyword = req.query.keyword

    render(req, res, 'products', {
        keyword: keyword,
        listType: 'SEARCH',
        listTitle: '',
        currentPage: 'products'
    })
})

router.get('/mypage', (req: Request, res: Response, next: NextFunction) => {
    const isLoggedIn = req.session.isLoggedIn || false
    const sessionUser = req.session.user || {}
    console.log('isLoggedIn ->> ', isLoggedIn, sessionUser)

    render(req, res, 'my_page', { isLoggedIn: isLoggedIn, sessionUser, currentPage: '마이페이지' })
})
router.get('/faq', (req: Request, res: Response, next: NextFunction) => {
    render(req, res, 'faq', {})
})
router.get('/notice', (req: Request, res: Response, next: NextFunction) => {
    render(req, res, 'notice', {})
})
router.get('/notice/:boardNo', (req: Request, res: Response, next: NextFunction) => {
    const boardNo = req.params.boardNo
    render(req, res, 'notice_detail', { boardNo: boardNo })
})
router.get('/cs-center', (req: Request, res: Response, next: NextFunction) => {
    render(req, res, 'cs_center', {})
})
router.get('/privacypolicy', (req: Request, res: Response, next: NextFunction) => {
    render(req, res, 'privacy_policy', {})
})
router.get('/invite', (req: Request, res: Response, next: NextFunction) => {
    render(req, res, 'invite', {})
})
router.get('/delivery-info', (req: Request, res: Response, next: NextFunction) => {
    render(req, res, 'delivery_info', {})
})

router.get('/pwdReset', (req: Request, res: Response, next: NextFunction) => {
    render(req, res, 'pwdReset', {})
})
router.get('/order-comp', (req: Request, res: Response, next: NextFunction) => {
    res.locals.orderDTO = JSON.parse(req.query.requestOrderDTO as string)
    console.log(res?.locals.orderDTO)

    render(req, res, 'order_complete', {})
})

router.get('/ol_detail/:orderNumber', (req: Request, res: Response, next: NextFunction) => {
    const orderNumber: string = req.params.orderNumber

    if (orderNumber.length > 15 || orderNumber.length < 14) {
        res.send('<script>alert("올바르지 않은 주문번호입니다.");location.href = "/orderlist";</script>')
    } else {
        render(req, res, 'mypage_orderList_detail', { orderNumber })
    }
})

router.get('/terms', (req: Request, res: Response, next: NextFunction) => {
    render(req, res, 'terms_of_service', {})
})
router.get('/products', (req: Request, res: Response, next: NextFunction) => {
    render(req, res, 'products', {})
})
router.get('/product', (req: Request, res: Response, next: NextFunction) => {
    render(req, res, 'product', {})
})
router.get('/membership', (req: Request, res: Response, next: NextFunction) => {
    render(req, res, 'membership', {})
})
router.get('/n_member', (req: Request, res: Response, next: NextFunction) => {
    render(req, res, 'new_membership', {})
})
router.get('/f_invite', (req: Request, res: Response, next: NextFunction) => {
    render(req, res, 'friend_invite', {})
})
router.get('/f_purchase', (req: Request, res: Response, next: NextFunction) => {
    render(req, res, 'first_purchase', {})
})
router.get('/m_save', (req: Request, res: Response, next: NextFunction) => {
    render(req, res, 'money_save', {})
})
router.get('/k_friend', (req: Request, res: Response, next: NextFunction) => {
    render(req, res, 'kakao_friend', {})
})
router.get('/b_event', (req: Request, res: Response, next: NextFunction) => {
    render(req, res, 'birthday_event', {})
})
router.get('/r_event', (req: Request, res: Response, next: NextFunction) => {
    render(req, res, 'review_event', {})
})
router.get('/order', (req: Request, res: Response, next: NextFunction) => {
    const sessionUser: SessionUser | undefined = req.session.user

    const deliveryGroupListStr = req.query.deliveryGroupList as string
    const orderDTOStr = req.query.orderDTO as string

    const deliveryGroupList = JSON.parse(qs.unescape(deliveryGroupListStr))
    const orderDTO = JSON.parse(orderDTOStr)
    const deliveryInfo: DeliveryInfo = {
        userId: '',
        userName: '',
        userCellNo: '',
        addressName: '',
        address: '',
        mainAddressYn: ''
    }
    try {
        console.log(sessionUser)
        if (req.session.isLoggedIn === true) {
            orderDTO.userId = sessionUser!.userId
            orderDTO.userName = sessionUser!.userName
            orderDTO.userEmail = sessionUser!.userEmail
            orderDTO.userCellNo = sessionUser!.userCellNo
        } else {
            orderDTO.userId = '비회원주문'
        }
    } catch (err) {
        console.log('GET /order >> error', err)
    }

    orderDTO.delivery = deliveryInfo
    orderDTO.deliveryDesc = ''
    orderDTO.paidPointAmount = 0
    orderDTO.paidCouponAmount = 0

    render(req, res, 'order_info', { deliveryGroupList: JSON.stringify(deliveryGroupList), orderDTO: JSON.stringify(orderDTO) })
})

router.get('/p_review', (req: Request, res: Response, next: NextFunction) => {
    render(req, res, 'mypage_productReview', {})
})
router.get('/p_inquiry', (req: Request, res: Response, next: NextFunction) => {
    render(req, res, 'mypage_productInquiry', {})
})
router.get('/s_inquiry', (req: Request, res: Response, next: NextFunction) => {
    render(req, res, 'mypage_seller_inquiry', {})
})
router.get('/s_inquiry_more', (req: Request, res: Response, next: NextFunction) => {
    render(req, res, 'web_seller_inquiry', {})
})
router.get('/login-fail', (req: Request, res: Response, next: NextFunction) => {
    render(req, res, 'login_fail', {})
})

router.get('/mem-with', (req: Request, res: Response, next: NextFunction) => {
    render(req, res, 'membership_withdrawal', {})
})
router.get('/myinfo-modify', (req: Request, res: Response, next: NextFunction) => {
    render(req, res, 'myinfo', {})
})
router.get('/myinfo-modify', (req: Request, res: Response, next: NextFunction) => {
    render(req, res, 'myinfo', {})
})
router.get('/myinfo-usercheck', (req: Request, res: Response, next: NextFunction) => {
    render(req, res, 'myinfoUserCheck', {})
})
router.get('/order-details', (req: Request, res: Response, next: NextFunction) => {
    render(req, res, 'order_details', {})
})
/* 새 화면 추가 보기용 (파일명 임시)*/
router.get('/login002', (req: Request, res: Response, next: NextFunction) => {
    render(req, res, 'login_tracking', {})
})
router.get('/order002', (req: Request, res: Response, next: NextFunction) => {
    render(req, res, 'order_info_point', {})
})
router.get('/kakao-event', (req: Request, res: Response, next: NextFunction) => {
    render(req, res, 'kakao_add', {})
})
router.get('/benefits', (req: Request, res: Response, next: NextFunction) => {
    render(req, res, 'benefits', {})
})
router.get('/coupon', (req: Request, res: Response, next: NextFunction) => {
    render(req, res, 'coupon', {})
})
router.get('/intro', (req: Request, res: Response, next: NextFunction) => {
    render(req, res, 'landing', {})
})

const render = (req: Request, res: Response, view: any, data: any | null) => {
    res.locals.isLoggedIn = req.session.isLoggedIn || false
    res.locals.user = req.session.user

    const defaultData: any = {
        currentPage: ''
    }
    data.currentPage = data.currentPage || ''
    res.render(view, data || defaultData)
}

export default router
