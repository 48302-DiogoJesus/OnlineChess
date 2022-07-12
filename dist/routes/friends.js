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
// Get friends list for any user
router.get('/:username/friends', (req, res) => {
    (0, common_1.executeSafe)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        const token = (0, common_1.getToken)(req);
        if (token == null) {
            throw errors_1.default.INVALID_TOKEN;
        }
        const friendsList = yield services_1.default.getFriends(token, req.params.username);
        res.status(200).json({
            data: friendsList
        });
    }));
});
// Add friend
router.put('/friends', (req, res) => {
    (0, common_1.executeSafe)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        const token = (0, common_1.getToken)(req);
        if (token == null) {
            throw errors_1.default.INVALID_TOKEN;
        }
        const { friend } = req.body;
        if (friend === undefined)
            throw errors_1.default.BAD_REQUEST('Friend identifier not provided');
        yield services_1.default.addFriend(token, friend);
        res.sendStatus(200);
    }));
});
// Remove a friend
router.delete('/friends/:friend', (req, res) => {
    (0, common_1.executeSafe)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        const token = (0, common_1.getToken)(req);
        if (token == null) {
            throw errors_1.default.INVALID_TOKEN;
        }
        const friend = req.params.friend;
        if (friend === undefined)
            throw errors_1.default.BAD_REQUEST('Friend identifier not provided');
        yield services_1.default.removeFriend(token, friend);
        res.sendStatus(200);
    }));
});
// Has friend ?
router.get('/:username/friends/:friend', (req, res) => {
    (0, common_1.executeSafe)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        const token = (0, common_1.getToken)(req);
        if (token == null) {
            throw errors_1.default.INVALID_TOKEN;
        }
        const friend = req.params.friend;
        if (friend === undefined)
            throw errors_1.default.BAD_REQUEST('Friend identifier not provided');
        const hasFriend = yield services_1.default.hasFriend(token, friend);
        if (hasFriend)
            res.sendStatus(200);
        else
            res.sendStatus(404);
    }));
});
exports.default = router;
