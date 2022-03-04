import CONFIG from '../config/config'
import mongoose from 'mongoose';

export const connectionURL = CONFIG.MONGO_DB.REMOTE ? 
    `mongodb+srv://${CONFIG.MONGO_DB.USERNAME}:${CONFIG.MONGO_DB.PASSWORD}@mycluster.h5qxe.mongodb.net/${CONFIG.MONGO_DB.DB_NAME}?retryWrites=true&w=majority` 
    : 
    `mongodb://127.0.0.1:27017/${CONFIG.MONGO_DB.DB_NAME}`

export async function executeInDB(block: (...args: any[]) => any) {
    await mongoose.connect(connectionURL)
    let result
    try {
        result = await block()
    } catch (err) {
        // Evaluate Mongo Error -> Convert to "our" error format -> throw it formatted 
        throw err
    }
    await mongoose.connection.close()
    return result
}