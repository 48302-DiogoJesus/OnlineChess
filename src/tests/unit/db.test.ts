import ERRORS, { ErrorObject } from '../../errors/errors'
import { BoardObject } from '../../model/board'
import Services from '../../services'
import CONFIG from '../../config'
import { clearDatabase, connectMongoDB } from '../../db/common'

describe('Services Tests', () => {

    CONFIG.TEST_ENV = true
    connectMongoDB().then(() => clearDatabase())

    const testUsername = '|T-e-s-t|U-s-e-r|'
    const testPassword = 'TestPassword'
    var testToken = ''
    const testGameID = 'L|O|C|A|L|G|A|M|E|ID'

    const expectThrow = async (block: (...args: any[]) => any, ...args: any[]) => {
        try {
            await block(...args)
        } catch (err) {
            return (err as ErrorObject)
        }
    }

    beforeEach(async () => {
        try {
            await Services.deleteGame(testGameID)
        } catch { }
        try {
            await Services.deleteUser(testToken, testUsername)
        } catch { }
        try {
            testToken = await Services.createUser(testUsername, testPassword)
        } catch { }
        try {
            await Services.createGame(testToken, testGameID, true, null)
        } catch { }
    })

    afterEach(async () => {
        try {
            await Services.deleteGame(testGameID)
        } catch { }
        try {
            await Services.deleteUser(testToken, testUsername)
        } catch { }
    })

    describe('Users', () => {

        test('Get all users', async () => {
            expect((await Services.getUsers(testToken)).length).toBe(1)
        })

        test('User exists unauthenticated', async () => {
            expect((await expectThrow(Services.userExists, 'INVALID_TOKEN', testUsername))!!.message).toBe(ERRORS.INVALID_TOKEN.message)
        })

        test('User exists', async () => {
            expect(await Services.userExists(testToken, testUsername)).toBeTruthy()
        })

        test('User does not exist', async () => {
            expect(await Services.userExists(testToken, 'Some non existing user')).toBeFalsy()
        })

        test('Create valid User', async () => {
            const token2 = await Services.createUser('Test_User_2', 'Mypassword2')
            expect(token2).toBeDefined()
            await Services.deleteUser(token2, 'Test_User_2')
        })

        test('Create duplicate User', async () => {
            const token2 = await Services.createUser('Test_User_2', 'Mypassword2')
            expect(token2).toBeDefined()
            expect((await expectThrow(Services.createUser, 'Test_User_2', 'Mypassword5'))!!.message).toBe(ERRORS.USER_ALREADY_EXISTS.message)
            await Services.deleteUser(token2, 'Test_User_2')
        })

        test('Create user with invalid username 1', async () => {
            expect((await expectThrow(Services.createUser, 'T-1', 'Mypassword5'))!!.message).toBe(ERRORS.INVALID_USERNAME_LENGTH.message)
        })

        test('Create user with invalid username 2', async () => {
            expect((await expectThrow(Services.createUser, 'Test-123', 'Myp'))!!.message).toBe(ERRORS.INVALID_PASSWORD_LENGTH.message)
        })

        test('Get user rank', async () => {
            const rank = (await Services.getUserPublic(testToken, testUsername)).rank
            expect(rank).toBeDefined()
            expect(rank).toBe("0")
        })

        test('Validate valid credentials', async () => {
            expect(await Services.validateCredentials(testUsername, testPassword)).toBeTruthy()
        })

        test('Validate invalid credentials', async () => {
            expect((await expectThrow(Services.validateCredentials, testUsername, 'NewPassword'))!!.message).toBe(ERRORS.WRONG_PASSWORD.message)
        })

        test('Validate credentials from unexisting user', async () => {
            expect((await expectThrow(Services.validateCredentials, "asjhdksdfkksdjhfjksdfh", 'PASSWORD_HERE'))!!.message).toBe(ERRORS.USER_DOES_NOT_EXIST.message)
        })

        test('Update user password', async () => {
            await Services.updateUserPassword(testToken, 'NewPassword')
            expect(await Services.validateCredentials(testUsername, 'NewPassword')).toBeTruthy()
        })

        test('Update user public rank', async () => {
            await Services.updateUserPublic(testToken, testUsername, { rank: 92 })
            expect((await Services.getUserPublic(testToken, testUsername)).rank).toBe("92")
        })

        describe('User Friends', () => {

            test('Get friends from unexisting user', async () => {
                expect((await expectThrow(Services.getFriends, testToken, "Other user"))).toEqual(ERRORS.USER_DOES_NOT_EXIST)
            })

            test('Get friends from himself', async () => {
                const friends = await Services.getFriends(testToken, testUsername)
                expect(friends.length).toBe(0)
            })

            test('Get friends from other user', async () => {
                const token2 = await Services.createUser('Test_User_2', 'Test_Password')

                const friends = await Services.getFriends(testToken, 'Test_User_2')
                expect(friends.length).toBe(0)

                await Services.deleteUser(token2, 'Test_User_2')
            })

            test('Add unexisting friend to user', async () => {
                expect((await expectThrow(Services.addFriend, testToken, "Other user"))).toEqual(ERRORS.USER_DOES_NOT_EXIST)
            })

            test('Add friend to user', async () => {
                const token2 = await Services.createUser('Test_User_2', 'Test_Password')

                await Services.addFriend(testToken, 'Test_User_2')

                const friends = await Services.getFriends(testToken, testUsername)
                expect(friends.length).toBe(1)
                expect(friends[0]).toBe('Test_User_2')

                await Services.deleteUser(token2, 'Test_User_2')
            })

            test('Add duplicate friend to user', async () => {
                const token2 = await Services.createUser('Test_User_2', 'Test_Password')

                await Services.addFriend(testToken, 'Test_User_2')

                const friends = await Services.getFriends(testToken, testUsername)
                expect(friends.length).toBe(1)
                expect(friends[0]).toBe('Test_User_2')

                expect((await expectThrow(Services.addFriend, testToken, 'Test_User_2'))).toEqual(ERRORS.USER_ALREADY_HAS_THAT_FRIEND)

                const friends1 = await Services.getFriends(testToken, testUsername)
                expect(friends1.length).toBe(1)
                expect(friends1[0]).toBe('Test_User_2')

                await Services.deleteUser(token2, 'Test_User_2')
            })

            test('Remove undexisting friend', async () => {
                expect((await expectThrow(Services.removeFriend, testToken, 'Test_User_2'))).toEqual(ERRORS.USER_DOES_NOT_HAVE_THAT_FRIEND)
            })

            test('Valid remove friend', async () => {
                const token2 = await Services.createUser('Test_User_2', 'Test_Password')

                await Services.addFriend(testToken, 'Test_User_2')

                const friends = await Services.getFriends(testToken, testUsername)
                expect(friends.length).toBe(1)
                expect(friends[0]).toBe('Test_User_2')

                await Services.removeFriend(testToken, 'Test_User_2')

                const friends1 = await Services.getFriends(testToken, testUsername)
                expect(friends1.length).toBe(0)

                await Services.deleteUser(token2, 'Test_User_2')
            })
        })
    })

    describe('Games', () => {

        test('Create a public game (another player can join with black pieces)', async () => {
            await Services.deleteGame(testGameID)
            await Services.createGame(testToken, testGameID, true, null)
            expect(await Services.gameExists(testToken, testGameID)).toBeTruthy()
        })

        test('Create a game where player with black pieces does not exist', async () => {
            await Services.deleteGame(testGameID)
            expect((await expectThrow(Services.createGame, testToken, testGameID, true, "N/A"))!!.message).toBe(ERRORS.PLAYER2_DOES_NOT_EXIST.message)
            expect(await Services.gameExists(testToken, testGameID)).toBeFalsy()
        })

        test('Create a private game with 2 players', async () => {
            const newUserToken = await Services.createUser('test_user', 'test_password')
            await Services.deleteGame(testGameID)
            await Services.createGame(testToken, testGameID, true, 'test_user')
            expect(await Services.userExists(testToken, 'test_user')).toBeTruthy()
            expect(await Services.gameExists(testToken, testGameID)).toBeTruthy()
            const game = await Services.getGame(testGameID, testToken)
            const board = BoardObject.fromMoves(game.moves)
            await Services.deleteUser(newUserToken, 'test_user')
            expect(game._id).toBe(testGameID)
            expect(game.player_w).toBe(testUsername)
            expect(game.player_b).toBe('test_user')
            expect(board.turn).toBe("w")
            expect(game.winner).toBeNull()
        })

        test('Create game with invalid Game ID', async () => {
            await Services.deleteGame(testGameID)
            expect((await expectThrow(Services.createGame, testToken, ""))!!.message).toBe(ERRORS.INVALID_GAMEID_LENGTH.message)
            expect(await Services.gameExists(testToken, testGameID)).toBeFalsy()
        })

        test('Valid moves on the board', async () => {
            const token2 = await Services.createUser('New_User_2', 'mypassword')

            expect(await Services.connectToGame(token2, testGameID)).toBeTruthy()
            expect((await Services.getGame(testGameID, token2)).player_w).toBe(testUsername)
            expect((await Services.getGame(testGameID, token2)).player_b).toBe('New_User_2')

            expect((await expectThrow(Services.executeGameMove, token2, testGameID, 'pb2b4'))!!.message).toBe(ERRORS.NOT_YOUR_TURN.message)
            expect(await Services.executeGameMove(testToken, testGameID, 'pb2b4')).toBeTruthy()
            const updatedGame = await Services.getGame(testGameID, testToken)
            const updatedBoard = BoardObject.fromMoves(updatedGame.moves)
            expect(updatedBoard.turn).toBe("b")
            expect(updatedBoard.toString()).toBe("rnbqkbnrpppppppp                 P              P PPPPPPRNBQKBNR")

            expect((await expectThrow(Services.executeGameMove, testToken, testGameID, 'pb2b4'))!!.message).toBe(ERRORS.NOT_YOUR_TURN.message)
            expect(await Services.executeGameMove(token2, testGameID, 'pb7b6')).toBeTruthy()

            const updatedGame1 = await Services.getGame(testGameID, testToken)
            const updatedBoard1 = BoardObject.fromMoves(updatedGame1.moves)

            expect(updatedBoard1.turn).toBe("w")
            expect(updatedBoard1.toString()).toBe("rnbqkbnrp pppppp p               P              P PPPPPPRNBQKBNR")

            await Services.deleteUser(token2, 'New_User_2')
        })
    })
})