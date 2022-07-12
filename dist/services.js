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
exports.hasFriend = exports.removeFriend = exports.addFriend = exports.getFriends = exports.validateCredentials = exports.updateUserPublic = exports.updateUserPassword = exports.getUserPublic = exports.deleteUser = exports.createUser = exports.userExists = exports.getUsers = exports.incrementViewers = exports.deleteGame = exports.gameExists = exports.executeGameMove = exports.connectToGame = exports.getGame = exports.createGame = exports.getGamesById = exports.getGames = void 0;
const games_1 = __importDefault(require("./db/games"));
const users_1 = __importDefault(require("./db/users"));
const friends_1 = __importDefault(require("./db/friends"));
const board_1 = require("./model/board");
const errors_1 = __importDefault(require("./errors/errors"));
const piece_1 = require("./model/piece");
const bundled = {
    gameExists, createGame, getGame, getGames, getGamesById, connectToGame, executeGameMove, deleteGame, incrementViewers,
    getUsers, userExists, createUser, deleteUser, getUserPublic, updateUserPassword, updateUserPublic, validateCredentials,
    getFriends, addFriend, removeFriend, hasFriend
};
exports.default = bundled;
/* --------------------------- GAMES --------------------------- */
function getGames(token, limit = false) {
    return __awaiter(this, void 0, void 0, function* () {
        yield users_1.default.tokenToUsername(token);
        return games_1.default.getGames(limit);
    });
}
exports.getGames = getGames;
function getGamesById(token, game_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const allGames = yield getGames(token);
        return allGames.filter(game => game._id.includes(game_id) && game.public);
    });
}
exports.getGamesById = getGamesById;
// Any player can connect as "player_black" later if player_black = null
function createGame(token, game_id, is_public, player2 = null) {
    return __awaiter(this, void 0, void 0, function* () {
        // Throws if not authenticated
        const username = yield users_1.default.tokenToUsername(token);
        if (yield games_1.default.gameExists(game_id))
            throw errors_1.default.GAME_ALREADY_EXISTS;
        // If player2 is passed validate it exists
        if (player2 !== null && !(yield users_1.default.userExists(player2)))
            throw errors_1.default.PLAYER2_DOES_NOT_EXIST;
        // Build Remote Board Object
        const defaultBoard = new board_1.BoardObject();
        // Build a Game
        const gameObject = {
            _id: game_id,
            player_w: username,
            player_b: player2,
            moves: defaultBoard.stringMoves(),
            winner: defaultBoard.winner,
            views: 0,
            public: is_public !== null && is_public !== void 0 ? is_public : true
        };
        yield games_1.default.createGame(gameObject);
        return gameObject;
    });
}
exports.createGame = createGame;
function getGame(game_id, token = null) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield games_1.default.gameExists(game_id)))
            throw errors_1.default.GAME_DOES_NOT_EXIST;
        const username = token != null ?
            yield users_1.default.tokenToUsername(token)
            : null;
        const game = yield games_1.default.getGame(game_id);
        const is_public = game.public;
        // If no token provided allow to get game if not private
        if (username == null && !is_public)
            throw errors_1.default.GAME_IS_PRIVATE;
        // If token provided and he is not one of the players and playerb is defined
        if (!is_public && username != null && game.player_b != null && game.player_b != username && game.player_w != username)
            throw errors_1.default.GAME_IS_PRIVATE;
        return game;
    });
}
exports.getGame = getGame;
// Connect to a game that does not have a "player_black"
function connectToGame(token, game_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const username = yield users_1.default.tokenToUsername(token);
        if (!(yield games_1.default.gameExists(game_id)))
            throw errors_1.default.GAME_DOES_NOT_EXIST;
        var gameObject = yield games_1.default.getGame(game_id);
        const is_public = gameObject.public;
        // If player2(black) has already connected make sure the player whos connecting is allowed
        if (username != null && gameObject.player_b !== null) {
            // If not public and i'm neither of the players dont allow
            if (!is_public && gameObject.player_w !== username && gameObject.player_b !== username)
                throw errors_1.default.NOT_AUTHORIZED_TO_CONNECT;
        }
        // CAN JOIN AS player_b !
        // Even if the game is private allow any player to join, just not after that
        if (gameObject.player_b === null) {
            yield games_1.default.updateGame(Object.assign(Object.assign({}, gameObject), { player_b: username }));
            // Get the updated game
            gameObject = yield games_1.default.getGame(game_id);
        }
        // In case both players have already connected at least once dont update the game, just send them the most updated game version
        return gameObject;
    });
}
exports.connectToGame = connectToGame;
function executeGameMove(token, game_id, move) {
    return __awaiter(this, void 0, void 0, function* () {
        const username = yield users_1.default.tokenToUsername(token);
        if (!(yield games_1.default.gameExists(game_id)))
            throw errors_1.default.GAME_DOES_NOT_EXIST;
        const gameObject = yield games_1.default.getGame(game_id);
        if (username !== gameObject.player_b && username !== gameObject.player_w)
            throw errors_1.default.NOT_AUTHORIZED;
        const testBoard = board_1.BoardObject.fromMoves(gameObject.moves);
        const playerPieces = username === gameObject.player_w ? piece_1.PieceColor.WHITE : piece_1.PieceColor.BLACK;
        if (testBoard.turn != playerPieces)
            throw errors_1.default.NOT_YOUR_TURN;
        // If not valid, makeMove throws and api handles error
        testBoard.makeMove(move);
        // If no errors happen validating update db remote game
        yield games_1.default.updateGame(Object.assign(Object.assign({}, gameObject), { moves: testBoard.stringMoves(), winner: testBoard.winner }));
        // Return the updated game
        return games_1.default.getGame(game_id);
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
function incrementViewers(game_id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield games_1.default.gameExists(game_id)))
            throw errors_1.default.GAME_DOES_NOT_EXIST;
        if (!(yield games_1.default.isPublic(game_id)))
            throw errors_1.default.GAME_IS_PRIVATE;
        return games_1.default.incrementViewers(game_id);
    });
}
exports.incrementViewers = incrementViewers;
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
function updateUserPassword(token, new_password) {
    return __awaiter(this, void 0, void 0, function* () {
        const username = yield users_1.default.tokenToUsername(token);
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
/* --------------------------- FRIENDS --------------------------- */
function getFriends(token, username = null) {
    return __awaiter(this, void 0, void 0, function* () {
        const authedUser = yield users_1.default.tokenToUsername(token);
        var usertosearch = username !== null ? username : authedUser;
        if (usertosearch !== authedUser) {
            if (!(yield users_1.default.userExists(usertosearch)))
                throw errors_1.default.USER_DOES_NOT_EXIST;
        }
        return friends_1.default.getFriends(usertosearch);
    });
}
exports.getFriends = getFriends;
function addFriend(token, friend_name) {
    return __awaiter(this, void 0, void 0, function* () {
        const username = yield users_1.default.tokenToUsername(token);
        if (!(yield users_1.default.userExists(friend_name)))
            throw errors_1.default.USER_DOES_NOT_EXIST;
        if ((yield friends_1.default.hasFriend(username, friend_name)) || username === friend_name)
            throw errors_1.default.USER_ALREADY_HAS_THAT_FRIEND;
        return friends_1.default.addFriend(username, friend_name);
    });
}
exports.addFriend = addFriend;
function removeFriend(token, friend_name) {
    return __awaiter(this, void 0, void 0, function* () {
        const username = yield users_1.default.tokenToUsername(token);
        if (!(yield friends_1.default.hasFriend(username, friend_name)))
            throw errors_1.default.USER_DOES_NOT_HAVE_THAT_FRIEND;
        // Friend does not need to exist to be removed on purpose
        return friends_1.default.removeFriend(username, friend_name);
    });
}
exports.removeFriend = removeFriend;
function hasFriend(token, friend_name) {
    return __awaiter(this, void 0, void 0, function* () {
        const username = yield users_1.default.tokenToUsername(token);
        return friends_1.default.hasFriend(username, friend_name);
    });
}
exports.hasFriend = hasFriend;
