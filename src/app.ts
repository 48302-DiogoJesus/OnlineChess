/*
    Runs the app on the defined server port
*/
import CONFIG from './config'
import { connectMongoDB } from './db/common'

import Express from 'express'
import app from './routes/routes'

import path from 'path'

if (!CONFIG.TEST_ENV) {
    connectMongoDB()
}

const siteFilesPath = path.join(__dirname, '../react-ui/build')

app.use('/', Express.static(siteFilesPath))

app.get('/*', (req, res) => {
    res.sendFile(path.join(siteFilesPath, 'index.html'))
})

app.listen(CONFIG.SERVER_PORT, () => {
    console.log(`Backend listening on port ${CONFIG.SERVER_PORT}`)
})