import CONFIG from '../config'
import mongoose from 'mongoose';

export function connectMongoDB() {
    var db_name = CONFIG.TEST_ENV
        ? CONFIG.MONGO_DB.TEST_DB_NAME
        : CONFIG.MONGO_DB.DB_NAME

    const connectionURL = CONFIG.MONGO_DB.REMOTE ?
        `mongodb+srv://${CONFIG.MONGO_DB.USERNAME}:${CONFIG.MONGO_DB.PASSWORD}@cluster0.fspkz.mongodb.net/${db_name}?retryWrites=true&w=majority`
        :
        `mongodb://127.0.0.1:27017/${db_name}`
    console.log(connectionURL)
    return mongoose.connect(connectionURL)
}

import Game from './schemas/game'
import UserToken from './schemas/userToken'
import UserPublic from './schemas/userPublic'
import UserAuthentication from './schemas/userAuthentication'


// ! DANGEROUS
export async function clearDatabase() {
    await Game.deleteMany({})
    await UserToken.deleteMany({})
    await UserPublic.deleteMany({})
    await UserAuthentication.deleteMany({})
}

export async function executeInDB(block: (...args: any[]) => any) {
    let result
    try {
        result = await block()
    } catch (err) {
        // Evaluate Mongo Error -> Convert to "our" error format -> throw it formatted 
        throw err
    }
    return result
}