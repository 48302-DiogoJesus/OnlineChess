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
const services_1 = __importDefault(require("../../services"));
const supertest_1 = __importDefault(require("supertest"));
const routes_1 = __importDefault(require("../../routes/routes"));
const board_1 = require("../../model/board");
const config_1 = __importDefault(require("../../config"));
const common_1 = require("../../db/common");
describe('API Tests', () => {
    config_1.default.TEST_ENV = true;
    (0, common_1.connectMongoDB)().then(() => (0, common_1.clearDatabase)());
    const testUsername = '|T-e-s-t|U-s-e-r|';
    const testPassword = 'TestPassword';
    var testToken = '';
    const testGameID = 'L|O|C|A|L|G|A|M|E|ID';
    const resources = {
        'users': '/users',
        'auth': '/auth',
        'games': '/games',
    };
    const calcAuthorizationHeader = () => 'Bearer ' + testToken;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            testToken = yield services_1.default.createUser(testUsername, testPassword);
        }
        catch (_a) { }
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield services_1.default.deleteUser(testToken, testUsername);
        }
        catch (_b) { }
    }));
    describe('Users', () => {
        it('Get user data without being authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(routes_1.default)
                .get(resources.users + '/unexisting_username');
            expect(response.status).toBe(401);
        }));
        it('Get user data from unexisting user', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(routes_1.default)
                .get(resources.users + '/unexisting_username')
                .set('Authorization', calcAuthorizationHeader());
            expect(response.status).toBe(404);
        }));
        it('Get user data from existing user', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(routes_1.default)
                .get(resources.users + `/${testUsername}`)
                .set('Authorization', calcAuthorizationHeader())
                .set('Accept', 'application/json');
            expect(response.status).toBe(200);
            expect(response.body.data._id).toBe(testUsername);
            expect(response.body.data.rank).toBe("0");
        }));
        it('Get data from all users', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(routes_1.default)
                .get(resources.users)
                .set('Authorization', calcAuthorizationHeader())
                .set('Accept', 'application/json');
            expect(response.status).toBe(200);
            expect(response.body.data.length).toBe(1);
            expect(response.body.data[0]._id).toBe(testUsername);
        }));
        it('Create valid user', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(routes_1.default)
                .post(resources.users)
                .send({
                'username': 'Test_User',
                'password': 'Test_Password'
            })
                .set('Accept', 'application/json');
            expect(response.status).toBe(201);
            expect(response.body.token).toBeDefined();
            yield (0, supertest_1.default)(routes_1.default)
                .delete(resources.users + '/Test_User')
                .set('Authorization', 'Bearer ' + response.body.token);
        }));
        it('Create invalid user', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(routes_1.default)
                .post(resources.users)
                .send({
                'username': 'Test User',
                'password': 'Test_Password'
            })
                .set('Accept', 'application/json');
            expect(response.status).toBe(400);
            expect(response.body.error.message).toBe(errors_1.default.INVALID_USERNAME_WS.message);
        }));
        it('Delete unexisting user', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(routes_1.default)
                .delete(resources.users + '/unexisting_user')
                .set('Accept', 'application/json')
                .set('Authorization', calcAuthorizationHeader());
            expect(response.status).toBe(403);
            expect(response.body.error.message).toBe(errors_1.default.NOT_AUTHORIZED.message);
        }));
        it('Delete another existing user with non-corresponding token', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = (yield (0, supertest_1.default)(routes_1.default)
                .post(resources.users)
                .send({
                'username': 'Test_User',
                'password': 'Test_Password'
            })).body.token;
            const response = yield (0, supertest_1.default)(routes_1.default)
                .delete(resources.users + '/Test_User')
                .set('Accept', 'application/json')
                .set('Authorization', calcAuthorizationHeader());
            expect(response.status).toBe(403);
            expect(response.body.error.message).toBe(errors_1.default.NOT_AUTHORIZED.message);
            yield (0, supertest_1.default)(routes_1.default)
                .delete(resources.users + '/Test_User')
                .set('Authorization', 'Bearer ' + token);
        }));
        it('Valid delete himself', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(routes_1.default)
                .delete(resources.users + `/${testUsername}`)
                .set('Authorization', calcAuthorizationHeader());
            expect(response.status).toBe(200);
            const response1 = yield (0, supertest_1.default)(routes_1.default)
                .get(resources.users + `/${testUsername}`);
            // Token should be invalid since it was deleted int he previous operation
            expect(response1.status).toBe(401);
        }));
        describe('Friends', () => {
            test('Get friends from unexisting user', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(routes_1.default)
                    .get(resources.users + `/Test_user_2/friends`)
                    .set('Authorization', calcAuthorizationHeader());
                expect(response.status).toBe(404);
            }));
            test('Get friends from himself', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(routes_1.default)
                    .get(resources.users + `/${testUsername}/friends`)
                    .set('Authorization', calcAuthorizationHeader());
                expect(response.status).toBe(200);
                expect(response.body.data.length).toBe(0);
            }));
            test('Get friends from other user', () => __awaiter(void 0, void 0, void 0, function* () {
                const token2 = yield services_1.default.createUser('Test_User_2', 'Test_Password');
                const response = yield (0, supertest_1.default)(routes_1.default)
                    .get(resources.users + `/Test_User_2/friends`)
                    .set('Authorization', calcAuthorizationHeader());
                expect(response.status).toBe(200);
                expect(response.body.data.length).toBe(0);
                yield services_1.default.deleteUser(token2, 'Test_User_2');
            }));
            test('Add unexisting friend to user', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(routes_1.default)
                    .put(resources.users + `/friends`)
                    .set('Authorization', calcAuthorizationHeader())
                    .send({
                    'friend': 'UNEXISTING_USER'
                });
                expect(response.status).toBe(404);
            }));
            test('Add friend to user', () => __awaiter(void 0, void 0, void 0, function* () {
                const token2 = yield services_1.default.createUser('Test_User_2', 'Test_Password');
                const response = yield (0, supertest_1.default)(routes_1.default)
                    .put(resources.users + `/friends`)
                    .set('Authorization', calcAuthorizationHeader())
                    .send({
                    'friend': 'Test_User_2'
                });
                expect(response.status).toBe(200);
                const getFriends = yield (0, supertest_1.default)(routes_1.default)
                    .get(resources.users + `/${testUsername}/friends`)
                    .set('Authorization', 'Bearer ' + token2);
                expect(getFriends.status).toBe(200);
                expect(getFriends.body.data.length).toBe(1);
                expect(getFriends.body.data[0]).toBe('Test_User_2');
                yield services_1.default.deleteUser(token2, 'Test_User_2');
            }));
            test('Add duplicate friend to user', () => __awaiter(void 0, void 0, void 0, function* () {
                const token2 = yield services_1.default.createUser('Test_User_2', 'Test_Password');
                const response = yield (0, supertest_1.default)(routes_1.default)
                    .put(resources.users + `/friends`)
                    .set('Authorization', calcAuthorizationHeader())
                    .send({
                    'friend': 'Test_User_2'
                });
                expect(response.status).toBe(200);
                const response1 = yield (0, supertest_1.default)(routes_1.default)
                    .put(resources.users + `/friends`)
                    .set('Authorization', calcAuthorizationHeader())
                    .send({
                    'friend': 'Test_User_2'
                });
                expect(response1.status).toBe(409);
                yield services_1.default.deleteUser(token2, 'Test_User_2');
            }));
            test('Remove unexisting friend', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(routes_1.default)
                    .delete(resources.users + `/friends/Test_User_2`)
                    .set('Authorization', calcAuthorizationHeader());
                expect(response.status).toBe(404);
            }));
            test('Valid remove friend', () => __awaiter(void 0, void 0, void 0, function* () {
                const token2 = yield services_1.default.createUser('Test_User_2', 'Test_Password');
                const response = yield (0, supertest_1.default)(routes_1.default)
                    .put(resources.users + `/friends`)
                    .set('Authorization', calcAuthorizationHeader())
                    .send({
                    'friend': 'Test_User_2'
                });
                expect(response.status).toBe(200);
                const response1 = yield (0, supertest_1.default)(routes_1.default)
                    .delete(resources.users + `/friends/Test_User_2`)
                    .set('Authorization', calcAuthorizationHeader());
                expect(response1.status).toBe(200);
                yield services_1.default.deleteUser(token2, 'Test_User_2');
            }));
        });
    });
    describe('Authentication', () => {
        it('Invalid Login', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(routes_1.default)
                .post(resources.auth)
                .send({
                'username': 'Test_User',
                'password': 'Test_Password'
            })
                .set('Accept', 'application/json');
            expect(response.status).toBe(404);
            expect(response.body.error).toEqual(errors_1.default.USER_DOES_NOT_EXIST);
        }));
        it('Invalid Login existing user but wrong password', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(routes_1.default)
                .post(resources.auth)
                .send({
                'username': testUsername,
                'password': 'Test_Password'
            })
                .set('Accept', 'application/json');
            expect(response.status).toBe(400);
            expect(response.body.error).toEqual(errors_1.default.WRONG_PASSWORD);
        }));
        it('Valid Login', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(routes_1.default)
                .post(resources.auth)
                .send({
                'username': testUsername,
                'password': testPassword
            })
                .set('Accept', 'application/json');
            expect(response.status).toBe(200);
        }));
        it('Invalid update user password', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(routes_1.default)
                .put(resources.auth)
                .send({
                'password': 'New password'
            })
                .set('Accept', 'application/json')
                .set('Authorization', calcAuthorizationHeader());
            expect(response.status).toBe(400);
        }));
        it('Valid update user password', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(routes_1.default)
                .put(resources.auth)
                .send({
                'password': 'New_password'
            })
                .set('Accept', 'application/json')
                .set('Authorization', calcAuthorizationHeader());
            expect(response.status).toBe(200);
            const response1 = yield (0, supertest_1.default)(routes_1.default)
                .post(resources.auth)
                .set('Authorization', calcAuthorizationHeader())
                .send({
                'username': testUsername,
                'password': 'New_password'
            });
            expect(response1.status).toBe(200);
        }));
    });
    describe('Games', () => {
        it('Create a game unauthenticated', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(routes_1.default)
                .post(resources.games)
                .send({
                'id': testGameID
            })
                .set('Accept', 'application/json');
            expect(response.status).toBe(401);
        }));
        it('Create a game invalid game id', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(routes_1.default)
                .post(resources.games)
                .send({
                'id': 'invalid game id'
            })
                .set('Accept', 'application/json')
                .set('Authorization', calcAuthorizationHeader());
            expect(response.status).toBe(400);
            expect(response.body.error).toEqual(errors_1.default.INVALID_GAMEID_WS);
        }));
        it('Create a valid game', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(routes_1.default)
                .post(resources.games)
                .send({
                'id': testGameID
            })
                .set('Accept', 'application/json')
                .set('Authorization', calcAuthorizationHeader());
            expect(response.status).toBe(201);
            const initialGameObject = response.body.data;
            const board = board_1.BoardObject.fromMoves(initialGameObject.moves);
            expect(initialGameObject._id).toEqual(testGameID);
            expect(board.turn).toEqual("w");
            expect(initialGameObject.winner).toBeNull();
            expect(board.toString().length).toBe(64);
            yield services_1.default.deleteGame(testGameID);
        }));
        it('Connect to an open game as player_black', () => __awaiter(void 0, void 0, void 0, function* () {
            // Create Game
            yield services_1.default.createGame(testToken, testGameID, true, null);
            const otherUserToken = yield services_1.default.createUser('Test_User', 'Test_Password');
            const response = yield (0, supertest_1.default)(routes_1.default)
                .get(resources.games + `/connect?id=${testGameID}`)
                .send({
                'id': testGameID
            })
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + otherUserToken);
            expect(response.status).toBe(200);
            const gameObject = response.body.data;
            const board = board_1.BoardObject.fromMoves(gameObject.moves);
            expect(gameObject._id).toEqual(testGameID);
            expect(board.turn).toEqual("w");
            expect(gameObject.player_w).toEqual(testUsername);
            expect(gameObject.player_b).toEqual('Test_User');
            expect(gameObject.winner).toBeNull();
            expect(board.toString().length).toBe(64);
            yield services_1.default.deleteUser(otherUserToken, 'Test_User');
            yield services_1.default.deleteGame(testGameID);
        }));
        it('Connect to a closed game', () => __awaiter(void 0, void 0, void 0, function* () {
            const otherUserToken = yield services_1.default.createUser('Test_User', 'Test_Password');
            yield services_1.default.createGame(testToken, testGameID, true, 'Test_User');
            // Connect as the invited user
            const response = yield (0, supertest_1.default)(routes_1.default)
                .get(resources.games + `/connect?id=${testGameID}`)
                .send({
                'id': testGameID
            })
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + otherUserToken);
            expect(response.status).toBe(200);
            const gameObject = response.body.data;
            const board = board_1.BoardObject.fromMoves(gameObject.moves);
            expect(gameObject._id).toEqual(testGameID);
            expect(board.turn).toEqual("w");
            expect(gameObject.player_w).toEqual(testUsername);
            expect(gameObject.player_b).toEqual('Test_User');
            expect(gameObject.winner).toBeNull();
            expect(board.toString().length).toBe(64);
            // Re-connect as the game creator
            const response1 = yield (0, supertest_1.default)(routes_1.default)
                .get(resources.games + `/connect?id=${testGameID}`)
                .send({
                'id': testGameID
            })
                .set('Accept', 'application/json')
                .set('Authorization', calcAuthorizationHeader());
            expect(response1.status).toBe(200);
            const gameObject1 = response.body.data;
            const board1 = board_1.BoardObject.fromMoves(gameObject.moves);
            expect(gameObject1._id).toEqual(testGameID);
            expect(board1.turn).toEqual("w");
            expect(gameObject1.player_w).toEqual(testUsername);
            expect(gameObject1.player_b).toEqual('Test_User');
            expect(gameObject1.winner).toBeNull();
            expect(board1.toString().length).toBe(64);
            yield services_1.default.deleteUser(otherUserToken, 'Test_User');
            yield services_1.default.deleteGame(testGameID);
        }));
        it('Make a move on remote game invalid turn', () => __awaiter(void 0, void 0, void 0, function* () {
            const otherUserToken = yield services_1.default.createUser('Test_User', 'Test_Password');
            yield services_1.default.createGame(testToken, testGameID, true, 'Test_User');
            const response = yield (0, supertest_1.default)(routes_1.default)
                .get(resources.games + `/makemove?id=${testGameID}&move=pb2b4`)
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + otherUserToken);
            expect(response.status).toBe(403);
            expect(response.body.error).toEqual(errors_1.default.NOT_YOUR_TURN);
            yield services_1.default.deleteUser(otherUserToken, 'Test_User');
            yield services_1.default.deleteGame(testGameID);
        }));
        it('Make a move on remote game valid turn', () => __awaiter(void 0, void 0, void 0, function* () {
            const otherUserToken = yield services_1.default.createUser('Test_User', 'Test_Password');
            yield services_1.default.createGame(testToken, testGameID, true, 'Test_User');
            const response = yield (0, supertest_1.default)(routes_1.default)
                .get(resources.games + `/makemove?id=${testGameID}&move=pb2b4`)
                .set('Accept', 'application/json')
                .set('Authorization', calcAuthorizationHeader());
            expect(response.status).toBe(200);
            const updatedGameObject = response.body.data;
            const board = board_1.BoardObject.fromMoves(updatedGameObject.moves);
            expect(updatedGameObject._id).toEqual(testGameID);
            expect(board.turn).toEqual("b");
            expect(updatedGameObject.winner).toBeNull();
            expect(board.toString()).toBe('rnbqkbnrpppppppp                 P              P PPPPPPRNBQKBNR');
            // Get updated game as player_black
            const getRemoteGameBlack = yield (0, supertest_1.default)(routes_1.default)
                .get(resources.games + `?id=${testGameID}`)
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + otherUserToken);
            expect(getRemoteGameBlack.status).toBe(200);
            const updatedGameObjectB = getRemoteGameBlack.body.data;
            const board1 = board_1.BoardObject.fromMoves(updatedGameObject.moves);
            expect(updatedGameObjectB._id).toEqual(testGameID);
            expect(board1.turn).toEqual("b");
            expect(updatedGameObjectB.winner).toBeNull();
            expect(board1.toString()).toBe('rnbqkbnrpppppppp                 P              P PPPPPPRNBQKBNR');
            yield services_1.default.deleteUser(otherUserToken, 'Test_User');
            yield services_1.default.deleteGame(testGameID);
        }));
    });
});
