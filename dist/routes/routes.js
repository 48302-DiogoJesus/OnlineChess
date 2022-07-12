"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// Routers
const games_1 = __importDefault(require("./games"));
const auth_1 = __importDefault(require("./auth"));
const users_1 = __importDefault(require("./users"));
const passport_1 = __importDefault(require("passport"));
const cors = require('cors');
const session = require('express-session');
const path = require('path');
passport_1.default.serializeUser((userInfo, done) => { done(null, userInfo); });
passport_1.default.deserializeUser((userInfo, done) => { done(null, userInfo); });
const app = (0, express_1.default)();
app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Credentials', 'true');
    next();
});
app.use(cors());
app.use(session({
    secret: 'chessbackend',
    resave: false,
    saveUninitialized: false
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use('/api/auth', auth_1.default);
app.use('/api/users', users_1.default);
app.use('/api/games', games_1.default);
exports.default = app;
