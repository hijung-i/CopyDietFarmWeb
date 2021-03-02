import * as Express from 'express'
import * as cookieParser from 'cookie-parser'
import * as logger from 'morgan'
import * as session from 'express-session'
import Err from './error/error'

import indexRouter from './routes/indexViewController'
import userRouter from './routes/userApiController'

import * as path from 'path'
import { SessionUser } from './models/user'

declare module 'express-session' {
    interface SessionData {
        user: SessionUser | undefined
        isLoggedIn: boolean
    }
}

const app = Express()
const __baseDir = path.join(__dirname, '../')
console.log(__baseDir)

app.use(session({
    secret: 'dataflow0327!@',
    resave: true,
    saveUninitialized: true
}))
app.use(Express.json({ limit: '16MB' }))
app.use(Express.urlencoded({ extended: false, limit: '16MB' }))

app.use(cookieParser())

app.use(logger('dev'))

app.use('/', indexRouter)
app.use('/user', userRouter)

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