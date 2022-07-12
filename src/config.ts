// require('dotenv').config()

const config = {
    // Change when deploying to process.env.PORT || 8080
    SERVER_PORT: 8888,
    TEST_ENV: false,
    MONGO_DB: {
        DB_NAME: 'OnlineChess',
        TEST_DB_NAME: 'OnlineChessTest',
        REMOTE: true,
        USERNAME: process.env.MONGO_DB_USERNAME || null,
        PASSWORD: process.env.MONGO_DB_PASSWORD || null
    }
}

export default config;