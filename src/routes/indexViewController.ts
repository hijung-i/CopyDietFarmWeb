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
    if (isLoggedIn === true) {
        res.redirect('/')
    }

    render(res, 'login', {})
})

router.get('/product/:productCode', (req: Request, res: Response, next: NextFunction) => {
    const isLoggedIn: boolean | undefined = req.session.isLoggedIn
    if (isLoggedIn === true) {
        res.redirect('/')
    }

    render(res, 'product', {})
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
    render(res, 'my-page', {})
})

router.get('/faq', (req: Request, res: Response, next: NextFunction) => {
    render(res, 'faq', {})
})

const render = (res: Response, view: any, data: any | null) => {
    res.render(view, data || null)
}

export default router