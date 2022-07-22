"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Enable before pushing to heroku
const PROD = true;
try {
    require('dotenv').config();
}
catch (e) { }
const config = {
    PROD: PROD,
    // Change when deploying to process.env.PORT || 8080
    SERVER_PORT: PROD ? process.env.PORT : 7000,
    MONGO_DB: {
        DB_NAME: 'OnlineChess',
        TEST_DB_NAME: 'OnlineChessTest',
        REMOTE: PROD ? true : false,
        USERNAME: process.env.MONGO_DB_USERNAME || null,
        PASSWORD: process.env.MONGO_DB_PASSWORD || null
    },
    TEST_ENV: false
};
exports.default = config;
