/*
    Runs the app on the defined server port
*/
import CONFIG from './config'
import { connectMongoDB } from './db/common'
import app from './routes/routes'

if (!CONFIG.TEST_ENV) {
    connectMongoDB()
}

app.listen(CONFIG.SERVER_PORT, () => {
    console.log(`Backend listening on port ${CONFIG.SERVER_PORT}`)
})