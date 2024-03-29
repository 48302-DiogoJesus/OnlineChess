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
        if (token == null) {
            throw ERRORS.INVALID_TOKEN
        }

        const game_id = req.body.id
        const is_public: boolean = req.body.public ?? true
        const player2: string | null = req.body.player2

        if (game_id === undefined) throw ERRORS.BAD_REQUEST('Game ID not provided!')

        const initialGameObject: GameObject = await Services.createGame(token, game_id, is_public, player2)

        res.status(201).json({
            data: initialGameObject
        })
    })
})

// Tottally unsafe. Should store the tokens of the users already spectating on a Set (unique)
router.post('/incrementviewers', (req, res) => {
    executeSafe(res, async () => {
        const game_id = req.body.id

        if (game_id === undefined) throw ERRORS.BAD_REQUEST('Game ID not provided!')

        await Services.incrementViewers(game_id)

        res.sendStatus(200)
    })
})

// Get the updated data for a specific game 
router.get('/', (req, res) => {
    executeSafe(res, async () => {
        const token = getToken(req)
        const game_id = req.query.id

        if (game_id === undefined) throw ERRORS.BAD_REQUEST('Game ID not provided!')

        const gameObject = await Services.getGame(game_id.toString(), token)

        res.status(200).json({
            data: gameObject
        })
    })
})

// Connect to a game
router.get('/connect', (req, res) => {
    executeSafe(res, async () => {
        const token = getToken(req)
        if (token == null) {
            throw ERRORS.INVALID_TOKEN
        }

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
        if (token == null) {
            throw ERRORS.INVALID_TOKEN
        }

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