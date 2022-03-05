/*
    Runs the app on the defined server port
*/
import CONFIG from './config'
import app from './routes/routes'

app.listen(CONFIG.SERVER_PORT, () => {
    console.log(`Backend listening on port ${CONFIG.SERVER_PORT}`)
})