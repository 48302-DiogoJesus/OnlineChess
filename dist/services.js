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
exports.validateCredentials = exports.updateUserPublic = exports.updateUserPassword = exports.getUserPublic = exports.deleteUser = exports.createUser = exports.userExists = exports.getUsers = exports.deleteGame = exports.gameExists = exports.executeGameMove = exports.connectToGame = exports.isAllowedToConnectToGame = exports.getGame = exports.createGame = void 0;
const games_1 = __importDefault(require("./db/games"));
const board_1 = require("./model/board");
const users_1 = __importDefault(require("./db/users"));
const errors_1 = __importDefault(require("./errors/errors"));
const piece_1 = require("./model/piece");
const bundled = {
    getUsers, gameExists, createGame, getGame, isAllowedToConnectToGame, connectToGame, executeGameMove, deleteGame,
    userExists, createUser, deleteUser, getUserPublic, updateUserPassword, updateUserPublic, validateCredentials
};
exports.default = bundled;
// Any player can connect as "player_black" later if player_black = null
function createGame(token, game_id, player_black = null) {
    return __awaiter(this, void 0, void 0, function* () {
        // Throws if not authenticated
        const username = yield users_1.default.tokenToUsername(token);
        if (yield games_1.default.gameExists(game_id))
            throw errors_1.default.GAME_ALREADY_EXISTS;
        if (player_black !== null && !(yield users_1.default.userExists(player_black)))
            throw errors_1.default.USER_DOES_NOT_EXIST;
        // Build Remote Game Object
        const defaultBoard = new board_1.BoardObject();
        const gameObject = {
            _id: game_id,
            player_white: username,
            player_black: player_black,
            board: defaultBoard.toString(),
            turn: defaultBoard.turn,
            winner: defaultBoard.winner
        };
        // Later do token and authorization validations here ! dont forget AWAIT THEN!
        return games_1.default.createGame(gameObject);
    });
}
exports.createGame = createGame;
function getGame(token, game_id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield users_1.default.tokenToUsername(token);
        if (!(yield games_1.default.gameExists(game_id)))
            throw errors_1.default.GAME_DOES_NOT_EXIST;
        return games_1.default.getGame(game_id);
    });
}
exports.getGame = getGame;
// Allows to join a game. Either an ongoing game or as player2 in the beggining of the game 
function isAllowedToConnectToGame(token, game_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const username = yield users_1.default.tokenToUsername(token);
        if (!(yield games_1.default.gameExists(game_id)))
            throw errors_1.default.GAME_DOES_NOT_EXIST;
        const currentGameObject = yield games_1.default.getGame(game_id);
        // If player2(black) has already connected make sure the player whos connecting is allowed
        if (currentGameObject.player_black !== null) {
            if (currentGameObject.player_white !== username && currentGameObject.player_black !== username)
                return false;
        }
        return true;
    });
}
exports.isAllowedToConnectToGame = isAllowedToConnectToGame;
// Connect to a game that does not have a "player_black"
function connectToGame(token, game_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const username = yield users_1.default.tokenToUsername(token);
        if (!(yield isAllowedToConnectToGame(token, game_id)))
            throw errors_1.default.NOT_AUTHORIZED_TO_CONNECT;
        const currentGameObject = yield games_1.default.getGame(game_id);
        yield games_1.default.updateGame(Object.assign(Object.assign({}, currentGameObject), { player_black: username }));
        return true;
    });
}
exports.connectToGame = connectToGame;
function executeGameMove(token, game_id, move) {
    return __awaiter(this, void 0, void 0, function* () {
        const username = yield users_1.default.tokenToUsername(token);
        if (!(yield games_1.default.gameExists(game_id)))
            throw errors_1.default.GAME_DOES_NOT_EXIST;
        const gameObject = yield games_1.default.getGame(game_id);
        if (username !== gameObject.player_black && username !== gameObject.player_white)
            throw errors_1.default.NOT_AUTHORIZED;
        const testBoard = (0, board_1.stringToBoard)(gameObject.board);
        // If remote game as string is invalid just delete it
        if (testBoard === null) {
            yield games_1.default.deleteGame(game_id);
            return false;
        }
        const playerPieces = username === gameObject.player_white ? piece_1.PieceColor.WHITE : piece_1.PieceColor.BLACK;
        if (gameObject.turn != playerPieces)
            throw errors_1.default.NOT_YOUR_TURN;
        // If not valid, makeMove throws and api handles error
        testBoard.makeMove(move);
        // Update remote game
        yield games_1.default.updateGame(Object.assign(Object.assign({}, gameObject), { board: testBoard.toString(), winner: testBoard.winner, turn: (0, piece_1.getOpponent)(playerPieces) }));
        return true;
    });
}
exports.executeGameMove = executeGameMove;
function gameExists(token, game_id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield users_1.default.tokenToUsername(token);
        return games_1.default.gameExists(game_id);
    });
}
exports.gameExists = gameExists;
// ! TO BE USED BY THE SERVER, NOT THE USER 
function deleteGame(game_id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield games_1.default.gameExists(game_id)))
            throw errors_1.default.GAME_DOES_NOT_EXIST;
        return games_1.default.deleteGame(game_id);
    });
}
exports.deleteGame = deleteGame;
/* --------------------------- USERS --------------------------- */
function getUsers(token) {
    return __awaiter(this, void 0, void 0, function* () {
        yield users_1.default.tokenToUsername(token);
        return users_1.default.getUsers();
    });
}
exports.getUsers = getUsers;
function userExists(token, user_to_find) {
    return __awaiter(this, void 0, void 0, function* () {
        yield users_1.default.tokenToUsername(token);
        return users_1.default.userExists(user_to_find);
    });
}
exports.userExists = userExists;
function createUser(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield users_1.default.userExists(username))
            throw errors_1.default.USER_ALREADY_EXISTS;
        users_1.default.validateUserName(username);
        users_1.default.validatePassword(password);
        return users_1.default.createUser(username, password);
    });
}
exports.createUser = createUser;
function deleteUser(token, user_to_delete) {
    return __awaiter(this, void 0, void 0, function* () {
        const username = yield users_1.default.tokenToUsername(token);
        if (username !== user_to_delete)
            throw errors_1.default.NOT_AUTHORIZED;
        if (!(yield users_1.default.userExists(username)))
            throw errors_1.default.USER_DOES_NOT_EXIST;
        return users_1.default.deleteUser(username);
    });
}
exports.deleteUser = deleteUser;
function getUserPublic(token, username) {
    return __awaiter(this, void 0, void 0, function* () {
        yield users_1.default.tokenToUsername(token);
        if (!(yield users_1.default.userExists(username)))
            throw errors_1.default.USER_DOES_NOT_EXIST;
        const publicUserData = yield users_1.default.getUserPublic(username);
        if (publicUserData === null)
            throw errors_1.default.UNKNOWN_ERROR(500, `Could not get public user information for ${username}`);
        return publicUserData;
    });
}
exports.getUserPublic = getUserPublic;
function updateUserPassword(token, user_to_update, new_password) {
    return __awaiter(this, void 0, void 0, function* () {
        const username = yield users_1.default.tokenToUsername(token);
        if (username !== user_to_update)
            throw errors_1.default.NOT_AUTHORIZED;
        users_1.default.validatePassword(new_password);
        if (!(yield users_1.default.userExists(username)))
            throw errors_1.default.USER_DOES_NOT_EXIST;
        return users_1.default.updateUserPassword(username, new_password);
    });
}
exports.updateUserPassword = updateUserPassword;
function updateUserPublic(token, user_to_update, userData) {
    return __awaiter(this, void 0, void 0, function* () {
        const username = yield users_1.default.tokenToUsername(token);
        if (username !== user_to_update)
            throw errors_1.default.NOT_AUTHORIZED;
        if (!(yield users_1.default.userExists(username)))
            throw errors_1.default.USER_DOES_NOT_EXIST;
        return users_1.default.updateUserPublic(username, userData);
    });
}
exports.updateUserPublic = updateUserPublic;
function validateCredentials(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield users_1.default.userExists(username)))
            throw errors_1.default.USER_DOES_NOT_EXIST;
        return users_1.default.validateCredentials(username, password);
    });
}
exports.validateCredentials = validateCredentials;
