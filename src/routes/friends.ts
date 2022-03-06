import { Router, Response, Request} from "express";
import ERRORS from '../errors/errors'
import { executeSafe, getToken } from "./common";
import Services from "../services";

const router = Router()

// Get friends list for any user
router.get('/:username/friends', (req, res) => {
    executeSafe(res, async () => {
        const token = getToken(req)

        const friendsList = await Services.getFriends(token, req.params.username)

        res.status(200).json({
            data: friendsList
        })
    })
})

// Add friend
router.put('/friends', (req, res) => {
    executeSafe(res, async () => {
        const token = getToken(req)

        const { friend } = req.body

        if (friend === undefined) throw ERRORS.BAD_REQUEST('Friend identifier not provided')

        await Services.addFriend(token, friend)

        res.sendStatus(200)
    })
})

// Remove a friend
router.delete('/friends/:friend', (req, res) => {
    executeSafe(res, async () => {
        const token = getToken(req)

        const friend = req.params.friend

        if (friend === undefined) throw ERRORS.BAD_REQUEST('Friend identifier not provided')

        await Services.removeFriend(token, friend)

        res.sendStatus(200)
    })
})

// Has friend ?
router.get('/:username/friends/:friend', (req, res) => {
    executeSafe(res, async () => {
        const token = getToken(req)

        const friend = req.params.friend

        if (friend === undefined) throw ERRORS.BAD_REQUEST('Friend identifier not provided')

        const hasFriend = await Services.hasFriend(token, friend)

        if (hasFriend)
            res.sendStatus(200)
        else 
            res.sendStatus(404)
    })
})

export default router;