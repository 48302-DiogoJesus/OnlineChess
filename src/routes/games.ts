import { Router, Response, Request } from "express";
import { GameObject } from "../db/schemas/game";
import ERRORS, { ErrorObject } from '../errors/errors'
import Services from "../services";
import { executeSafe, getToken } from "./common";

const router = Router()

// Create a new game
router.post('/', (req, res) => {
    executeSafe(res, async () => {
        const token = getToken(req)

        const game_id = req.body.id

        if (game_id === undefined) throw ERRORS.BAD_REQUEST('Game ID not provided!')

        const initialGameObject: GameObject = await Services.createGame(token, game_id)

        res.status(201).json({
            data: initialGameObject
        })
    })
})

// Get the updated data for a specific game 
router.get('/', (req, res) => {
    executeSafe(res, async () => {
        const token = getToken(req)

        const game_id = req.query.id

        if (game_id === undefined) throw ERRORS.BAD_REQUEST('Game ID not provided!')

        const gameObject = await Services.getGame(token, game_id.toString())

        res.status(200).json({
            data: gameObject
        })
    })
})

// Connect to a game
router.get('/connect', (req, res) => {
    executeSafe(res, async () => {
        const token = getToken(req)

        const game_id = req.query.id

        if (game_id === undefined) throw ERRORS.BAD_REQUEST('Game ID not provided!')

        const gameObject = await Services.connectToGame(token, game_id.toString())

        res.status(200).json({
            data: gameObject
        })
    })
})

router.get('/makemove', (req, res) => {
    executeSafe(res, async () => {
        const token = getToken(req)

        const game_id = req.query.id
        const move = req.query.move

        if (game_id === undefined) throw ERRORS.BAD_REQUEST('Game ID not provided!')
        if (move === undefined) throw ERRORS.BAD_REQUEST('Move not provided!')

        const updatedGame = await Services.executeGameMove(token, game_id.toString(), move.toString())

        res.status(200).json({
            data: updatedGame
        })
    })
})

export default router;