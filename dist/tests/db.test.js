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
const errors_1 = __importDefault(require("../errors/errors"));
const services_1 = __importDefault(require("../services"));
describe('Services Tests', () => {
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
            yield services_1.default.createGame(testToken, testGameID);
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
            const token2 = yield services_1.default.createUser('Test User 2', 'Mypassword2');
            expect(token2).toBeDefined();
            yield services_1.default.deleteUser(token2, 'Test User 2');
        }));
        test('Create duplicate User', () => __awaiter(void 0, void 0, void 0, function* () {
            const token2 = yield services_1.default.createUser('Test User 2', 'Mypassword2');
            expect(token2).toBeDefined();
            expect((yield expectThrow(services_1.default.createUser, 'Test User 2', 'Mypassword5')).message).toBe(errors_1.default.USER_ALREADY_EXISTS.message);
            yield services_1.default.deleteUser(token2, 'Test User 2');
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
            yield services_1.default.updateUserPassword(testToken, testUsername, 'NewPassword');
            expect(yield services_1.default.validateCredentials(testUsername, 'NewPassword')).toBeTruthy();
        }));
        test('Update user public rank', () => __awaiter(void 0, void 0, void 0, function* () {
            yield services_1.default.updateUserPublic(testToken, testUsername, { rank: 92 });
            expect((yield services_1.default.getUserPublic(testToken, testUsername)).rank).toBe("92");
        }));
    });
    describe('Games', () => {
        test('Create a public game (another player can join with black pieces)', () => __awaiter(void 0, void 0, void 0, function* () {
            yield services_1.default.deleteGame(testGameID);
            yield services_1.default.createGame(testToken, testGameID);
            expect(yield services_1.default.gameExists(testToken, testGameID)).toBeTruthy();
        }));
        test('Create a private game where player with black pieces does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            yield services_1.default.deleteGame(testGameID);
            expect((yield expectThrow(services_1.default.createGame, testToken, testGameID, "N/A")).message).toBe(errors_1.default.USER_DOES_NOT_EXIST.message);
            expect(yield services_1.default.gameExists(testToken, testGameID)).toBeFalsy();
        }));
        test('Create a private game with 2 players', () => __awaiter(void 0, void 0, void 0, function* () {
            const newUserToken = yield services_1.default.createUser('test_user', 'test_password');
            yield services_1.default.deleteGame(testGameID);
            yield services_1.default.createGame(testToken, testGameID, 'test_user');
            expect(yield services_1.default.userExists(testToken, 'test_user')).toBeTruthy();
            expect(yield services_1.default.gameExists(testToken, testGameID)).toBeTruthy();
            const game = yield services_1.default.getGame(testToken, testGameID);
            yield services_1.default.deleteUser(newUserToken, 'test_user');
            expect(game._id).toBe(testGameID);
            expect(game.player_white).toBe(testUsername);
            expect(game.player_black).toBe('test_user');
            expect(game.turn).toBe("w");
            expect(game.winner).toBeNull();
        }));
        test('Create game with invalid Game ID', () => __awaiter(void 0, void 0, void 0, function* () {
            yield services_1.default.deleteGame(testGameID);
            expect((yield expectThrow(services_1.default.createGame, testToken, "")).message).toBe(errors_1.default.INVALID_GAMEID_LENGTH.message);
            expect(yield services_1.default.gameExists(testToken, testGameID)).toBeFalsy();
        }));
        test('Valid is allowed to connect to a game', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(yield services_1.default.isAllowedToConnectToGame(testToken, testGameID)).toBeTruthy();
        }));
        test('Valid is allowed to connect to a game with player_black=null', () => __awaiter(void 0, void 0, void 0, function* () {
            const token2 = yield services_1.default.createUser('New User 2', 'mypassword');
            // Test the game creator as well
            expect(yield services_1.default.isAllowedToConnectToGame(testToken, testGameID)).toBeTruthy();
            expect(yield services_1.default.isAllowedToConnectToGame(token2, testGameID)).toBeTruthy();
            const token3 = yield services_1.default.createUser('New User 3', 'mypassword');
            expect(yield services_1.default.isAllowedToConnectToGame(token3, testGameID)).toBeTruthy();
            expect(yield services_1.default.isAllowedToConnectToGame(testToken, testGameID)).toBeTruthy();
            yield services_1.default.deleteUser(token2, 'New User 2');
            yield services_1.default.deleteUser(token3, 'New User 3');
        }));
        test('Valid is allowed to connect to a game with player_black!=null', () => __awaiter(void 0, void 0, void 0, function* () {
            const token2 = yield services_1.default.createUser('New User 2', 'mypassword');
            // Test the game creator as well
            expect(yield services_1.default.isAllowedToConnectToGame(testToken, testGameID)).toBeTruthy();
            expect(yield services_1.default.isAllowedToConnectToGame(token2, testGameID)).toBeTruthy();
            expect(yield services_1.default.connectToGame(token2, testGameID)).toBeTruthy();
            const token3 = yield services_1.default.createUser('New User 3', 'mypassword');
            // Game should already be full
            expect(yield services_1.default.isAllowedToConnectToGame(token3, testGameID)).toBeFalsy();
            // This is one of the allowed players
            expect(yield services_1.default.isAllowedToConnectToGame(testToken, testGameID)).toBeTruthy();
            yield services_1.default.deleteUser(token2, 'New User 2');
            yield services_1.default.deleteUser(token3, 'New User 3');
        }));
        test('Valid moves on the board', () => __awaiter(void 0, void 0, void 0, function* () {
            const token2 = yield services_1.default.createUser('New User 2', 'mypassword');
            expect(yield services_1.default.connectToGame(token2, testGameID)).toBeTruthy();
            expect((yield services_1.default.getGame(token2, testGameID)).player_white).toBe(testUsername);
            expect((yield services_1.default.getGame(token2, testGameID)).player_black).toBe('New User 2');
            expect((yield expectThrow(services_1.default.executeGameMove, token2, testGameID, 'pb2b4')).message).toBe(errors_1.default.NOT_YOUR_TURN.message);
            expect(yield services_1.default.executeGameMove(testToken, testGameID, 'pb2b4')).toBeTruthy();
            const updatedGame = yield services_1.default.getGame(testToken, testGameID);
            expect(updatedGame.turn).toBe("b");
            expect(updatedGame.board).toBe("rnbqkbnrpppppppp                 P              P PPPPPPRNBQKBNR");
            expect((yield expectThrow(services_1.default.executeGameMove, testToken, testGameID, 'pb2b4')).message).toBe(errors_1.default.NOT_YOUR_TURN.message);
            expect(yield services_1.default.executeGameMove(token2, testGameID, 'pb7b6')).toBeTruthy();
            const updatedGame1 = yield services_1.default.getGame(testToken, testGameID);
            expect(updatedGame1.turn).toBe("w");
            expect(updatedGame1.board).toBe("rnbqkbnrp pppppp p               P              P PPPPPPRNBQKBNR");
            yield services_1.default.deleteUser(token2, 'New User 2');
        }));
    });
});
