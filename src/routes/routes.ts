import Express from 'express'
// Routers
import GamesRoutes from './games'
import AuthRoutes from './auth'
import UserRoutes from './users'

import passport from 'passport'

const cors = require('cors')
const session = require('express-session')
const path = require('path')

passport.serializeUser((userInfo: any, done) => { done(null, userInfo) })
passport.deserializeUser((userInfo: any, done) => { done(null, userInfo) })

const app = Express()

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*')
    res.set('Access-Control-Allow-Credentials', 'true')
    next()
})
app.use(cors())
app.use(session({
    secret: 'chessbackend',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(Express.urlencoded({ extended: true }))
app.use(Express.json());

app.use('/api/auth', AuthRoutes)
app.use('/api/users', UserRoutes)
app.use('/api/games', GamesRoutes)

export default app