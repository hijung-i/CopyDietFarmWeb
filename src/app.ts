import * as Express from 'express'
import * as cookieParser from 'cookie-parser'
import * as logger from 'morgan'
import * as session from 'express-session'
import Err from './error/error'

import * as path from 'path'
import { NiceUser, SessionUser } from './models/user'

declare module 'express-session' {
    interface SessionData {
        user: SessionUser | undefined
        niceUserData: NiceUser
        isLoggedIn: boolean
    }
}

const app = Express()
const __baseDir = path.join(__dirname, '../')

export namespace globalData {
    export const getBaseDir = () => {
        return __baseDir
    }
}

import indexViewRouter from './routes/indexViewRouter'
import requireLoginViewRouter from './routes/requireLoginViewRouter'
import snsLoginRouter from './routes/snsLoginRouter'

import niceIdentifierRouter from './routes/niceIdentifierRouter'
import sslCertificateRouter from './routes/sslCertificateRouter'
import userApiRouter from './routes/userApiRouter'

app.use(session({
    secret: 'dataflow0327!@',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}))
app.use(Express.json({ limit: '16MB' }))
app.use(Express.urlencoded({ extended: false, limit: '16MB' }))

app.use(cookieParser())

app.use(logger('dev'))

app.use('/', indexViewRouter)
app.use('/', requireLoginViewRouter)
app.use('/user', userApiRouter)
app.use('/user', snsLoginRouter)
app.use('/nice', niceIdentifierRouter)

app.use('/.well-known', sslCertificateRouter)

app.set('views', path.join(__baseDir, 'views'))
app.set('view engine', 'ejs')

app.use(Express.static(path.join(__baseDir, 'public')))

app.use((req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    let err = new Error('Not Found!') as Err
    err.status = 404
    next(err)
})

app.use((err: Err, req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    res.status(err.status || 500)
    console.log('BODY -> ', req.body)
    console.error('ERROR WHILE PROCESSING url ', req.url,'=>\n', err.message)
    res.json({
        message: err.message,
        data: err.data
    })
})

export default app