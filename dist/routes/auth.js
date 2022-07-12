"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const errors_1 = __importDefault(require("../errors/errors"));
const common_1 = require("./common");
const services_1 = __importDefault(require("../services"));
const router = (0, express_1.Router)();
// Login
router.post('/', (req, res) => {
    (0, common_1.executeSafe)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        const { username, password } = req.body;
        if (username === undefined || password === undefined)
            throw errors_1.default.BAD_REQUEST('Username and password were not provided!');
        const userToken = yield services_1.default.validateCredentials(username, password);
        req.login({
            token: userToken,
        }, (err) => {
            if (err)
                throw errors_1.default.UNKNOWN_ERROR(500, err);
            // Login successfull
            res.sendStatus(200);
        });
    }));
});
// Logout
router.get('/logout', (req, res) => {
    try {
        req.logout();
        res.clearCookie('connect.sid');
        req.session.destroy(function (err) {
            if (!err) {
                res.clearCookie('connect.sid', { path: '/' });
            }
            else {
                throw errors_1.default.UNKNOWN_ERROR(500, err);
            }
        });
    }
    catch (err) {
        throw errors_1.default.UNKNOWN_ERROR(500, err);
    }
});
// Change user password
router.put('/', (req, res) => {
    (0, common_1.executeSafe)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        const token = (0, common_1.getToken)(req);
        if (token == null) {
            throw errors_1.default.INVALID_TOKEN;
        }
        const { password } = req.body;
        if (password === undefined)
            throw errors_1.default.BAD_REQUEST('New password not provided!');
        yield services_1.default.updateUserPassword(token, password);
        res.sendStatus(200);
    }));
});
exports.default = router;
