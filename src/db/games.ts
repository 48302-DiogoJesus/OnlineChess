import mongoose from 'mongoose';
import GameSchema, { GameObject } from './schemas/game'
import CONFIG from '../config/config'

const connectionURL = CONFIG.MONGO_DB.REMOTE ? 
    `mongodb+srv://${CONFIG.MONGO_DB.USERNAME}:${CONFIG.MONGO_DB.PASSWORD}@mycluster.h5qxe.mongodb.net/${CONFIG.MONGO_DB.DB_NAME}?retryWrites=true&w=majority` 
    : 
    `mongodb://127.0.0.1:27017/${CONFIG.MONGO_DB.DB_NAME}`


async function executeInDB(block: (...args: any[]) => any) {
    await mongoose.connect(connectionURL)
    let result
    try {
        result = await block()
    } catch (err) {
        // Evaluate Mongo Error -> Convert to "our" error format -> throw it formatted 
        result = false
    }
    await mongoose.connection.close()
    return result
}

/* ---------------------- MAIN FUNCTIONS ---------------------- */
// | createGame | updateGame | gameExists | 

export async function createGame(gameObject: GameObject) {
    return executeInDB(async () => {
        if (await gameExists(gameObject._id, true)) {
            return false
        }
        await (new GameSchema(gameObject)).save()
        return true
    })
}

export async function updateGame(gameObject: GameObject) {
    return executeInDB(async () => {
        if (!await gameExists(gameObject._id, true))
            return false
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