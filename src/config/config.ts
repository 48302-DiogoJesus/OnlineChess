require('dotenv').config()

const config = {
    MONGO_DB: { 
        DB_NAME: 'OnlineChess',
        REMOTE: false,
        USERNAME: process.env.MONGO_DB_USERNAME || null,
        PASSWORD: process.env.MONGO_DB_PASSWORD || null
    }
}

export default config;