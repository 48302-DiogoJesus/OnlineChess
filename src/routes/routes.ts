import Express from 'express'
// Routers
import GamesRoutes from './games'
import AuthRoutes from './auth'
import UserRoutes from './users'

import passport from 'passport'
const cors = require('cors')
const session = require('express-session')


passport.serializeUser((userInfo: any, done) => { done(null, userInfo) })
passport.deserializeUser((userInfo: any, done) => { done(null, userInfo) })

const app = Express()

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Credentials', 'true')
    next()
})
app.use(cors({
    origin: "http://localhost:9999"
}))
app.use(session({
    secret: 'borga',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(Express.urlencoded({ extended: true }))
app.use(Express.json());

app.use('/auth', AuthRoutes)
app.use('/users', UserRoutes)
app.use('/games', GamesRoutes)

export default app