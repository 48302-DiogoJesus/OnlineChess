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
exports.gameExists = exports.updateGame = exports.createGame = void 0;
const games_1 = require("./db/games");
function createGame(gameObject) {
    return __awaiter(this, void 0, void 0, function* () {
        // Later do token and authorization validations here ! dont forget AWAIT THEN!
        return yield (0, games_1.createGame)(gameObject);
    });
}
exports.createGame = createGame;
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
