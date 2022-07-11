import { Router, Response, Request } from "express";
import ERRORS from '../errors/errors'
import { executeSafe, getToken } from "./common";
import Services from "../services";
import FriendRoutes from './friends'

const router = Router()

router.use(FriendRoutes)

// Get a user public data
router.get('/:username', (req, res) => {
    executeSafe(res, async () => {
        const token = getToken(req)
        if (token == null) {
            throw ERRORS.INVALID_TOKEN
        }

        const username = req.params.username

        const userData = await Services.getUserPublic(token, username)

        res.status(200).json({
            data: userData
        })
    })
})

// Get all users public data
router.get('/', (req, res) => {
    executeSafe(res, async () => {
        const token = getToken(req)
        if (token == null) {
            throw ERRORS.INVALID_TOKEN
        }

        const users = await Services.getUsers(token)

        res.status(200).json({
            data: users
        })
    })
})

// Create User
router.post('/', (req, res) => {
    executeSafe(res, async () => {
        const { username, password } = req.body

        if (username === undefined || password === undefined) throw ERRORS.BAD_REQUEST('Username and password were not provided!')

        const userToken = await Services.createUser(username, password)

        req.login({
            token: userToken
        }, (err) => {
            if (err) throw ERRORS.UNKNOWN_ERROR(500, err)
            res.status(201).json({
                token: userToken
            })
        })
    })
})

router.delete('/:username', (req, res) => {
    executeSafe(res, async () => {
        const token = getToken(req)
        if (token == null) {
            throw ERRORS.INVALID_TOKEN
        }

        const user_to_delete = req.params.username

        await Services.deleteUser(token, user_to_delete)

        res.sendStatus(200)
    })
})

export default router;