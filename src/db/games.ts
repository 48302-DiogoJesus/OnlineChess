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

/* ---------------------- MAIN FUNCTIONS ---------------------- */
// | createGame | updateGame | gameExists | getGame | deleteGame |

export function createGame(gameObject: GameObject) {
    validateGameID(gameObject._id)
    return executeInDB(async () => {
        if (await gameExists(gameObject._id, true)) {
            throw ERRORS.GAME_DOES_NOT_EXIST
        }
        await (new GameSchema(gameObject)).save()
        return true
    })
}

export function updateGame(gameObject: GameObject) {
    validateGameID(gameObject._id)
    return executeInDB(async () => {
        if (!await gameExists(gameObject._id, true))
            throw ERRORS.GAME_DOES_NOT_EXIST
        await GameSchema.findOneAndUpdate({ _id: gameObject._id}, gameObject)
        return true
    })
}

export async function gameExists(game_id: string, already_connected: boolean = false) {

    const block = async () => await GameSchema.findById(game_id) !== null

    if (already_connected)
        return await block()

    return executeInDB(async () => {
        return await block()
    })
}

export function getGame(game_id: string): Promise<GameObject> {
    return executeInDB(async () => {
        if (!gameExists(game_id, true))
            throw ERRORS.GAME_DOES_NOT_EXIST

        const gameObject = (await GameSchema.findOne({ _id: game_id }) as GameObject)
        return gameObject
    })
}

export function deleteGame(game_id: string): Promise<void> {
    validateGameID(game_id)
    return executeInDB(async () => {
        if (!gameExists(game_id, true))
            throw ERRORS.GAME_DOES_NOT_EXIST

        await GameSchema.deleteOne({ _id: game_id })
    })
} 

// ! TEST FUNCTION FOR THIS MODULE ! \\
/*
const testCGame = {
    _id: 'Test Game',
    board: ' ',
    turn: PieceColor.BLACK,
    winner: PieceColor.WHITE
}
const testUGame = {
    _id: 'Test Game',
    board: ' ',
    turn: PieceColor.BLACK,
    winner: PieceColor.WHITE
}
async function test() {
    console.log(await createGame(testCGame))
    //console.log(await updateGame(testUGame))
}
test()
*/