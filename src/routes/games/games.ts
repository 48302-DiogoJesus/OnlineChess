import { Router, Response, Request} from "express";
import ERRORS, { ErrorObject } from '../../errors/errors'
import { createGame, gameExists } from "../../services";

const router = Router()

async function executeSafe(res : Response, block: (...args: any[]) => any) {
    try {
        await block()
    } catch (err: any) {
        if (err.http_code === undefined) {
            res.status(500).json({ error: err })
        } else {
            res.status(err.http_code).json({ error: err })
        }
        return
    }
}

// ! BASE URL IS '/GAMES'
router.get('/connect', (req, res) => {
    executeSafe(res, async () => {
        const game_id = req.query.id

        if (game_id === undefined)
            throw ERRORS.BAD_REQUEST('Game ID is required!')

        if (!await gameExists(game_id.toString())) throw ERRORS.GAME_DOES_NOT_EXIST
        
        // Connect to game is setting black player to THIS(cookie || authorization header) username
    })
})

router.put('/makemove', (req, res) => {
    executeSafe(res, async () => {
        const game_id = req.query.id
        const move = req.query.move

        if (game_id === undefined)
            throw ERRORS.BAD_REQUEST('Game ID is required!')
        if (move === undefined)
            throw ERRORS.BAD_REQUEST('Move is required!')

        if (!await gameExists(game_id.toString())) throw ERRORS.GAME_DOES_NOT_EXIST
        
        // Attempt move on local board and if successfull return true and update remote game else return false

    })
})

export default router;