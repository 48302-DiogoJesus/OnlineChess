import ERRORS, { ErrorObject } from '../../errors/errors'
import Services from '../../services'
import supertest from 'supertest'
import ExpressApp from '../../routes/routes'
import { GameObject } from '../../db/schemas/game'
import { BoardObject } from '../../model/board'
import CONFIG from '../../config'
import { clearDatabase, connectMongoDB } from '../../db/common'

describe('API Tests', () => {

    CONFIG.TEST_ENV = true
    connectMongoDB().then(() => clearDatabase())

    const testUsername = '|T-e-s-t|U-s-e-r|'
    const testPassword = 'TestPassword'
    var testToken = ''
    const testGameID = 'L|O|C|A|L|G|A|M|E|ID'

    const resources = {
        'users': '/users',
        'auth': '/auth',
        'games': '/games',
    }

    const calcAuthorizationHeader = () => 'Bearer ' + testToken

    beforeEach(async () => {
        try {
            testToken = await Services.createUser(testUsername, testPassword)
        } catch { }
    })

    afterEach(async () => {
        try {
            await Services.deleteUser(testToken, testUsername)
        } catch { }
    })

    describe('Users', () => {

        it('Get user data without being authenticated', async () => {
            const response = await supertest(ExpressApp)
                .get(resources.users + '/unexisting_username')

            expect(response.status).toBe(401)
        })

        it('Get user data from unexisting user', async () => {
            const response = await supertest(ExpressApp)
                .get(resources.users + '/unexisting_username')
                .set('Authorization', calcAuthorizationHeader())

            expect(response.status).toBe(404)
        })

        it('Get user data from existing user', async () => {
            const response = await supertest(ExpressApp)
                .get(resources.users + `/${testUsername}`)
                .set('Authorization', calcAuthorizationHeader())
                .set('Accept', 'application/json')

            expect(response.status).toBe(200)
            expect(response.body.data._id).toBe(testUsername)
            expect(response.body.data.rank).toBe("0")
        })

        it('Get data from all users', async () => {
            const response = await supertest(ExpressApp)
                .get(resources.users)
                .set('Authorization', calcAuthorizationHeader())
                .set('Accept', 'application/json')

            expect(response.status).toBe(200)
            expect(response.body.data.length).toBe(1)
            expect(response.body.data[0]._id).toBe(testUsername)
        })

        it('Create valid user', async () => {
            const response = await supertest(ExpressApp)
                .post(resources.users)
                .send({
                    'username': 'Test_User',
                    'password': 'Test_Password'
                })
                .set('Accept', 'application/json')

            expect(response.status).toBe(201)
            expect(response.body.token).toBeDefined()

            await supertest(ExpressApp)
                .delete(resources.users + '/Test_User')
                .set('Authorization', 'Bearer ' + response.body.token)
        })

        it('Create invalid user', async () => {
            const response = await supertest(ExpressApp)
                .post(resources.users)
                .send({
                    'username': 'Test User',
                    'password': 'Test_Password'
                })
                .set('Accept', 'application/json')

            expect(response.status).toBe(400)
            expect(response.body.error.message).toBe(ERRORS.INVALID_USERNAME_WS.message)
        })

        it('Delete unexisting user', async () => {
            const response = await supertest(ExpressApp)
                .delete(resources.users + '/unexisting_user')
                .set('Accept', 'application/json')
                .set('Authorization', calcAuthorizationHeader())

            expect(response.status).toBe(403)
            expect(response.body.error.message).toBe(ERRORS.NOT_AUTHORIZED.message)
        })

        it('Delete another existing user with non-corresponding token', async () => {
            const token = (await supertest(ExpressApp)
                .post(resources.users)
                .send({
                    'username': 'Test_User',
                    'password': 'Test_Password'
                })).body.token

            const response = await supertest(ExpressApp)
                .delete(resources.users + '/Test_User')
                .set('Accept', 'application/json')
                .set('Authorization', calcAuthorizationHeader())

            expect(response.status).toBe(403)
            expect(response.body.error.message).toBe(ERRORS.NOT_AUTHORIZED.message)

            await supertest(ExpressApp)
                .delete(resources.users + '/Test_User')
                .set('Authorization', 'Bearer ' + token)
        })

        it('Valid delete himself', async () => {
            const response = await supertest(ExpressApp)
                .delete(resources.users + `/${testUsername}`)
                .set('Authorization', calcAuthorizationHeader())

            expect(response.status).toBe(200)

            const response1 = await supertest(ExpressApp)
                .get(resources.users + `/${testUsername}`)

            // Token should be invalid since it was deleted int he previous operation
            expect(response1.status).toBe(401)
        })

        describe('Friends', () => {

            test('Get friends from unexisting user', async () => {
                const response = await supertest(ExpressApp)
                    .get(resources.users + `/Test_user_2/friends`)
                    .set('Authorization', calcAuthorizationHeader())

                expect(response.status).toBe(404)
            })

            test('Get friends from himself', async () => {
                const response = await supertest(ExpressApp)
                    .get(resources.users + `/${testUsername}/friends`)
                    .set('Authorization', calcAuthorizationHeader())

                expect(response.status).toBe(200)
                expect(response.body.data.length).toBe(0)
            })

            test('Get friends from other user', async () => {
                const token2 = await Services.createUser('Test_User_2', 'Test_Password')

                const response = await supertest(ExpressApp)
                    .get(resources.users + `/Test_User_2/friends`)
                    .set('Authorization', calcAuthorizationHeader())

                expect(response.status).toBe(200)
                expect(response.body.data.length).toBe(0)

                await Services.deleteUser(token2, 'Test_User_2')
            })

            test('Add unexisting friend to user', async () => {
                const response = await supertest(ExpressApp)
                    .put(resources.users + `/friends`)
                    .set('Authorization', calcAuthorizationHeader())
                    .send({
                        'friend': 'UNEXISTING_USER'
                    })

                expect(response.status).toBe(404)
            })

            test('Add friend to user', async () => {
                const token2 = await Services.createUser('Test_User_2', 'Test_Password')

                const response = await supertest(ExpressApp)
                    .put(resources.users + `/friends`)
                    .set('Authorization', calcAuthorizationHeader())
                    .send({
                        'friend': 'Test_User_2'
                    })

                expect(response.status).toBe(200)

                const getFriends = await supertest(ExpressApp)
                    .get(resources.users + `/${testUsername}/friends`)
                    .set('Authorization', 'Bearer ' + token2)
                expect(getFriends.status).toBe(200)
                expect(getFriends.body.data.length).toBe(1)
                expect(getFriends.body.data[0]).toBe('Test_User_2')

                await Services.deleteUser(token2, 'Test_User_2')
            })

            test('Add duplicate friend to user', async () => {
                const token2 = await Services.createUser('Test_User_2', 'Test_Password')

                const response = await supertest(ExpressApp)
                    .put(resources.users + `/friends`)
                    .set('Authorization', calcAuthorizationHeader())
                    .send({
                        'friend': 'Test_User_2'
                    })

                expect(response.status).toBe(200)

                const response1 = await supertest(ExpressApp)
                    .put(resources.users + `/friends`)
                    .set('Authorization', calcAuthorizationHeader())
                    .send({
                        'friend': 'Test_User_2'
                    })

                expect(response1.status).toBe(409)

                await Services.deleteUser(token2, 'Test_User_2')
            })

            test('Remove unexisting friend', async () => {
                const response = await supertest(ExpressApp)
                    .delete(resources.users + `/friends/Test_User_2`)
                    .set('Authorization', calcAuthorizationHeader())

                expect(response.status).toBe(404)
            })

            test('Valid remove friend', async () => {
                const token2 = await Services.createUser('Test_User_2', 'Test_Password')

                const response = await supertest(ExpressApp)
                    .put(resources.users + `/friends`)
                    .set('Authorization', calcAuthorizationHeader())
                    .send({
                        'friend': 'Test_User_2'
                    })
                expect(response.status).toBe(200)

                const response1 = await supertest(ExpressApp)
                    .delete(resources.users + `/friends/Test_User_2`)
                    .set('Authorization', calcAuthorizationHeader())

                expect(response1.status).toBe(200)

                await Services.deleteUser(token2, 'Test_User_2')
            })
        })
    })

    describe('Authentication', () => {
        it('Invalid Login', async () => {
            const response = await supertest(ExpressApp)
                .post(resources.auth)
                .send({
                    'username': 'Test_User',
                    'password': 'Test_Password'
                })
                .set('Accept', 'application/json')

            expect(response.status).toBe(404)
            expect(response.body.error).toEqual(ERRORS.USER_DOES_NOT_EXIST)
        })

        it('Invalid Login existing user but wrong password', async () => {
            const response = await supertest(ExpressApp)
                .post(resources.auth)
                .send({
                    'username': testUsername,
                    'password': 'Test_Password'
                })
                .set('Accept', 'application/json')

            expect(response.status).toBe(400)
            expect(response.body.error).toEqual(ERRORS.WRONG_PASSWORD)
        })

        it('Valid Login', async () => {
            const response = await supertest(ExpressApp)
                .post(resources.auth)
                .send({
                    'username': testUsername,
                    'password': testPassword
                })
                .set('Accept', 'application/json')

            expect(response.status).toBe(200)
        })


        it('Invalid update user password', async () => {
            const response = await supertest(ExpressApp)
                .put(resources.auth)
                .send({
                    'password': 'New password'
                })
                .set('Accept', 'application/json')
                .set('Authorization', calcAuthorizationHeader())

            expect(response.status).toBe(400)
        })

        it('Valid update user password', async () => {
            const response = await supertest(ExpressApp)
                .put(resources.auth)
                .send({
                    'password': 'New_password'
                })
                .set('Accept', 'application/json')
                .set('Authorization', calcAuthorizationHeader())

            expect(response.status).toBe(200)

            const response1 = await supertest(ExpressApp)
                .post(resources.auth)
                .set('Authorization', calcAuthorizationHeader())
                .send({
                    'username': testUsername,
                    'password': 'New_password'
                })

            expect(response1.status).toBe(200)
        })
    })

    describe('Games', () => {

        it('Create a game unauthenticated', async () => {
            const response = await supertest(ExpressApp)
                .post(resources.games)
                .send({
                    'id': testGameID
                })
                .set('Accept', 'application/json')

            expect(response.status).toBe(401)
        })

        it('Create a game invalid game id', async () => {
            const response = await supertest(ExpressApp)
                .post(resources.games)
                .send({
                    'id': 'invalid game id'
                })
                .set('Accept', 'application/json')
                .set('Authorization', calcAuthorizationHeader())

            expect(response.status).toBe(400)
            expect(response.body.error).toEqual(ERRORS.INVALID_GAMEID_WS)
        })

        it('Create a valid game', async () => {
            const response = await supertest(ExpressApp)
                .post(resources.games)
                .send({
                    'id': testGameID
                })
                .set('Accept', 'application/json')
                .set('Authorization', calcAuthorizationHeader())

            expect(response.status).toBe(201)
            const initialGameObject = response.body.data as GameObject
            const board = BoardObject.fromMoves(initialGameObject.moves)
            expect(initialGameObject._id).toEqual(testGameID)
            expect(board.turn).toEqual("w")
            expect(initialGameObject.winner).toBeNull()
            expect(board.toString().length).toBe(64)

            await Services.deleteGame(testGameID)
        })

        it('Connect to an open game as player_black', async () => {
            // Create Game
            await Services.createGame(testToken, testGameID, true, null)
            const otherUserToken = await Services.createUser('Test_User', 'Test_Password')

            const response = await supertest(ExpressApp)
                .get(resources.games + `/connect?id=${testGameID}`)
                .send({
                    'id': testGameID
                })
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + otherUserToken)

            expect(response.status).toBe(200)
            const gameObject = response.body.data as GameObject
            const board = BoardObject.fromMoves(gameObject.moves)
            expect(gameObject._id).toEqual(testGameID)
            expect(board.turn).toEqual("w")
            expect(gameObject.player_w).toEqual(testUsername)
            expect(gameObject.player_b).toEqual('Test_User')
            expect(gameObject.winner).toBeNull()
            expect(board.toString().length).toBe(64)

            await Services.deleteUser(otherUserToken, 'Test_User')
            await Services.deleteGame(testGameID)
        })

        it('Connect to a closed game', async () => {
            const otherUserToken = await Services.createUser('Test_User', 'Test_Password')
            await Services.createGame(testToken, testGameID, true, 'Test_User')

            // Connect as the invited user
            const response = await supertest(ExpressApp)
                .get(resources.games + `/connect?id=${testGameID}`)
                .send({
                    'id': testGameID
                })
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + otherUserToken)

            expect(response.status).toBe(200)
            const gameObject = response.body.data as GameObject
            const board = BoardObject.fromMoves(gameObject.moves)
            expect(gameObject._id).toEqual(testGameID)
            expect(board.turn).toEqual("w")
            expect(gameObject.player_w).toEqual(testUsername)
            expect(gameObject.player_b).toEqual('Test_User')
            expect(gameObject.winner).toBeNull()
            expect(board.toString().length).toBe(64)

            // Re-connect as the game creator
            const response1 = await supertest(ExpressApp)
                .get(resources.games + `/connect?id=${testGameID}`)
                .send({
                    'id': testGameID
                })
                .set('Accept', 'application/json')
                .set('Authorization', calcAuthorizationHeader())

            expect(response1.status).toBe(200)
            const gameObject1 = response.body.data as GameObject
            const board1 = BoardObject.fromMoves(gameObject.moves)
            expect(gameObject1._id).toEqual(testGameID)
            expect(board1.turn).toEqual("w")
            expect(gameObject1.player_w).toEqual(testUsername)
            expect(gameObject1.player_b).toEqual('Test_User')
            expect(gameObject1.winner).toBeNull()
            expect(board1.toString().length).toBe(64)

            await Services.deleteUser(otherUserToken, 'Test_User')
            await Services.deleteGame(testGameID)
        })

        it('Make a move on remote game invalid turn', async () => {
            const otherUserToken = await Services.createUser('Test_User', 'Test_Password')
            await Services.createGame(testToken, testGameID, true, 'Test_User')

            const response = await supertest(ExpressApp)
                .get(resources.games + `/makemove?id=${testGameID}&move=pb2b4`)
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + otherUserToken)

            expect(response.status).toBe(403)
            expect(response.body.error).toEqual(ERRORS.NOT_YOUR_TURN)

            await Services.deleteUser(otherUserToken, 'Test_User')
            await Services.deleteGame(testGameID)
        })

        it('Make a move on remote game valid turn', async () => {
            const otherUserToken = await Services.createUser('Test_User', 'Test_Password')
            await Services.createGame(testToken, testGameID, true, 'Test_User')

            const response = await supertest(ExpressApp)
                .get(resources.games + `/makemove?id=${testGameID}&move=pb2b4`)
                .set('Accept', 'application/json')
                .set('Authorization', calcAuthorizationHeader())

            expect(response.status).toBe(200)
            const updatedGameObject = response.body.data as GameObject
            const board = BoardObject.fromMoves(updatedGameObject.moves)
            expect(updatedGameObject._id).toEqual(testGameID)
            expect(board.turn).toEqual("b")
            expect(updatedGameObject.winner).toBeNull()
            expect(board.toString()).toBe('rnbqkbnrpppppppp                 P              P PPPPPPRNBQKBNR')

            // Get updated game as player_black
            const getRemoteGameBlack = await supertest(ExpressApp)
                .get(resources.games + `?id=${testGameID}`)
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + otherUserToken)

            expect(getRemoteGameBlack.status).toBe(200)
            const updatedGameObjectB: GameObject = getRemoteGameBlack.body.data
            const board1 = BoardObject.fromMoves(updatedGameObject.moves)
            expect(updatedGameObjectB._id).toEqual(testGameID)
            expect(board1.turn).toEqual("b")
            expect(updatedGameObjectB.winner).toBeNull()
            expect(board1.toString()).toBe('rnbqkbnrpppppppp                 P              P PPPPPPRNBQKBNR')

            await Services.deleteUser(otherUserToken, 'Test_User')
            await Services.deleteGame(testGameID)
        })
    })
})