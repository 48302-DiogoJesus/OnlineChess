import { executeInDB } from './common'
import GameSchema, { GameObject } from './schemas/game'
import ERRORS from '../errors/errors'

function validateGameID(game_id: string) {
    if (!(game_id.length >= 4 && game_id.length <= 20)) {
        throw ERRORS.INVALID_GAMEID_LENGTH
    }
    /*
    if (!/^[a-zA-Z0-9_-]*$/.test(game_id)) {
        throw ERRORS.INVALID_GAMEID_CHARACTERS
    }
    */
}

const bundled = {
    createGame, updateGame, gameExists, getGame, getGames, deleteGame
}

export default bundled

/* ---------------------- MAIN FUNCTIONS ---------------------- */
// | createGame | updateGame | gameExists | getGame | getGames | deleteGame |

const MAX_GAMES_RETRIEVED = 200

export function getGames(limit: boolean = false) {
    return executeInDB(async () => {
        var games = []
        if (limit)
            games = await GameSchema.find().limit(MAX_GAMES_RETRIEVED)
        else 
            games = await GameSchema.find()
        return games
    })
}

export function createGame(gameObject: GameObject, bypass_game_id_validation: boolean = false) {
    if (!bypass_game_id_validation)
        validateGameID(gameObject._id)

    return executeInDB(async () => {
        await (new GameSchema(gameObject)).save()
        return true
    })
}

export function updateGame(gameObject: GameObject) {
    return executeInDB(async () => {
        await GameSchema.findOneAndUpdate({ _id: gameObject._id}, gameObject)
        return true
    })
}

export function gameExists(game_id: string) {
    return executeInDB(async () => {
        return (await GameSchema.findById(game_id)) !== null
    })
}

export function getGame(game_id: string): Promise<GameObject> {
    return executeInDB(async () => {
        const gameObject = await GameSchema.findById(game_id)
        return gameObject._doc as GameObject
    })
}

export function deleteGame(game_id: string): Promise<boolean> {
    return executeInDB(async () => {
        await GameSchema.deleteOne({ _id: game_id })
        return true
    })
}