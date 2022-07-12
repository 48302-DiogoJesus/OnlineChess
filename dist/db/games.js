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
exports.isPublic = exports.incrementViewers = exports.deleteGame = exports.getGame = exports.gameExists = exports.updateGame = exports.createGame = exports.getGames = void 0;
const common_1 = require("./common");
const game_1 = __importDefault(require("./schemas/game"));
const errors_1 = __importDefault(require("../errors/errors"));
function validateGameID(game_id) {
    if (!(game_id.length >= 5 && game_id.length <= 20)) {
        throw errors_1.default.INVALID_GAMEID_LENGTH;
    }
    if (game_id.includes(' '))
        throw errors_1.default.INVALID_GAMEID_WS;
    /*
    if (!/^[a-zA-Z0-9_-]*$/.test(game_id)) {
        throw ERRORS.INVALID_GAMEID_CHARACTERS
    }
    */
}
const bundled = {
    createGame, updateGame, gameExists, getGame, getGames, deleteGame, incrementViewers, isPublic
};
exports.default = bundled;
/* ---------------------- MAIN FUNCTIONS ---------------------- */
// | createGame | updateGame | gameExists | getGame | getGames | deleteGame |
const MAX_GAMES_RETRIEVED = 200;
function getGames(limit = false) {
    return (0, common_1.executeInDB)(() => __awaiter(this, void 0, void 0, function* () {
        var games = [];
        if (limit)
            games = yield game_1.default.find().limit(MAX_GAMES_RETRIEVED);
        else
            games = yield game_1.default.find();
        return games;
    }));
}
exports.getGames = getGames;
function createGame(gameObject, bypass_game_id_validation = false) {
    if (!bypass_game_id_validation)
        validateGameID(gameObject._id);
    return (0, common_1.executeInDB)(() => __awaiter(this, void 0, void 0, function* () {
        yield (new game_1.default(gameObject)).save();
        return true;
    }));
}
exports.createGame = createGame;
function updateGame(gameObject) {
    return (0, common_1.executeInDB)(() => __awaiter(this, void 0, void 0, function* () {
        yield game_1.default.findOneAndUpdate({ _id: gameObject._id }, gameObject);
        return true;
    }));
}
exports.updateGame = updateGame;
function gameExists(game_id) {
    return (0, common_1.executeInDB)(() => __awaiter(this, void 0, void 0, function* () {
        return (yield game_1.default.findById(game_id)) !== null;
    }));
}
exports.gameExists = gameExists;
function getGame(game_id) {
    return (0, common_1.executeInDB)(() => __awaiter(this, void 0, void 0, function* () {
        const gameObject = yield game_1.default.findById(game_id);
        return gameObject._doc;
    }));
}
exports.getGame = getGame;
function deleteGame(game_id) {
    return (0, common_1.executeInDB)(() => __awaiter(this, void 0, void 0, function* () {
        yield game_1.default.deleteOne({ _id: game_id });
        return true;
    }));
}
exports.deleteGame = deleteGame;
function incrementViewers(game_id) {
    return (0, common_1.executeInDB)(() => __awaiter(this, void 0, void 0, function* () {
        yield game_1.default.findOneAndUpdate({ _id: game_id }, { $inc: { 'views': 1 } }); //.exec()
    }));
}
exports.incrementViewers = incrementViewers;
function isPublic(game_id) {
    return (0, common_1.executeInDB)(() => __awaiter(this, void 0, void 0, function* () {
        return (yield game_1.default.findById(game_id)).public;
    }));
}
exports.isPublic = isPublic;
