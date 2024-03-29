import { Router, Response } from "express";
import ERRORS from '../errors/errors'
import { executeSafe, getToken } from "./common";
import Services from "../services";

const router = Router()

// Login
router.post('/', (req, res) => {
    executeSafe(res, async () => {
        const { username, password } = req.body

        if (username === undefined || password === undefined) throw ERRORS.BAD_REQUEST('Username and password were not provided!')

        const userToken = await Services.validateCredentials(username, password)

        req.login({
            token: userToken,
        }, (err) => {
            if (err) throw ERRORS.UNKNOWN_ERROR(500, err)
            // Login successfull
            res.status(200).json({
                data: {
                    token: userToken
                }
            })
        })
    })
})

// Logout
router.get('/logout', (req: any, res: Response) => {
    try {
        req.logout()
        res.clearCookie('connect.sid');
        req.session.destroy(function (err: any) {
            if (!err) {
                res.clearCookie('connect.sid', { path: '/' });
            } else {
                throw ERRORS.UNKNOWN_ERROR(500, err)
            }
        })
    } catch (err: any) {
        throw ERRORS.UNKNOWN_ERROR(500, err)
    }
})

// Change user password
router.put('/', (req, res) => {
    executeSafe(res, async () => {
        const token = getToken(req)
        if (token == null) {
            throw ERRORS.INVALID_TOKEN
        }

        const { password } = req.body

        if (password === undefined) throw ERRORS.BAD_REQUEST('New password not provided!')

        await Services.updateUserPassword(token, password)

        res.sendStatus(200)
    })
})

export default router;