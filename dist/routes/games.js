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
const services_1 = __importDefault(require("../services"));
const common_1 = require("./common");
const router = (0, express_1.Router)();
// Create a new game
router.post('/', (req, res) => {
    (0, common_1.executeSafe)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const token = (0, common_1.getToken)(req);
        if (token == null) {
            throw errors_1.default.INVALID_TOKEN;
        }
        const game_id = req.body.id;
        const is_public = (_a = req.body.public) !== null && _a !== void 0 ? _a : true;
        const player2 = req.body.player2;
        if (game_id === undefined)
            throw errors_1.default.BAD_REQUEST('Game ID not provided!');
        const initialGameObject = yield services_1.default.createGame(token, game_id, is_public, player2);
        res.status(201).json({
            data: initialGameObject
        });
    }));
});
// Tottally unsafe. Should store the tokens of the users already spectating on a Set (unique)
router.post('/incrementviewers', (req, res) => {
    (0, common_1.executeSafe)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        const game_id = req.body.id;
        if (game_id === undefined)
            throw errors_1.default.BAD_REQUEST('Game ID not provided!');
        yield services_1.default.incrementViewers(game_id);
        res.sendStatus(200);
    }));
});
// Get the updated data for a specific game 
router.get('/', (req, res) => {
    (0, common_1.executeSafe)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        const token = (0, common_1.getToken)(req);
        const game_id = req.query.id;
        if (game_id === undefined)
            throw errors_1.default.BAD_REQUEST('Game ID not provided!');
        const gameObject = yield services_1.default.getGame(game_id.toString(), token);
        res.status(200).json({
            data: gameObject
        });
    }));
});
// Connect to a game
router.get('/connect', (req, res) => {
    (0, common_1.executeSafe)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        const token = (0, common_1.getToken)(req);
        if (token == null) {
            throw errors_1.default.INVALID_TOKEN;
        }
        const game_id = req.query.id;
        if (game_id === undefined)
            throw errors_1.default.BAD_REQUEST('Game ID not provided!');
        const gameObject = yield services_1.default.connectToGame(token, game_id.toString());
        res.status(200).json({
            data: gameObject
        });
    }));
});
router.get('/makemove', (req, res) => {
    (0, common_1.executeSafe)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        const token = (0, common_1.getToken)(req);
        if (token == null) {
            throw errors_1.default.INVALID_TOKEN;
        }
        const game_id = req.query.id;
        const move = req.query.move;
        if (game_id === undefined)
            throw errors_1.default.BAD_REQUEST('Game ID not provided!');
        if (move === undefined)
            throw errors_1.default.BAD_REQUEST('Move not provided!');
        const updatedGame = yield services_1.default.executeGameMove(token, game_id.toString(), move.toString());
        res.status(200).json({
            data: updatedGame
        });
    }));
});
exports.default = router;
