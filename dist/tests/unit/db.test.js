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
const errors_1 = __importDefault(require("../../errors/errors"));
const board_1 = require("../../model/board");
const services_1 = __importDefault(require("../../services"));
const config_1 = __importDefault(require("../../config"));
const common_1 = require("../../db/common");
describe('Services Tests', () => {
    config_1.default.TEST_ENV = true;
    (0, common_1.connectMongoDB)().then(() => (0, common_1.clearDatabase)());
    const testUsername = '|T-e-s-t|U-s-e-r|';
    const testPassword = 'TestPassword';
    var testToken = '';
    const testGameID = 'L|O|C|A|L|G|A|M|E|ID';
    const expectThrow = (block, ...args) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield block(...args);
        }
        catch (err) {
            return err;
        }
    });
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield services_1.default.deleteGame(testGameID);
        }
        catch (_a) { }
        try {
            yield services_1.default.deleteUser(testToken, testUsername);
        }
        catch (_b) { }
        try {
            testToken = yield services_1.default.createUser(testUsername, testPassword);
        }
        catch (_c) { }
        try {
            yield services_1.default.createGame(testToken, testGameID, true, null);
        }
        catch (_d) { }
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield services_1.default.deleteGame(testGameID);
        }
        catch (_e) { }
        try {
            yield services_1.default.deleteUser(testToken, testUsername);
        }
        catch (_f) { }
    }));
    describe('Users', () => {
        test('Get all users', () => __awaiter(void 0, void 0, void 0, function* () {
            expect((yield services_1.default.getUsers(testToken)).length).toBe(1);
        }));
        test('User exists unauthenticated', () => __awaiter(void 0, void 0, void 0, function* () {
            expect((yield expectThrow(services_1.default.userExists, 'INVALID_TOKEN', testUsername)).message).toBe(errors_1.default.INVALID_TOKEN.message);
        }));
        test('User exists', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(yield services_1.default.userExists(testToken, testUsername)).toBeTruthy();
        }));
        test('User does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(yield services_1.default.userExists(testToken, 'Some non existing user')).toBeFalsy();
        }));
        test('Create valid User', () => __awaiter(void 0, void 0, void 0, function* () {
            const token2 = yield services_1.default.createUser('Test_User_2', 'Mypassword2');
            expect(token2).toBeDefined();
            yield services_1.default.deleteUser(token2, 'Test_User_2');
        }));
        test('Create duplicate User', () => __awaiter(void 0, void 0, void 0, function* () {
            const token2 = yield services_1.default.createUser('Test_User_2', 'Mypassword2');
            expect(token2).toBeDefined();
            expect((yield expectThrow(services_1.default.createUser, 'Test_User_2', 'Mypassword5')).message).toBe(errors_1.default.USER_ALREADY_EXISTS.message);
            yield services_1.default.deleteUser(token2, 'Test_User_2');
        }));
        test('Create user with invalid username 1', () => __awaiter(void 0, void 0, void 0, function* () {
            expect((yield expectThrow(services_1.default.createUser, 'T-1', 'Mypassword5')).message).toBe(errors_1.default.INVALID_USERNAME_LENGTH.message);
        }));
        test('Create user with invalid username 2', () => __awaiter(void 0, void 0, void 0, function* () {
            expect((yield expectThrow(services_1.default.createUser, 'Test-123', 'Myp')).message).toBe(errors_1.default.INVALID_PASSWORD_LENGTH.message);
        }));
        test('Get user rank', () => __awaiter(void 0, void 0, void 0, function* () {
            const rank = (yield services_1.default.getUserPublic(testToken, testUsername)).rank;
            expect(rank).toBeDefined();
            expect(rank).toBe("0");
        }));
        test('Validate valid credentials', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(yield services_1.default.validateCredentials(testUsername, testPassword)).toBeTruthy();
        }));
        test('Validate invalid credentials', () => __awaiter(void 0, void 0, void 0, function* () {
            expect((yield expectThrow(services_1.default.validateCredentials, testUsername, 'NewPassword')).message).toBe(errors_1.default.WRONG_PASSWORD.message);
        }));
        test('Validate credentials from unexisting user', () => __awaiter(void 0, void 0, void 0, function* () {
            expect((yield expectThrow(services_1.default.validateCredentials, "asjhdksdfkksdjhfjksdfh", 'PASSWORD_HERE')).message).toBe(errors_1.default.USER_DOES_NOT_EXIST.message);
        }));
        test('Update user password', () => __awaiter(void 0, void 0, void 0, function* () {
            yield services_1.default.updateUserPassword(testToken, 'NewPassword');
            expect(yield services_1.default.validateCredentials(testUsername, 'NewPassword')).toBeTruthy();
        }));
        test('Update user public rank', () => __awaiter(void 0, void 0, void 0, function* () {
            yield services_1.default.updateUserPublic(testToken, testUsername, { rank: 92 });
            expect((yield services_1.default.getUserPublic(testToken, testUsername)).rank).toBe("92");
        }));
        describe('User Friends', () => {
            test('Get friends from unexisting user', () => __awaiter(void 0, void 0, void 0, function* () {
                expect((yield expectThrow(services_1.default.getFriends, testToken, "Other user"))).toEqual(errors_1.default.USER_DOES_NOT_EXIST);
            }));
            test('Get friends from himself', () => __awaiter(void 0, void 0, void 0, function* () {
                const friends = yield services_1.default.getFriends(testToken, testUsername);
                expect(friends.length).toBe(0);
            }));
            test('Get friends from other user', () => __awaiter(void 0, void 0, void 0, function* () {
                const token2 = yield services_1.default.createUser('Test_User_2', 'Test_Password');
                const friends = yield services_1.default.getFriends(testToken, 'Test_User_2');
                expect(friends.length).toBe(0);
                yield services_1.default.deleteUser(token2, 'Test_User_2');
            }));
            test('Add unexisting friend to user', () => __awaiter(void 0, void 0, void 0, function* () {
                expect((yield expectThrow(services_1.default.addFriend, testToken, "Other user"))).toEqual(errors_1.default.USER_DOES_NOT_EXIST);
            }));
            test('Add friend to user', () => __awaiter(void 0, void 0, void 0, function* () {
                const token2 = yield services_1.default.createUser('Test_User_2', 'Test_Password');
                yield services_1.default.addFriend(testToken, 'Test_User_2');
                const friends = yield services_1.default.getFriends(testToken, testUsername);
                expect(friends.length).toBe(1);
                expect(friends[0]).toBe('Test_User_2');
                yield services_1.default.deleteUser(token2, 'Test_User_2');
            }));
            test('Add duplicate friend to user', () => __awaiter(void 0, void 0, void 0, function* () {
                const token2 = yield services_1.default.createUser('Test_User_2', 'Test_Password');
                yield services_1.default.addFriend(testToken, 'Test_User_2');
                const friends = yield services_1.default.getFriends(testToken, testUsername);
                expect(friends.length).toBe(1);
                expect(friends[0]).toBe('Test_User_2');
                expect((yield expectThrow(services_1.default.addFriend, testToken, 'Test_User_2'))).toEqual(errors_1.default.USER_ALREADY_HAS_THAT_FRIEND);
                const friends1 = yield services_1.default.getFriends(testToken, testUsername);
                expect(friends1.length).toBe(1);
                expect(friends1[0]).toBe('Test_User_2');
                yield services_1.default.deleteUser(token2, 'Test_User_2');
            }));
            test('Remove undexisting friend', () => __awaiter(void 0, void 0, void 0, function* () {
                expect((yield expectThrow(services_1.default.removeFriend, testToken, 'Test_User_2'))).toEqual(errors_1.default.USER_DOES_NOT_HAVE_THAT_FRIEND);
            }));
            test('Valid remove friend', () => __awaiter(void 0, void 0, void 0, function* () {
                const token2 = yield services_1.default.createUser('Test_User_2', 'Test_Password');
                yield services_1.default.addFriend(testToken, 'Test_User_2');
                const friends = yield services_1.default.getFriends(testToken, testUsername);
                expect(friends.length).toBe(1);
                expect(friends[0]).toBe('Test_User_2');
                yield services_1.default.removeFriend(testToken, 'Test_User_2');
                const friends1 = yield services_1.default.getFriends(testToken, testUsername);
                expect(friends1.length).toBe(0);
                yield services_1.default.deleteUser(token2, 'Test_User_2');
            }));
        });
    });
    describe('Games', () => {
        test('Create a public game (another player can join with black pieces)', () => __awaiter(void 0, void 0, void 0, function* () {
            yield services_1.default.deleteGame(testGameID);
            yield services_1.default.createGame(testToken, testGameID, true, null);
            expect(yield services_1.default.gameExists(testToken, testGameID)).toBeTruthy();
        }));
        test('Create a game where player with black pieces does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            yield services_1.default.deleteGame(testGameID);
            expect((yield expectThrow(services_1.default.createGame, testToken, testGameID, true, "N/A")).message).toBe(errors_1.default.PLAYER2_DOES_NOT_EXIST.message);
            expect(yield services_1.default.gameExists(testToken, testGameID)).toBeFalsy();
        }));
        test('Create a private game with 2 players', () => __awaiter(void 0, void 0, void 0, function* () {
            const newUserToken = yield services_1.default.createUser('test_user', 'test_password');
            yield services_1.default.deleteGame(testGameID);
            yield services_1.default.createGame(testToken, testGameID, true, 'test_user');
            expect(yield services_1.default.userExists(testToken, 'test_user')).toBeTruthy();
            expect(yield services_1.default.gameExists(testToken, testGameID)).toBeTruthy();
            const game = yield services_1.default.getGame(testGameID, testToken);
            const board = board_1.BoardObject.fromMoves(game.moves);
            yield services_1.default.deleteUser(newUserToken, 'test_user');
            expect(game._id).toBe(testGameID);
            expect(game.player_w).toBe(testUsername);
            expect(game.player_b).toBe('test_user');
            expect(board.turn).toBe("w");
            expect(game.winner).toBeNull();
        }));
        test('Create game with invalid Game ID', () => __awaiter(void 0, void 0, void 0, function* () {
            yield services_1.default.deleteGame(testGameID);
            expect((yield expectThrow(services_1.default.createGame, testToken, "")).message).toBe(errors_1.default.INVALID_GAMEID_LENGTH.message);
            expect(yield services_1.default.gameExists(testToken, testGameID)).toBeFalsy();
        }));
        test('Valid moves on the board', () => __awaiter(void 0, void 0, void 0, function* () {
            const token2 = yield services_1.default.createUser('New_User_2', 'mypassword');
            expect(yield services_1.default.connectToGame(token2, testGameID)).toBeTruthy();
            expect((yield services_1.default.getGame(testGameID, token2)).player_w).toBe(testUsername);
            expect((yield services_1.default.getGame(testGameID, token2)).player_b).toBe('New_User_2');
            expect((yield expectThrow(services_1.default.executeGameMove, token2, testGameID, 'pb2b4')).message).toBe(errors_1.default.NOT_YOUR_TURN.message);
            expect(yield services_1.default.executeGameMove(testToken, testGameID, 'pb2b4')).toBeTruthy();
            const updatedGame = yield services_1.default.getGame(testGameID, testToken);
            const updatedBoard = board_1.BoardObject.fromMoves(updatedGame.moves);
            expect(updatedBoard.turn).toBe("b");
            expect(updatedBoard.toString()).toBe("rnbqkbnrpppppppp                 P              P PPPPPPRNBQKBNR");
            expect((yield expectThrow(services_1.default.executeGameMove, testToken, testGameID, 'pb2b4')).message).toBe(errors_1.default.NOT_YOUR_TURN.message);
            expect(yield services_1.default.executeGameMove(token2, testGameID, 'pb7b6')).toBeTruthy();
            const updatedGame1 = yield services_1.default.getGame(testGameID, testToken);
            const updatedBoard1 = board_1.BoardObject.fromMoves(updatedGame1.moves);
            expect(updatedBoard1.turn).toBe("w");
            expect(updatedBoard1.toString()).toBe("rnbqkbnrp pppppp p               P              P PPPPPPRNBQKBNR");
            yield services_1.default.deleteUser(token2, 'New_User_2');
        }));
    });
});
