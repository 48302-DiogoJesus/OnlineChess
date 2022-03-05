"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const config = {
    MONGO_DB: {
        DB_NAME: /*'OnlineChess ||'*/ 'OnlineChessTest',
        REMOTE: false,
        USERNAME: process.env.MONGO_DB_USERNAME || null,
        PASSWORD: process.env.MONGO_DB_PASSWORD || null
    }
};
exports.default = config;
