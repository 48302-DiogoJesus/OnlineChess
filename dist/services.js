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
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameExists = exports.updateGame = exports.isValidMove = exports.createGame = void 0;
const games_1 = require("./db/games");
const board_1 = require("./model/board");
function createGame(game_id, player_white) {
    return __awaiter(this, void 0, void 0, function* () {
        // Build Remote Game Object
        const defaultBoard = new board_1.BoardObject();
        const gameObject = {
            _id: game_id,
            player_white,
            player_black: null,
            board: defaultBoard.toString(),
            turn: defaultBoard.turn,
            winner: defaultBoard.winner
        };
        // Later do token and authorization validations here ! dont forget AWAIT THEN!
        return yield (0, games_1.createGame)(gameObject);
    });
}
exports.createGame = createGame;
function isValidMove(game_id, move) {
    return __awaiter(this, void 0, void 0, function* () {
        const gameObject = yield (0, games_1.getGame)(game_id);
        const testBoard = (0, board_1.stringToBoard)(gameObject.board);
        // If remote game as string is invalid just delete it
        if (testBoard === null) {
            yield (0, games_1.deleteGame)(game_id);
            return false;
        }
        // If not valid, makeMove throws and api handles error
        testBoard.makeMove(move);
        // Update remote game
        updateGame(Object.assign(Object.assign({}, gameObject), { board: testBoard.toString(), winner: testBoard.winner, turn: testBoard.turn }));
        return true;
    });
}
exports.isValidMove = isValidMove;
function updateGame(gameObject) {
    return __awaiter(this, void 0, void 0, function* () {
        // Later do token and authorization validations here
        return yield (0, games_1.updateGame)(gameObject);
    });
}
exports.updateGame = updateGame;
function gameExists(game_id) {
    return __awaiter(this, void 0, void 0, function* () {
        // Later do token and authorization validations here
        return yield (0, games_1.gameExists)(game_id);
    });
}
exports.gameExists = gameExists;
