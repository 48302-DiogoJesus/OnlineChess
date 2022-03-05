require('dotenv').config()

const config = {
    SERVER_PORT: process.env.PORT || 8080,
    MONGO_DB: { 
        DB_NAME: /*'OnlineChess ||'*/  'OnlineChessTest',
        REMOTE: false,
        USERNAME: process.env.MONGO_DB_USERNAME || null,
        PASSWORD: process.env.MONGO_DB_PASSWORD || null
    }
}

export default config;